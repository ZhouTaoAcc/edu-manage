<template>
  <div class="edu-pageList-contain">
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
              <el-button @click="resetForm('searchPageParams')">重置</el-button>
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
          >
            <el-table-column
              prop="id"
              label="序号"
              fixed="left"
              width="60"
              type="index"
              :index='indexMethod'>
            </el-table-column>
            <el-table-column
              prop="pageName"
              label="页面名称"
              min-width="100"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.pageName||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pageAliase"
              label="页面别名"
              min-width="100">
              <template slot-scope="scope">
                {{scope.row.pageAliase||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="siteId"
              label="站点ID"
              min-width="100"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.siteId||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pageWebPath"
              label="访问路径"
              min-width="100"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.pageWebPath||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pagePhysicalPath"
              label="物理路径"
              min-width="100">
              <template slot-scope="scope">
                {{scope.row.pagePhysicalPath||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="pageCreateTime"
              label="创建时间"
              min-width="100"
              :show-overflow-tooltip="true"
              :formatter="formatterTime"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="80"
              fixed="right">
              <template slot-scope="scope">
                <span
                  @click="PageDetail(scope.row.id)">详情
                </span>
                <span
                  @click="PageDetail(scope.row.id)">详情
                </span>
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
  </div>
</template>

<script>
  import moment from 'moment';
  import {findPageListApi} from '../../service/cms'

  export default {
    data() {
      return {
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
        tablePageData: []	//列表中的值
      };
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
            this.searchPageParams.startDate = val[0];
            this.searchPageParams.endDate = val[1];
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
    },
    filters: {},
    methods: {
      //格式化时间
      timeFormat() {
        const varstart = moment(new Date()).subtract(6, 'days').format('YYYY-MM-DD 00:00:00');
        const varend = moment(new Date()).format('YYYY-MM-DD 23:59:59');
        this.searchPageParams.startDate = new Date(varstart);
        this.searchPageParams.endDate = new Date(varend);
      },
      //查询分页内容
      showListInfo() {
        findPageListApi(this.copyParmas).then(res => {
          console.log("查询条件--》", this.copyParmas);
          console.log("查询分页", res);
          this.tablePageData = res.data.list;
          this.totalCount = res.total;
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
      /*exportDataList() {
        const params = {...this.copyParmas};
        delete params.pageSize;
        delete params.pageNo;
        goodsListExportApi(params).then(res => {
          const blob = new Blob([res.data]);
          const href = window.URL.createObjectURL(blob);
          let downloadElement = document.createElement('a');
          downloadElement.href = href;
          downloadElement.download = 'XX.xlsx';
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
        });
      },*/
      //转换时间格式 row [Number] 行 column [Number] 列 cellValue [String] 对应的值
      formatterTime(row, column, cellValue) {
        if (cellValue != null) {
          return moment(new Date(cellValue)).format('YYYY-MM-DD HH:mm:ss');
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
      //详情方法 id [String] 记录id

      },
      //重置按钮 formName [Object] 表单数据
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.searchPageParams.pageNo = 0;
        this.searchPageParams.pageSize = 10;
        this.timeFormat();
        this.copyParmas = {...this.searchPageParams};
        this.showListInfo();
      }
  };
</script>
<style scoped lang="scss">
  @import "../../styles/cms/pageListMange";
</style>
