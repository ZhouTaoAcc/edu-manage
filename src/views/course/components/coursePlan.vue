<template>
  <div class="coursePlan">
    <div class="tree-area">
      <div class="course-title">
        <h4>课程名称:{{courseName}}</h4>
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
    <!--点击节点 显示该节点的内容-->
    <div class="showContent">

    </div>
    <!--添加课程计划-->
    <el-dialog :title="editorTitle" :visible.sync="coursePlanFormVisible">
      <el-form ref="coursePlanForm"
               :model="coursePlanForm"
               label-width="200px"
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
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="coursePlanForm.status">
            <el-radio class="radio" label="0">未发布</el-radio>
            <el-radio class="radio" label='1'>已发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="BottomBtn">
          <el-button type="primary" @click="submitPlan">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加媒体资源弹框-->

  </div>
</template>

<script>
  import {
    findCoursePlanApi,
    addCoursePlanApi,
    findCoursePlanById,
    deleteCoursePlanById,
    findCourseBaseById
  } from '../../../service/course'

  export default {
    name: "coursePlan",
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
        currentNodeName: '',//存当前节点name
        coursePlanForm: {//添加的课程计划
          parentid: '',//父节点id
          pname: '',
          ptype: '',
          grade: '',
          timelength: '',
          status: '',
          orderby: '',
          description: '',
          courseid: this.$route.query.courseid
        },
        editorFlag: false,//是否编辑
        editorTitle: '',//标题
        courseName: '',
        rules: {
          pname: [
            {required: true, message: '请输入课程计划名称', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择状态', trigger: 'blur'}
          ]
        }
      }

    },
    methods: {
      findCoursePlan() {//查询本课程的课程计划树
        findCoursePlanApi(this.courseid).then(res => {
          if (res && res.children) {
            this.coursePlanList = res.children;
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
          <span
            style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 16px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button style="font-size: 14px;" type="text"
                         on-click={() => this.chooseVideo(data)}>{data.mediaFileOriginalName}&nbsp;&nbsp;&nbsp;&nbsp; 选择视频</el-button>
              <el-button class="el-icon-plus" style="font-size: 14px;" type="text"
                         on-click={() => this.addBtn(node, data)}>增加</el-button>
              <el-button class="el-icon-edit" style="font-size: 14px;" type="text"
                         on-click={() => this.editBtn(data)}>修改</el-button>
              <el-button class="el-icon-delete" style="font-size: 14px;" type="text"
                         on-click={() => this.remove(data)}>删除</el-button>
            </span>
          </span>);
      },
      handleNodeClick(data) {//当前节点 点击事件

      },
      //选择视频，打开窗口
      chooseVideo(data) {
        console.log(data);
        //得到当前的节点的内容
        this.coursePlanId = data.id;
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
      }
    },
    mounted() {
      //课程id
      this.courseid = this.$route.query.courseid;
      //查询课程计划
      this.findCoursePlan();

      findCourseBaseById(this.courseid).then((res) => {
        this.courseName = res.name;
      });
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/course/components/coursePlan";
</style>
