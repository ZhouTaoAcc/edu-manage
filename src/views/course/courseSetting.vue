<template>
  <div>
    <!--课程设置导航栏-->
    <el-menu
      :default-active="$router.path"
      router
      class="el-menu-demo"
      mode="horizontal"
    >
      <el-menu-item :index="{ path:'/courseManage/setting/courseIndex',  query: {courseid: this.courseid }}">课程首页
      </el-menu-item>
      <el-menu-item :index="{ path:'/courseManage/setting/baseInfo',  query: {courseid: this.courseid }}">基本信息
      </el-menu-item>
      <el-menu-item :index="{ path:'/courseManage/setting/picture',  query: {courseid: this.courseid }}">课程图片
      </el-menu-item>
      <el-menu-item :index="{ path:'/courseManage/setting/marketInfo', query: {courseid: this.courseid }}">课程营销
      </el-menu-item>
      <el-menu-item :index="{ path:'/courseManage/setting/plan', query: {courseid: this.courseid }}">课程计划
      </el-menu-item>
      <el-menu-item :index="{ path:'/courseManage/setting/teacher', query: {courseid: this.courseid }}">教师信息
      </el-menu-item>
      <el-menu-item :index="{ path:'/courseManage/setting/publish', query: {courseid: this.courseid }}">发布课程
      </el-menu-item>
    </el-menu>
    <!--components下面的组件都在此处渲染-->
    <router-view class="setting-main"></router-view>
  </div>
</template>

<script>
  export default {
    name: "courseSetting",
    data() {
      return {
        courseid: ''
      }
    },
    mounted() {
      //课程id
      this.courseid = this.$route.query.courseid;
      //跳转到课程基本信息
      this.$router.push({
        path: '/courseManage/setting/baseInfo',
        query: {courseid: this.courseid}
      })
    }
  }
</script>

<style scoped lang="scss">
  /*导航栏样式*/
  .el-menu-demo {
    border-radius: 4px;
    margin-bottom: 16px;
    box-shadow: 0 0 10px 0 rgba(128, 145, 165, 0.2);
    /deep/ .el-menu-item {
      text-align: center;
      width: 150px;
    }
  }

  //锚点区域
  .setting-main {
    background: #FFF;
    box-sizing: border-box;
    padding: 16px;
    border-radius: 4px;
    flex: 1;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 10px 0 rgba(128, 145, 165, 0.2);
  }

</style>
