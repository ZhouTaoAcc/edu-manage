<template>
  <div class="edu-siteList-contain">
    <!--面包屑行-->
    <div class="breadcrumb-operation">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="(item)  in levelList" :key="item.path" v-if="item.meta.title">
          <router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <span class="operation">
         <span class="el-icon-circle-plus" @click="addSiteBtn"> 添加站点</span>
      </span>
    </div>
    <!--查询部分-->
    <div class="edu-siteList-top">
      <el-form
        class="edu-siteList-ft"
        label-position="right"
        :model="searchSiteParams"
        ref="searchSiteParams"
      >
        <div class="edu-siteList-fdy">
          <el-form-item
            label="站点名称："
            class="edu-siteList-fiu"
            prop="siteName"
          >
            <el-input
              v-model="searchSiteParams.siteName"
              placeholder="请输入站点名称"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="站点域："
            class="edu-siteList-fiu"
            prop="siteDomain"
          >
            <el-input
              v-model="searchSiteParams.siteDomain"
              placeholder="请输入站点域"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="访问地址："
            class="edu-siteList-fiu"
            prop="siteId"
          >
            <el-input
              v-model="searchSiteParams.siteWebPath"
              placeholder="请输入访问地址"
              :clearable="true"
            ></el-input>
          </el-form-item>
        </div>
        <div class="edu-siteList-fdy">
          <el-form-item
            class="edu-siteList-fiu"
          >
          </el-form-item>
          <el-form-item
            class="edu-siteList-fiu"
          >
          </el-form-item>
          <el-form-item
            label=" "
            class="edu-siteList-fiu">
            <div class="btn-click">
              <el-button type="primary" @click="searchBtn">查询</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!--显示结果部分-->
    <div class="edu-siteList-content">
      <div class="edu-siteList-res">
        <div class="edu-siteList-tab">
          <el-table
            :data="tableSiteData"
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
              prop="siteId"
              label="站点ID"
              min-width="220"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.siteId||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="siteName"
              label="站点名称"
              min-width="100"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.siteName||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="siteDomain"
              label="站点域名"
              min-width="200">
              <template slot-scope="scope">
                {{scope.row.siteDomain||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="sitePort"
              label="端口号"
              min-width="100"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.sitePort||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="siteWebPath"
              label="访问地址"
              min-width="150"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.siteWebPath||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="siteCreateTime"
              label="创建时间"
              min-width="150"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.siteCreateTime| formatDateTime}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="150"
              align="center"
              fixed="right">
              <template slot-scope="scope">
                <span class="el-icon-edit-outline tab-btn" @click.stop="updateSiteBtn(scope.row)">编辑</span>
                <span class="el-icon-delete tab-btn" @click.stop="deleteSiteBtn(scope.row.siteId)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="edu-siteList-pag">
          <div class="edu-siteList-pag-content">
            <el-pagination
              :current-page="searchSiteParams.pageNo+1"
              :page-sizes="[10,20,50,100]"
              :page-size="searchSiteParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!--自定义组件 用于添加 修改-->
    <editor-site
      :flag="flag"
      :editorFlag.sync="!flag ? addSiteFlag: updateSiteFlag"
      @addModel="addSuccess"
      @closeModel="closeSuccess">
    </editor-site>
  </div>
</template>

<script>
  import {
    findSiteListApi,
    deleteSiteApi,
  } from '../../service/cms'
  import moment from 'moment'
  import editorSite from './editorSite'


  export default {
    components: {
      editorSite
    },
    data() {
      return {
        loading:true,
        flag: false, //false 增加 true修改
        addSiteFlag: {
          visible: false,
          title: '添加站点',
          data: {}
        },
        updateSiteFlag: {
          visible: false,
          title: '编辑站点',
          data: {}
        },
        //分页搜索参数
        searchSiteParams: {
          siteName: '',
          siteDomain: '', //站点域
          siteWebPath: '',
          pageNo: 0, //页码
          pageSize: 10 //每页几条
        },
        siteList: [
          {
            siteId: '5a751fab6abb5044e0d19ea1',
            siteName: '门户主站'
          },
          {
            siteId: '102',
            siteName: '测试站'
          }
        ],
        copyParmas: {}, //查询使用的参数
        totalCount: null,	//总个数
        tableSiteData: [],	//列表中的值
        levelList: null,

      };
    },
    watch: {
      $route(to, from) {
        this.getBreadcrumb();
      }
    },
    computed: {},
    mounted() {
      this.copyParmas = {...this.searchSiteParams};
      this.showListInfo();
      this.getBreadcrumb();
    },
    filters: {
      formatDateTime(val){
        return moment(val).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    methods: {
      //生成面包屑
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => item.name);
        const first = matched[0];
        if (first && first.name !== '') {
          matched = [{path: '/', meta: {title: 'CMS页面管理'}}].concat(matched)
        }
        this.levelList = matched;
      },
      //查询分页内容
      showListInfo() {
        findSiteListApi(this.copyParmas).then(res => {
          console.log("查询条件--》", this.copyParmas);
          console.log("查询结果", res);
          this.loading=false;
          this.tableSiteData = res.data.list;
          this.totalCount = res.data.total;
        }, err => {
          this.$message.warning(err);
        });
      },
      //查询按钮
      searchBtn() {
        this.searchSiteParams.pageNo = 0;
        this.copyParmas = {...this.searchSiteParams};
        this.showListInfo();
      },
      //序号按页码递增 index [Number] 每条数据前的序号
      indexMethod(index) {
        return this.searchSiteParams.pageNo * this.searchSiteParams.pageSize + index + 1;
      },
      //页码切换方法 val [Number] 切换到的页码
      handleCurrentChange(val) {
        this.searchSiteParams.pageNo = val - 1;
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
      addSiteBtn() {
        this.flag = false;
        this.addSiteFlag.visible = true;
      },
      //编辑
      updateSiteBtn(val) {
        if (val) {
          this.flag = true;
          this.updateSiteFlag.visible = true;
          console.log('编辑', val);
          this.updateSiteFlag.data = val; //传值给子组件
        }
      },
      //删除
      deleteSiteBtn(val) {
        this.$confirm('确定删除该记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSiteApi(val).then(res => {
            if (res.success) {
              this.$message.success("删除成功！");
              this.showListInfo();
            } else {
              this.$message.error(res.message)
            }
          })
        })
      },
      //点确定之后回调
      addSuccess(val) {
        if (val) {
          this.flag = false;
          this.addSiteFlag.visible = false;
          this.updateSiteFlag.visible = false;
          this.showListInfo();
        }
      },
      //点关闭之后回调
      closeSuccess() {
        this.flag = false;
        this.addSiteFlag.visible = false;
        this.updateSiteFlag.visible = false;
      },
      //重置按钮 formName [Object] 表单数据
      resetForm() {
        for (let k in this.searchSiteParams) {
          this.searchSiteParams[k] = '';
        }
        this.searchSiteParams.pageNo = 0;
        this.searchSiteParams.pageSize = 10;
        this.copyParmas = {...this.searchSiteParams};
        this.showListInfo();
      }
    }
  };
</script>
<style scoped lang="scss">
  @import "../../styles/cms/siteListMange";
</style>
