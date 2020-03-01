<template>
  <div class="courseBaseInfo">
    <el-form :model="courseForm" label-width="80px" :rules="courseRules" ref="courseForm">
      <el-form-item label="课程名称" prop="name">
        <el-input v-model="courseForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="适用人群" prop="users">
        <el-input type="textarea" v-model="courseForm.users" auto-complete="off"></el-input>
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
        <b v-for="grade in gradeList">
          <el-radio v-model="courseForm.grade"
                    :label="grade.id"
                    v-if="grade.sdStatus==='1'">
            {{grade.sdName}}
          </el-radio>&nbsp;&nbsp;
        </b>
      </el-form-item>
      <el-form-item label="学习模式" prop="studymodel">
        <b v-for="model in studymodelList">
          <el-radio v-model="courseForm.studymodel"
                    :label="model.id"
                    v-if="model.sdStatus==='1'">
            {{model.sdName}}
          </el-radio>&nbsp;&nbsp;
        </b>

      </el-form-item>

      <el-form-item label="课程介绍" prop="description">
        <el-input type="textarea" v-model="courseForm.description"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click.native="save()" :loading="editLoading">提交</el-button>
    </div>
  </div>
</template>

<script>
  import {findDictionaryApi} from '../../../service/system'
  import {findCategoryTreeApi, findCourseBaseById, updateCourseBaseApi} from '../../../service/course'

  export default {
    name: "courseBaseInfo",
    data() {
      return {
        dotype: '',
        courseid: '',
        studymodelList: [],//学习模式字典
        gradeList: [],//课程等级字典
        editLoading: false,
        props: {
          value: 'name',
          label: 'name',
          children: 'children'
        },
        categoryList: [],//所有分类数组
        categoryActive: [],//选择的分类
        courseForm: {
          id: '',
          name: '',
          users: '',
          grade: '',
          studymodel: '',
          mt: '',
          st: '',
          description: ''
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
      save() {
        //修改课程
        this.$refs.courseForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              let mt = this.categoryActive[0];
              let st = this.categoryActive[1];
              this.courseForm.mt = mt;
              this.courseForm.st = st;
              let id = this.courseForm.id;
              console.log('编辑参数', this.courseForm);
              updateCourseBaseApi(id, this.courseForm).then((res) => {
                this.editLoading = false;
                if (res.success) {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                } else {
                  this.$message({
                    message: res.message,
                    type: 'error'
                  });
                }
              });
            });
          }
        });
      }
    },
    mounted() {
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
      //查询课程信息
      //课程id
      this.courseid = this.$route.query.courseid;
      findCourseBaseById(this.courseid).then((res) => {
        if (!res) {
          this.$message.warning("暂无课程基本信息！")
        } else {
          this.courseForm = {...res};
          //课程分类显示，需要两级分类
          this.categoryActive[0] = this.courseForm.mt;
          this.categoryActive[1] = this.courseForm.st;
          console.log(this.categoryActive);
        }
      });
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/course/components/courseBaseInfo";
</style>
