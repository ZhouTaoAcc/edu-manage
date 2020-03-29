<template>
  <div class="edu-mediaList-contain">
    <!--面包屑行-->
    <div class="breadcrumb-operation" v-show="!isChoose">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="(item)  in levelList" :key="item.path" v-if="item.meta.title">
          <router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <span class="operation">
         <span class="el-icon-circle-plus" @click="uploadFileBtn">上传媒质文件</span>
      </span>
    </div>
    <!--查询部分-->
    <div class="edu-mediaList-top">
      <el-form
        class="edu-mediaList-ft"
        label-position="right"
        :model="searchMediaParams"
        ref="searchMediaParams"
      >
        <div class="edu-mediaList-fdy">
          <el-form-item
            label="媒资标签："
            class="edu-mediaList-fiu"
            prop="tag"
          >
            <el-input
              v-model="searchMediaParams.tag"
              placeholder="请输入媒资标签"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="文件名称："
            class="edu-mediaList-fiu"
            prop="fileOriginalName"
          >
            <el-input
              v-model="searchMediaParams.fileOriginalName"
              placeholder="请输入文件名称"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="处理状态："
            class="edu-mediaList-fiu"
            prop="mediaId"
          >
            <el-select v-model="searchMediaParams.processStatus" clearable>
              <el-option v-for="item in processStatusList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="edu-mediaList-fdy">
          <el-form-item
            class="edu-mediaList-fiu"
          >
          </el-form-item>
          <el-form-item
            class="edu-mediaList-fiu"
          >
          </el-form-item>
          <el-form-item
            label=" "
            class="edu-mediaList-fiu">
            <div class="btn-click">
              <el-button type="primary" @click="searchBtn">查询</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!--显示结果部分-->
    <div class="edu-mediaList-content">
      <div class="edu-mediaList-res">
        <div class="edu-mediaList-tab">
          <el-table
            :data="tableMediaData"
            stripe
            v-loading="this.loading"
            element-loading-text="拼命加载中..."
          >
            <el-table-column
              prop="id"
              label="序号"
              fixed="left"
              min-width="60"
              type="index"
              :index='indexMethod'>
            </el-table-column>
            <el-table-column
              prop="fileOriginalName"
              label="原始文件名称"
              min-width="200"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.fileOriginalName||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="fileName"
              label="文件名称"
              min-width="200"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.fileName||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="fileUrl"
              label="访问URL"
              min-width="200"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.fileUrl||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="tag"
              label="标签"
              min-width="100"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.tag||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="fileSize"
              label="文件大小"
              min-width="100"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{(scope.row.fileSize/1024/1024).toFixed(2)||'--'}}{{'M'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="processStatus"
              label="处理状态"
              min-width="150"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.processStatus| formatProcessStatus}}
              </template>
            </el-table-column>
            <el-table-column
              prop="uploadTime"
              label="创建时间"
              min-width="150"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.uploadTime| formatDateTime}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="250"
              align="center"
              fixed="right">
              <template slot-scope="scope">
                <el-button class="el-icon-refresh tab-btn" v-if="scope.row.processStatus!=='303002'&&scope.row.processStatus!=='303001'" @click="processBtn(scope.row.fileId)" :loading="processloading">hls处理</el-button>
                <el-button class="el-icon-delete tab-btn" @click="deleteBtn(scope.row.fileId)"v-if="!isChoose"disabled>删除</el-button>
                <el-button class="el-icon-document-checked tab-btn" @click="chooseBtn(scope.row)" v-if="isChoose">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="edu-mediaList-pag">
          <div class="edu-mediaList-pag-content">
            <el-pagination
              :current-page="searchMediaParams.pageNo+1"
              :page-sizes="[10,20,50,100]"
              :page-size="searchMediaParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!--&lt;!&ndash;自定义组件 用于添加 修改&ndash;&gt;-->
    <!--<editor-media-->
    <!--:flag="flag"-->
    <!--:editorFlag.sync="!flag ? addmediaFlag: updatemediaFlag"-->
    <!--@addModel="addSuccess"-->
    <!--@closeModel="closeSuccess">-->
    <!--</editor-media>-->
  </div>
