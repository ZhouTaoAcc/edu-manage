<template>
  <div class="courseBaseAdd">
    <!--面包屑行-->
    <div class="breadcrumb-operation">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="(item)  in levelList" :key="item.path" v-if="item.meta.title">
          <router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--表单-->
    <div class="content">
      <el-form :model="courseAddForm" label-width="80px" :rules="courseRules" ref="courseAddForm">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="courseAddForm.name" auto-complete="on"></el-input>
        </el-form-item>
        <el-form-item label="适用人群" prop="users">
          <el-input type="textarea" v-model="courseAddForm.users" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程分类" prop="categoryActive">
          <el-cascader
            expand-trigger="hover"
            :options="categoryList"
            v-model="categoryActive"
            :props="props">
          </el-cascader>
        </el-form-item>
        <el-form-item label="课程等级" prop="grade">
          <span v-for="grade in gradeList">
            <el-radio v-model="courseAddForm.grade"
                      :label="grade.id"
                      v-if="grade.sdStatus==='1'">
              {{grade.sdName}}
            </el-radio>&nbsp;&nbsp;
          </span>
        </el-form-item>
        <el-form-item label="学习模式" prop="studymodel">
          <span v-for="model in studymodelList">
            <el-radio v-model="courseAddForm.studymodel"
                      :label="model.id"
                      v-if="model.sdStatus==='1'">
              {{model.sdName}}
            </el-radio>&nbsp;&nbsp;
          </span>
        </el-form-item>
        <el-form-item label="课程介绍" prop="description">
          <el-input type="textarea" v-model="courseAddForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="clear()">清空</el-button>
        <el-button type="primary" @click.native="save()">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {findDictionaryApi} from '../../service/system'
  import {findCategoryTreeApi, addCourseBaseApi} from '../../service/course'
import Utils from '../../../utils/utils'
  export default {
    name: "courseBaseAdd",
    data() {
      return {
        studymodelList: [],//学习模式字典
        gradeList: [],//课程等级字典
        levelList: [],//面包屑
        props: {
          /*级联绑定*/
          value: 'name',
          label: 'name',
          children: 'children'
        },
        categoryList: [],//所有分类数组
        categoryActive: [],//选择的分类
        courseAddForm: {
          id: '',
          name: '',
          users: '',
          grade: '',
          studymodel: '',
          mt: '',
          st: '',
          description: '',
          status:'202001', //课程状态 制作中
          companyId:'',
        },
        courseRules: {
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'}
          ],
          category: [
            {required: true, message: '请选择课程分类', trigger: 'blur'}
          ],
          grade: [
            {required: true, message: '请选择课程等级', trigger: 'blur'}
          ],
          studymodel: [
            {required: true, message: '请选择学习模式', trigger: 'blur'}
          ]

        }
      }
    },
    methods: {
      //生成面包屑
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => item.name);
        const first = matched[0];
        if (first && first.name !== '') {
          matched = [{path: '/courseManage', meta: {title: '课程管理'}}].concat(matched)
        }
        this.levelList = matched;
      },
      //新增课程提交
      save() {
        this.$refs.courseAddForm.validate((valid) => {
          if (valid) {
            //处理课程分类
            this.courseAddForm.mt = this.categoryActive[0];//大分类
            this.courseAddForm.st = this.categoryActive[1];//小分类
            console.log('添加参数', this.courseAddForm);
            addCourseBaseApi(this.courseAddForm).then(res => {
              if (res.success) {
                this.$message.success(res.message);
                //跳转到我的课程
                this.$router.push({path: '/courseManage/myCourse/list'})
              } else {
                this.$message.error(res.message)
              }
            })
          }
        })
      },
      clear() {
        for (let k in this.courseAddForm) {
          this.courseAddForm[k] = '';
        }
      }
    },
    created() {

    },
    mounted() {
      this.getBreadcrumb();
      //所有课程分类(14大类)
      findCategoryTreeApi().then(res => {
        console.log('课程分类', res);
        this.categoryList = res.children;
      });
      /*查询数据字典*/
      //查询课程等级type=200
      findDictionaryApi('200').then(res => {
        console.log('课程等级字典', res);
        this.gradeList = res.children;
      });
      //查询学习模式type=201
      findDictionaryApi('201').then(res => {
        console.log('学习模式字典', res);
        this.studymodelList = res.children;
      });
     let activeUser= Utils.getActiveUser();
     if(activeUser.companyId){
       this.courseAddForm.companyId= activeUser.companyId
     }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../styles/course/courseBaseAdd";
</style>
