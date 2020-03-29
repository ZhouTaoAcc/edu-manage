<template>
  <div class="coursePlan">
    <div class="tree-area">
      <div class="course-title">
        <span class="el-icon-circle-plus operation" @click="addCoursePlanBtn"> 添加课程计划</span>
        <h4>课程名称:{{rootName}}</h4>
        <h5>&nbsp;&nbsp;课程计划</h5>
      </div>
      <!--采用自定义树形控件-->
      <el-tree
        :data="coursePlanList"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        highlight-current
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
        :render-content="renderContent">
      </el-tree>
    </div>
    <!--添加课程计划-->
    <el-dialog :title="editorTitle" :visible.sync="coursePlanFormVisible">
        <el-form ref="coursePlanForm"
                 :model="coursePlanForm"
                 label-width="250px"
                 style="width:500px;"
                 :rules="rules">
          <el-form-item label="上级结点" v-if="!editorFlag">
            <el-input v-model="this.currentNodeName" disabled></el-input>
          </el-form-item>
          <el-form-item label="章节/课时名称" prop="pname">
            <el-input v-model="coursePlanForm.pname" auto-complete="off" placeholder="章节/课时名称"></el-input>
          </el-form-item>
          <el-form-item label="课程类型">
            <el-radio-group v-model="coursePlanForm.ptype">
              <el-radio class="radio" label='1'>视频</el-radio>
              <el-radio class="radio" label='2'>文档</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="学习时长(分钟)">
            <el-input type="number" v-model="coursePlanForm.timelength" placeholder="请输入学习时长"
                      auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序值">
            <el-input type="number" v-model="coursePlanForm.orderby" placeholder="值越小,越靠前"></el-input>
          </el-form-item>
          <el-form-item label="章节/课时介绍" prop="description">
            <el-input type="textarea" v-model="coursePlanForm.description" placeholder="章节/课时介绍"></el-input>
          </el-form-item>
          <el-form-item class="BottomBtn">
            <el-button type="primary" @click="submitPlan">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    <div class="choosemedia">
    <!--添加媒体资源弹框-->
    <el-dialog title="课程绑定媒资" :visible.sync="mediaFormVisible" width="1300px">
      <media-list :isChoose="true" @choosemedia="choosemedia"></media-list>
    </el-dialog>
    </div>
    <!--点击节点 显示该节点的媒资视频-->
    <div class="showContent">
      <h4>视频预览</h4>
      <my-video-player :videoUrl=this.videoUrl></my-video-player>
    </div>
  </div>
</template>

<script>
  import {
    findCoursePlanApi,
    addCoursePlanApi,
    findCoursePlanById,
    deleteCoursePlanById,
    addMediaApi,
    findPlanMediaApi
  } from '../../../service/course'
  import mediaList from '../../media/mediaListManage'
