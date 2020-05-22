<template>
  <div class="edu-courseManageList-contain">
    <!--面包屑行-->
    <div class="breadcrumb-operation">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="(item)  in levelList" :key="item.path" v-if="item.meta.title">
          <router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--查询部分-->
    <div class="edu-courseManageList-top">
      <el-form
        class="edu-courseManageList-ft"
        label-position="right"
        :model="searchCourseParams"
        ref="searchCourseParams"
      >
        <div class="edu-courseManageList-fdy">
          <el-form-item
            label="课程名称："
            class="edu-courseManageList-fiu"
            prop="name"
          >
            <el-input
              v-model="searchCourseParams.name"
              placeholder="请输入课程名称"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <!--<el-form-item-->
            <!--label="所属公司："-->
            <!--class="edu-courseManageList-fiu"-->
            <!--prop="companyId"-->
          <!--&gt;-->
            <!--<el-input-->
              <!--v-model="searchCourseParams.companyId"-->
              <!--placeholder="请输入所属公司"-->
              <!--:clearable="true"-->
            <!--&gt;</el-input>-->
          <!--</el-form-item>-->
          <el-form-item
            label="课程状态："
            class="edu-courseManageList-fiu"
            prop="status"
          >
            <el-select v-model="searchCourseParams.status" placeholder="请选择课程状态"
                       clearable>  
              <el-option v-for="item in courseStatus"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="edu-courseManageList-fdy">
          <el-form-item
            class="edu-courseManageList-fiu"
          >
          </el-form-item>
          <el-form-item
            class="edu-courseManageList-fiu"
          >
          </el-form-item>
          <el-form-item
            label=" "
            class="edu-courseManageList-fiu">
            <div class="btn-click">
              <el-button type="primary" @click="searchBtn">查询</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="edu-courseManageList-center">
      <div class="edu-courseManageList-content">
        <el-row v-loading="loading">
          <el-col :span="4">
            <el-card :body-style="{ padding: '5px' }">
              <img src="/static/images/add.jpg" class="image">
              <div style="padding: 14px;">
                <span>课程名称</span>
                <div class="bottom clearfix">
                  <time class="time"></time>
                  <router-link class="mui-tab-item" :to="{path:'/courseManage/courseBase/add'}">
                    <el-button type="text" class="button">新增课程</el-button>
                  </router-link>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4" v-for="(item,index) in this.cardData" :key=index>
            <el-card :body-style="{ padding: '5px'}">
              <img :src="item.pic!==null?imgUrl+item.pic:'/static/images/noImg.jpg'"
                   class="image">
              <div style="padding: 14px;">
                <span>课程名称</span>
                <span :class="item.status=='202001'?'status doing':item.status=='202002'?'status pub':'status down'">{{item.status |formatStatus}}</span>
                <div class="bottom clearfix">
                  <span>{{item.name}}</span>
                  <el-button type="text" class="button" @click="courseSetBtn(item.id)">课程设置</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="edu-courseManageList-page">
        <div class="edu-templateList-pag-content">
          <el-pagination
            background
            layout="total,prev, pager, next"
            :total=this.totalCount
            @current-change="handleCurrentChange"
            :current-page="searchCourseParams.pageNo+1"
            :page-size="searchCourseParams.pageSize">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {findCourseListApi} from '../../service/course'
  import sysUrlConfig from '../../../static/config/baseUrl'
  import Utils from '../../../utils/utils'

  export default {
    name: "courseManageList",
    data() {
      return {
        activeUser:{},
        loading: true,
        searchCourseParams: {
          name: '',
          status: '',
          companyId: '',
          pageNo: 0,
          pageSize: 11 //每页默认显示11条
        },
        status_class: '',
        cardData: [],//存储后台返回的数据
        copyParmas: {}, //查询使用的参数
        totalCount: 0,	//总个数
        levelList: null,
        imgUrl: sysUrlConfig.imgUrl,
        courseStatus: [
          {label: "制作中", value: 202001},
          {label: "已发布", value: 202002},
          {label: "已下架", value: 202003}
        ]
      }
    },
    watch: {
      $route(to, from) {
        this.getBreadcrumb();
      }
    },
    mounted() {
      this.activeUser = Utils.getActiveUser();
      if ( this.activeUser.companyId) {
        this.searchCourseParams.companyId = this.activeUser.companyId;
        this.copyParmas = {...this.searchCourseParams};
        this.showListInfo();
      }else {
        this.$message.warning("当前用户没有企业认证！");
      }
      this.getBreadcrumb();
    },
    filters: {
      formatStatus(val) {
        if (val === '202001') {
          return '制作中';
        } else if (val === '202002') {
          return '已发布';
        } else if (val === '202003') {
          return '已下架';
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
      //查询分页内容
      showListInfo() {
        findCourseListApi(this.copyParmas).then(res => {
          console.log("查询条件--》", this.copyParmas);
          console.log("查询分页", res);
          this.cardData = res.data.list;
          this.totalCount = res.data.total;
          this.loading = false;
        }, err => {
          this.$message.warning(err);
        });
      },
      searchBtn() {
        this.searchCourseParams.pageNo = 0;
        this.copyParmas = {...this.searchCourseParams};
        this.showListInfo();
      },
      courseSetBtn(id) {
        if (id) {/*使用query方式传参 path ,query*/
          this.$router.push({
            path: '/courseManage/courseSetting',
            query: {courseid: id}
          })
        }
      },
      //页码切换方法 val [Number] 切换到的页码
      handleCurrentChange(val) {
        this.searchCourseParams.pageNo = val - 1;
        this.copyParmas.pageNo = val - 1;
        this.showListInfo();
      },
      //每页数量切换方法 val [Number] 切换到的每页数量
      handleSizeChange(val) {
        this.searchCourseParams.pageSize = val;
        this.searchCourseParams.pageNo = 0;
        this.copyParmas.pageSize = val;
        this.copyParmas.pageNo = 0;
        this.showListInfo();
      },
      resetForm() {
        for (let k in this.searchCourseParams) {
          this.searchCourseParams[k] = '';
        }
        this.searchCourseParams.companyId = this.activeUser.companyId;
        this.searchCourseParams.pageNo = 0;
        this.searchCourseParams.pageSize = 11;
        this.copyParmas = {...this.searchCourseParams};
        this.showListInfo();
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../styles/course/courseListManage";
</style>
