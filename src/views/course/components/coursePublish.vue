<template>
  <div class="coursePublish">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>课程预览</span>
      </div>
      <div class="text item">
        <el-button type="primary" @click.native="coursePreview()">课程预览</el-button>
        <br/><br/>
        <span v-if="previewurl && previewurl!=''"><a :href="previewurl" target="_blank">点我查看课
程预览页面 </a> </span>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>课程发布</span>
        <!--<span style="float: right">课程发布</span>-->
      </div>
      <div class="item">
        <div v-if="course.status == '202001'">
          <div class="text"><span>状态：</span>
            <span class="status doing">制作中</span></div>
          <br/><br/>
          <el-button type="primary" @click.native="publish">新课程发布</el-button>
        </div>
        <div v-else-if="course.status == '202003'">
          <div class="text"><span>状态：</span><span class="status done">已下线</span></div>
          <br/><br/>
          <div><a :href="'http://www.eduonline.com/course/detail/'+this.courseid+'.html'"
                  target="_blank">点我查看课程详情页面 </a></div>
        </div>
        <div v-else-if="course.status == '202002'">
          <div class="text"><span>状态：</span><span class="status pub">已发布</span>
          </div>
          <br/><br/>
          <el-button type="primary" @click.native="publish">更新发布</el-button>
          <br/><br/>
          <div><a :href="'http://www.eduonline.com/course/detail/'+this.courseid+'.html'"
                  target="_blank">点我查看课程详情页面 </a></div>
        </div>
      </div>
    </el-card>
  </div>
  </div>

</template>

<script>
  import {coursePreviewApi, findCourseBaseById, coursePublishApi} from '../../../service/course'

  export default {
    name: "coursePublish",
    data() {
      return {
        courseid: '',
        previewurl: '',//预览的url
        pageUrl: '',//发布之后页面的url
        course: {}
      }
    },
    methods: {
      coursePreview() {
        coursePreviewApi(this.courseid).then(res => {
          if (res.success) {
            this.$message.success("页面已生成！");
            this.previewurl = res.url;
          } else {
            this.$message.error("页面生成失败！");
          }
        })
      },
      publish() {
        coursePublishApi(this.courseid).then(res => {
          if (res.success) {
            this.$message.success("页面已发布！");
            this.pageUrl = res.url;
            this.findCourseBase();
          } else {
            this.$message.error(res.message);
          }
        });

      },
      findCourseBase(){
        findCourseBaseById(this.courseid).then(res => {
          this.course = {...res}
        })
      }
    },
    mounted() {
      this.courseid = this.$route.query.courseid;
      this.findCourseBase();
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/course/components/coursePublish";
</style>