import myVideoPlayer from '../../../components/myVideoPlayer'
  export default {
    name: "coursePlan",
    components: {
      mediaList,
      myVideoPlayer
    },
    data() {
      return {
        coursePlanList: [],//课程计划树
        coursePlanId: '',//课程计划主键
        mediaFormVisible: false,//增加媒质 弹框是否显示
        coursePlanFormVisible: false,//增加课程计划 弹框是否显示
        defaultProps: {//配置列表
          label: 'pname',
          children: 'children'
        },
        rootId: '',//顶层父亲id
        rootName: '',//顶层父亲name
        currentNodeName: '',//存当前节点name
        coursePlanForm: {//添加的课程计划
          parentid: '',//父节点id
          pname: '',
          ptype: '',
          grade: '',//层级 1 2 3 4级
          timelength: '',
          status: '',
          orderby: '',
          description: '',
          courseid: this.$route.query.courseid
        },
        courseMediaForm: {//添加的课程计划对应的媒质信息
          courseId: this.$route.query.courseid,
          courseplanId: '',
          mediaUrl: '',
          mediaId: '',
          mediaName: ''
        },
        editorFlag: false,//是否编辑
        editorTitle: '',//标题
        rules: {
          pname: [
            {required: true, message: '请输入课程计划名称', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择状态', trigger: 'blur'}
          ]
        },
        videoUrl:''
      }
    },
    methods: {
      findCoursePlan() {//查询本课程的课程计划树
        findCoursePlanApi(this.courseid).then(res => {
          if (res && res.children) {
            console.log(res);
            this.rootId = res.id;
            this.rootName = res.pname;
            this.coursePlanList = res.children;
            console.log('本课程计划=>', this.coursePlanList)
          }
        })
      },
      /**
       树节点的内容区的渲染 使用jsx语法
       node 返回节点的所有信息，包括子节点 父节点的信息
       data 返回当前节点的所有数据
       store 返回全树的信息
       */
      renderContent(h, {node, data, store}) {
        return (
          <span style = "flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 16px; padding-right: 8px;" >
          <span>
          <span> {node.label}</span> </span>
        <span>
        <el-button style = "font-size: 14px;"type = "text" on-click = {()=>this.chooseVideo(data)} >&nbsp;&nbsp;&nbsp;&nbsp;选择视频 </el-button>
        <el-button class= "el-icon-plus"style = "font-size: 14px;"type = "text"on-click = {()=>this.addBtn(node, data)}>增加 < /el-button>
        <el-button class= "el-icon-edit"style = "font-size: 14px;"type = "text"on-click = {()=>this.editBtn(data)}>修改 < /el-button>
        <el-button class= "el-icon-delete"style = "font-size: 14px;"type = "text"on-click = {()=>this.remove(data)}>删除
        </el-button>
        </span>
        </span>);
      },
      handleNodeClick(data) {//当前节点 点击事件
        findPlanMediaApi(data.id).then(res=>{
          if(data.children.length===0){//表示当前节点是叶子
            if(res&&res.mediaUrl){
              this.videoUrl="http://video.eduonline.com/video/"+res.mediaUrl
            }else {
              this.$message.warning("暂未绑定媒资信息,请绑定!");
            }
          }
        });
      },
      //选择视频，打开窗口
      chooseVideo(data) {
        if(data.children.length>0){
          this.$message.warning("当前节点不可以绑定视频!");
          return;
        }
        //得到当前的节点的内容
        this.courseMediaForm.courseplanId = data.id;
        this.mediaFormVisible = true;//打开窗口
      },
      //增加子节点按钮
      addBtn(node, data) {
        this.editorFlag = false;
        this.editorTitle = '增加课程计划';
        this.resetForm();
        console.log(node, data);
        const currentName = node.data.pname;//获取当前点击的节点name
        const currentId = node.data.id;//获取当前点击的节点id
        const currentLevel = node.level + 2;//获取当前点击节点的层级 (+2 表示新增子节点层级)
        this.currentNodeName = currentName;
        this.coursePlanForm.parentid = currentId;
        this.coursePlanForm.grade = currentLevel;
        if (currentLevel <= 4) {
          this.coursePlanFormVisible = true;
        } else {
          this.$message.warning("最多支持3级!");
        }
      },
      //添加顶级节点
      addCoursePlanBtn() {
        this.resetForm();
        this.editorFlag = false;
        this.editorTitle = '增加课程计划';
        this.coursePlanFormVisible = true;
        this.coursePlanForm.parentid = this.rootId;
        this.coursePlanForm.grade = '1';
        this.currentNodeName = this.rootName;
      },
      //提交课程计划到数据库
      submitPlan() {
        this.$refs.coursePlanForm.validate(valid => {
          if (valid) {
            console.log("提交子节点参数", this.coursePlanForm);
            addCoursePlanApi(this.coursePlanForm).then(res => {
              if (res.success) {
                this.findCoursePlan();
                this.$message.success("操作成功！");
              } else {
                this.$message.error(res.message);
              }
              this.coursePlanFormVisible = false;
            });
          }
        });
      },
      resetForm() {
        this.coursePlanForm = {};
        this.coursePlanForm.courseid = this.$route.query.courseid;
      },
      //编辑节点
      editBtn(data) {
        this.editorFlag = true;
        this.editorTitle = '修改课程计划';
        //回显
        findCoursePlanById(data.id).then(res => {
          if (res) {
            console.log(res);
            this.coursePlanFormVisible = true;
            this.coursePlanForm = {...res};
          } else {
            this.$message.error("获取数据失败!");
          }
        })
      },
      //删除节点
      remove(data) {
        /* console.log(node);
         const parent = node.parent;//获取其父节点
         const children = parent.data.children || parent.data;//获取父节点的所有孩子（兄弟节点）
         const index = children.findIndex(d => d.id === data.id);//找到要删除的节点
         children.splice(index, 1);//删除当前节点*/
        deleteCoursePlanById(data.id).then(res => {
          if (res.success) {
            this.findCoursePlan();
            this.$message.success("删除成功!");
            this.coursePlanForm = {...res};
          } else {
            this.$message.error("获取数据失败!");
          }
        });
      },
      choosemedia(media) {
        //子组件emit来的方法
        this.courseMediaForm.mediaId=media.fileId;
        this.courseMediaForm.mediaUrl=media.fileUrl;
        this.courseMediaForm.mediaName=media.fileOriginalName;
        this.$confirm('选择媒资成功, 是否确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitMedia(this.courseMediaForm);
        }).catch(() => {
          this.resetMediaForm();
          this.$message({
            type: 'info',
            message: '已取消选择'
          });
        });
      },
      //提交媒资到数据库
      submitMedia(val) {
        console.log('提交媒资的参数',val);
        if(val==null||val.courseplanId==null||val.mediaId==null||val.mediaId==null||val.mediaUrl==null){
          this.$message({
            type: 'error',
          message: '无效参数！'
         });
        return;
        }

        addMediaApi(this.courseMediaForm).then(res=>{
          console.log(res);
          if(res.success){
            this.$message({
              type: 'success',
              message: '添加课程媒资成功！'
            });
            this.mediaFormVisible = false;//打开窗口
          }else {
            this.$message({
              type: 'error',
              message: '添加课程媒资失败！'
            });
          }
        });
        },
      resetMediaForm() {
        this.courseMediaForm = {};
        this.courseMediaForm.courseid = this.$route.query.courseid;
      },
      },
    mounted() {
      //课程id
      this.courseid = this.$route.query.courseid;
      //查询课程计划
      this.findCoursePlan();
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/course/components/coursePlan";
</style>