</template>
<script>
  import {findMediaListApi, mediaProcessApi,deleteMediaApi} from '../../service/media'
  import moment from 'moment'

  export default {
    props:{
      isChoose:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        searchMediaParams: {
          pageNo: 0,//页码
          pageSize: 10,//每页显示个数
          tag: '',//标签
          fileOriginalName: '',//文件名称
          processStatus: ''//处理状态
        },
        copyParmas: {},
        levelList: [],
        loading: false,
        processloading:false,
        tableMediaData: [],
        totalCount: 0,
        processStatusList: []
      }
    },
    filters: {
      formatProcessStatus(val) {
        let processStatus = val;
        if (processStatus) {
          if (processStatus === '303001') {
            return "处理中";
          } else if (processStatus === '303002') {
            return "处理成功";
          } else if (processStatus === '303003') {
            return "处理失败";
          } else if (processStatus === '303004') {
            return "手动处理";
          }
        }
      },
      formatDateTime(val) {
        return moment(val).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    methods: {
      //生成面包屑
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => item.name);
        const first = matched[0];
        if (first && first.name !== '') {
          matched = [{path: '/mediaManage', meta: {title: '媒资管理'}}].concat(matched)
        }
        this.levelList = matched;
      },
      searchBtn() {
        this.searchMediaParams.pageNo = 0;
        this.copyParmas = {...this.searchMediaParams};
        this.showListInfo();
      },
      resetForm() {
        this.searchMediaParams = {};
        this.searchMediaParams.pageNo = 0;
        this.searchMediaParams.pageSize = 10;
        this.copyParmas = {...this.searchMediaParams};
        this.showListInfo();
      },
      chooseBtn(mediaFile) {
        if (mediaFile.processStatus !== '303002' && mediaFile.processStatus !== '303004') {
          this.$message.warning('该文件未处理，不允许选择');
          return;
        }
        if (!mediaFile.fileUrl) {
          this.$message.warning('该文件的访问url为空，不允许选择');
          return;
        }
        //调用父组件的choosemedia方法
        this.$emit('choosemedia', mediaFile);
      },
      processBtn(id) {
        this.processloading=true;
        this.$message.success('开始处理，请稍后查看处理结果...');
        mediaProcessApi(id).then((res) => {
          if (res.success) {
            this.$message.success('处理成功！');
            this.showListInfo();
          } else {
            this.$message.error('操作失败，请刷新页面重试');
          }
          this.processloading=false;
        })
      },
      deleteBtn(id) {
        deleteMediaApi(id).then((res) => {
          console.log(res);
          if (res.success) {
            this.$message.success('删除成功！');
            this.showListInfo()
          } else {
            this.$message.error('删除失败！');
          }
        })
      },
      uploadFileBtn(){
        this.$router.push({
          path:'/mediaManage/media/upload'
        })
      },
      showListInfo() {
        console.log(this.copyParmas);
        findMediaListApi(this.copyParmas).then((res) => {
          this.totalCount = res.data.total;
          this.tableMediaData = res.data.list
        })
      },
      //序号按页码递增 index [Number] 每条数据前的序号
      indexMethod(index) {
        return this.searchMediaParams.pageNo * this.searchMediaParams.pageSize + index + 1;
      },
      //页码切换方法 val [Number] 切换到的页码
      handleCurrentChange(val) {
        this.searchMediaParams.pageNo = val - 1;
        this.copyParmas.pageNo = val - 1;
        this.showListInfo();
      },
      //每页数量切换方法 val [Number] 切换到的每页数量
      handleSizeChange(val) {
        this.searchSiteParams.pageSize = val;
        this.searchSiteParams.pageNo = 0;
        this.copyParmas.pageSize = val;
        this.copyParmas.pageNo = 0;
        this.showListInfo();
      },
    },
    mounted() {
      this.getBreadcrumb();
      //默认查询页面
      this.copyParmas = {...this.searchMediaParams};
      this.showListInfo();
      //初始化处理状态
      this.processStatusList = [
        {
          id: '',
          name: '全部'
        },
        {
          id: '303001',
          name: '处理中'
        },
        {
          id: '303002',
          name: '处理成功'
        },
        {
          id: '303003',
          name: '处理失败'
        },
        {
          id: '303004',
          name: '无需处理'
        }
      ]
    }
  }
</script>
<style lang="scss">
  @import "../../styles/media/mediaListManage";
</style>
