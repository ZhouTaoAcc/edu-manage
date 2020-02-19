<template>
  <div class="edu-pageList-contain">
    <!--面包屑行-->
    <div class="breadcrumb-operation">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="(item)  in levelList" :key="item.path" v-if="item.meta.title">
          <router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <span class="operation">
         <span class="el-icon-circle-plus" @click="addPageBtn"> 添加页面</span>
      </span>
    </div>
    <!--查询部分-->
    <div class="edu-pageList-top">
      <el-form
        class="edu-pageList-ft"
        label-position="right"
        :model="searchPageParams"
        ref="searchPageParams"
      >
        <div class="edu-pageList-fdy">
          <el-form-item
            label="页面名称："
            class="edu-pageList-fiu"
            prop="pageName"
          >
            <el-input
              v-model="searchPageParams.pageName"
              placeholder="请输入页面名称"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="所属站点："
            class="edu-pageList-fiu"
            prop="siteId"
          > 
            <el-select v-model="searchPageParams.siteId" placeholder="请选择站点"
                       clearable>   
              <el-option
                v-for="item in siteList"
                :key="item.siteId"
                :label="item.siteName"
                :value="item.siteId">    
              </el-option>
                
            </el-select>
          </el-form-item>
          <el-form-item
            label="创建时间："
            class="edu-pageList-fiu"
          >
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="edu-pageList-fdy">
          <el-form-item
            label="页面别名："
            class="edu-pageList-fiu"
            prop="pageAliase"
          >
            <el-input
              v-model="searchPageParams.pageAliase"
              placeholder="请输入页面别名"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="edu-pageList-fiu"
          >
          </el-form-item>
          <el-form-item
            label=" "
            class="edu-pageList-fiu">
            <div class="btn-click">
              <el-button type="primary" @click="searchBtn">查询</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!--显示结果部分-->
    <div class="edu-pageList-content">
      <div class="edu-pageList-res">
        <div class="edu-pageList-tab">
          <el-table
            :data="tablePageData"
            stripe
            v-loading="loading"
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
              prop="pageId"
              label="页面ID"
              min-width="200"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.pageId||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pageName"
              label="页面名称"
             min-width="200"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.pageName||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pageAliase"
              label="页面别名"
             min-width="200">
              <template slot-scope="scope">
                {{scope.row.pageAliase||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="siteId"
              label="所属站点ID"
             min-width="200"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.siteId||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="templateId"
              label="所属模板ID"
             min-width="200"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.templateId||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pageWebPath"
              label="访问地址"
             min-width="150"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.pageWebPath||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pagePhysicalPath"
              label="物理路径"
             min-width="200"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.pagePhysicalPath||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pageType"
              label="页面类型"
             min-width="150"
            align="cneter">
              <template slot-scope="scope">
                {{scope.row.pageType | formType}}
              </template>
            </el-table-column>
            <el-table-column
              prop="htmlFileId"
              label="静态文件ID"
             min-width="200"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.htmlFileId||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pageStatus"
              label="页面状态"
              align="center"
             min-width="200">
              <template slot-scope="scope">
                {{scope.row.pageStatus||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="dataUrl"
              label="数据URL"
             min-width="200"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{scope.row.dataUrl||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pageCreateTime"
              label="创建时间"
             min-width="200"
              :show-overflow-tooltip="true"
              :formatter="formatterTime"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="280"
              align="center"
              fixed="right">
              <template slot-scope="scope">
                <span class="el-icon-chat-line-round tab-btn" @click.stop="pageDetail(scope.row.pageId)">详情</span>
                <span class="el-icon-edit-outline tab-btn" @click.stop="updatePageBtn(scope.row)">编辑</span>
                <span class="el-icon-delete tab-btn" @click.stop="deletePageBtn(scope.row.pageId)">删除</span>
                <span class="el-icon-view tab-btn"  @click.stop="previewPageBtn(scope.row.pageId)">预览</span>
                <span class="el-icon-position tab-btn" @click.stop="releasePageBtn(scope.row.pageId)">发布</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="edu-pageList-pag">
          <div class="edu-pageList-pag-content">
            <el-pagination
              :current-page="searchPageParams.pageNo+1"
              :page-sizes="[10,20,50,100]"
              :page-size="searchPageParams.pageSize"
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
    <editor-page
      :flag="flag"
      :editorFlag.sync="!flag ? addPageFlag: updatePageFlag"
      @addModel="addSuccess"
      @closeModel="closeSuccess">
    </editor-page>
    <!--查看详情-->
    <page-detail
      :detailFlag.sync="seePageDetail"
      @closeModel="closeSuccess">
    </page-detail>
  </div>
</template>

<script>
  import moment from 'moment';
  import {findPageListApi,deletePageApi,findPageApi,releasePageApi} from '../../service/cms'
  import editorPage from './editorPage'
  import pageDetail from './pageDetail'

  export default {
    components: {
      editorPage,
      pageDetail
    },
    data() {
      return {
        loading:true,
        flag: false, //false 增加 true修改
        addPageFlag: {
          visible: false,
          title: '添加页面',
          data: {}
        },
        updatePageFlag: {
          visible: false,
          title: '编辑页面',
          data: {}
        },
        seePageDetail: {
          visible: false,
          title: '查看详情',
          data: {}
        },
        //时间选择器 默认时间
        pickerOptions: {
          disabledDate: (time) => {
            let now = moment(new Date()).format('YYYY-MM-DD 23:59:59');
            return time.getTime() > new Date(now).getTime() || time.getFullYear() < 1900;
          }
        },
        //分页搜索参数
        searchPageParams: {
          siteId: '',
          pageName: '',
          startDate: '', //开始日期
          endDate: '', //结束日期
          pageAliase: '',
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
        tablePageData: [],	//列表中的值
        levelList: null,

      };
    },
    watch: {
      $route(to, from) {
        this.getBreadcrumb();
      }
    },
    computed: {
      // 日期选择器默认日期
      dateRange: {
        get() {
          return [this.searchPageParams.startDate, this.searchPageParams.endDate];
        },
        set(val) {
          if (val === null) {
            this.searchPageParams.startDate = '';
            this.searchPageParams.endDate = '';
          } else {
            //日期选择器时间默认为date类型 转为字符串
            this.searchPageParams.startDate = moment(val[0]).format('YYYY-MM-DD HH:mm:ss');
            this.searchPageParams.endDate = moment(val[1]).format('YYYY-MM-DD HH:mm:ss');
          }
        }
      }
    },
    mounted() {
      // let curParams = JSON.parse(localStorage.getPage(constants.SCA_INQUIRES_CUR_PARAMS));
      // if (curParams !== null) {
      //   this.searchPageParams = curParams;
      //   localStorage.removePage(constants.SCA_INQUIRES_CUR_PARAMS);
      // } else {
      this.timeFormat();//默认时间
      // }
      this.copyParmas = {...this.searchPageParams};
      this.showListInfo();
      this.getBreadcrumb();
    },
    filters: {
      formType(val){
          if (val === 1) {
            return '动态';
          } else {
            return '静态';
          }
      }
    },
    methods: {
      //格式化时间
      timeFormat() {
        const varstart = moment(new Date()).subtract(365 * 2, 'days').format('YYYY-MM-DD 00:00:00');
        const varend = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        this.searchPageParams.startDate = varstart;
        this.searchPageParams.endDate = varend;
      },
      //生成面包屑
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => item.name);
        const first = matched[0];
        if (first && first.name !== '') {
          matched = [{path: '/cms', meta: {title: 'CMS页面管理'}}].concat(matched)
        }
        this.levelList = matched;
      },
      //查询分页内容
      showListInfo() {
        findPageListApi(this.copyParmas).then(res => {
          console.log("查询条件--》", this.copyParmas);
          console.log("查询分页", res);
          this.loading=false;
          this.tablePageData = res.data.list;
          this.totalCount = res.data.total;
        }, err => {
          this.$message.warning(err);
        });
      },
      //查询按钮
      searchBtn() {
        this.searchPageParams.pageNo = 0;
        this.copyParmas = {...this.searchPageParams};
        this.showListInfo();
      },
      //导出excel
      // exportDataList() {
      //   const params = {...this.copyParmas};
      //   delete params.pageSize;
      //   delete params.pageNo;
      //   goodsListExportApi(params).then(res => {
      //     const blob = new Blob([res.data]);
      //     const href = window.URL.createObjectURL(blob);
      //     let downloadElement = document.createElement('a');
      //     downloadElement.href = href;
      //     downloadElement.download = 'XX.xlsx';
      //     document.body.appendChild(downloadElement);
      //     downloadElement.click();
      //     document.body.removeChild(downloadElement);
      //     window.URL.revokeObjectURL(href);
      //   });
      // },
      //转换时间格式 row [Number] 行 column [Number] 列 cellValue [String] 对应的值
      formatterTime(row, column, cellValue) {
        if (cellValue != null) {
          return moment(new Date(cellValue)).format('YYYY-MM-DD HH:mm:ss');//自动将UTC转出CST 也就是自动加上8小时
        } else {
          return '--';
        }
      },
      //序号按页码递增 index [Number] 每条数据前的序号
      indexMethod(index) {
        return this.searchPageParams.pageNo * this.searchPageParams.pageSize + index + 1;
      },
      //页码切换方法 val [Number] 切换到的页码
      handleCurrentChange(val) {
        this.searchPageParams.pageNo = val - 1;
        this.copyParmas.pageNo = val - 1;
        this.showListInfo();
      },
      //每页数量切换方法 val [Number] 切换到的每页数量
      handleSizeChange(val) {
        this.searchPageParams.pageSize = val;
        this.searchPageParams.pageNo = 0;
        this.copyParmas.pageSize = val;
        this.copyParmas.pageNo = 0;
        this.showListInfo();
      },
      addPageBtn() {
        this.flag = false;
        this.addPageFlag.visible = true;
      },
      updatePageBtn(val) {
        if (val) {
          this.flag = true;
          this.updatePageFlag.visible = true;
          console.log('编辑', val);
          this.updatePageFlag.data = val; //传值给子组件
        }
      },
      deletePageBtn(val){
        this.$confirm('确定删除该记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePageApi(val).then(res=>{
            if(res.success){
              this.$message.success(res.message);
              this.showListInfo();
            }else{
              this.$message.error(res.message)
            }
          })
        });
      },
      //页面预览
      previewPageBtn(val){
        window.open('http://localhost:31001/cms/page/pagePreview/'+val);
      },
      //页面发布
      releasePageBtn(val){
        this.$confirm('确定发布该页面吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          releasePageApi(val).then(res=>{
          if(res.success){
            this.$message.success("发布成功！")
          }else{
            this.$message.error("发布失败！")
          }
          })
        })
      },
      //点确定之后回调
      addSuccess(val) {
        if(val){
          this.flag=false;
          this.addPageFlag.visible = false;
          this.updatePageFlag.visible = false;
          this.showListInfo();
        }
      },
      //点关闭之后回调
      closeSuccess() {
        this.flag=false;
        this.addPageFlag.visible = false;
        this.updatePageFlag.visible = false;
        this.seePageDetail.visible=false;
      },
      //详情方法 id [String] 记录id
      pageDetail(val) {
        findPageApi(val).then(res=>{
          if(res){
            this.seePageDetail.visible=true;
            this.seePageDetail.data={...res};
          }else{
            this.$message.error("查看详情失败！")
          }
        })
      },
      //重置按钮 formName [Object] 表单数据
      resetForm() {
        for (let k in this.searchPageParams) {
          this.searchPageParams[k] = '';
        }
        this.searchPageParams.pageNo = 0;
        this.searchPageParams.pageSize = 10;
        this.timeFormat();
        this.copyParmas = {...this.searchPageParams};
        this.showListInfo();
      }
    }
  };
</script>
<style scoped lang="scss">
  @import "../../styles/cms/pageListMange";
</style>
