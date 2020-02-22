<template>
  <div class="edu-templateList-contain">
    <!--面包屑行-->
    <div class="breadcrumb-operation">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="(item)  in levelList" :key="item.path" v-if="item.meta.title">
          <router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <span class="operation">
         <span class="el-icon-circle-plus" @click="addTemplateBtn"> 添加模板</span>
      </span>
    </div>
    <!--查询部分-->
    <div class="edu-templateList-top">
      <el-form
        class="edu-templateList-ft"
        label-position="right"
        :model="searchTemplateParams"
        ref="searchTemplateParams"
      >
        <div class="edu-templateList-fdy">
          <!--<el-form-item-->
          <!--label="所属站点："-->
          <!--class="edu-templateList-fiu"-->
          <!--prop="siteId"-->
          <!--&gt; -->
          <!--<el-select v-model="searchTemplateParams.siteId" placeholder="请选择站点"-->
          <!--clearable>   -->
          <!--<el-option-->
          <!--v-for="item in siteList"-->
          <!--:key="item.siteId"-->
          <!--:label="item.siteName"-->
          <!--:value="item.siteId">    -->
          <!--</el-option>-->
          <!--  -->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item
            label="模板ID："
            class="edu-templateList-fiu"
            prop="siteId"
          >
            <el-input
              v-model="searchTemplateParams.siteId"
              placeholder="请输入站点ID"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="模板名称："
            class="edu-templateList-fiu"
            prop="templateName"
          >
            <el-input
              v-model="searchTemplateParams.templateName"
              placeholder="请输入模板名称"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="模板文件ID："
            class="edu-templateList-fiu"
            prop="templateFileId"
          >
            <el-input
              v-model="searchTemplateParams.templateFileId"
              placeholder="请输入模板文件ID"
              :clearable="true"
            ></el-input>
          </el-form-item>
        </div>
        <div class="edu-templateList-fdy">
          <el-form-item
            class="edu-templateList-fiu"
          >
          </el-form-item>
          <el-form-item
            class="edu-templateList-fiu"
          >
          </el-form-item>
          <el-form-item
            label=" "
            class="edu-templateList-fiu">
            <div class="btn-click">
              <el-button type="primary" @click="searchBtn">查询</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!--显示结果部分-->
    <div class="edu-templateList-content">
      <div class="edu-templateList-res">
        <div class="edu-templateList-tab">
          <el-table
            :data="tableTemplateData"
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
              prop="templateId"
              label="模板ID"
              min-width="200"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.templateId||'--'}}
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
              prop="templateName"
              label="模板名称"
              min-width="150">
              <template slot-scope="scope">
                {{scope.row.templateName||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="templateParameter"
              label="模板参数"
              min-width="150"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.templateParameter||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="templateFileId"
              label="模板文件ID"
              min-width="250"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.templateFileId||'--'}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="200"
              align="center"
              fixed="right">
              <template slot-scope="scope">
                <span class="el-icon-download tab-btn"
                      @click.stop="exportTemplateBtn(scope.row.templateFileId)">导出文件</span>
                <span class="el-icon-edit-outline tab-btn" @click.stop="updateTemplateBtn(scope.row)">编辑</span>
                <span class="el-icon-delete tab-btn" @click.stop="deleteTemplateBtn(scope.row.templateId)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="edu-templateList-pag">
          <div class="edu-templateList-pag-content">
            <el-pagination
              :current-page="searchTemplateParams.pageNo+1"
              :page-sizes="[10,20,50,100]"
              :page-size="searchTemplateParams.pageSize"
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
    <editor-template
      :flag="flag"
      :editorFlag.sync="!flag ? addTemplateFlag: updateTemplateFlag"
      @addModel="addSuccess"
      @closeModel="closeSuccess">
    </editor-template>
  </div>
</template>

<script>
  import {
    findTemplateListApi,
    deleteTemplateApi,
    readTemplateFileApi,
  } from '../../service/cms'
  import editorTemplate from './editorTemplate'


  export default {
    components: {
      editorTemplate
    },
    data() {
      return {
        loading:true,
        flag: false, //false 增加 true修改
        addTemplateFlag: {
          visible: false,
          title: '添加模板',
          data: {}
        },
        updateTemplateFlag: {
          visible: false,
          title: '编辑模板',
          data: {}
        },
        //分页搜索参数
        searchTemplateParams: {
          siteId: '',
          templateName: '',
          templateFileId: '', //模板文件ID
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
        tableTemplateData: [],	//列表中的值
        levelList: null

      };
    },
    watch: {
      $route(to, from) {
        this.getBreadcrumb();
      }
    },
    computed: {},
    mounted() {
      this.copyParmas = {...this.searchTemplateParams};
      this.showListInfo();
      this.getBreadcrumb();
    },
    filters: {},
    methods: {
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
        findTemplateListApi(this.copyParmas).then(res => {
          this.loading=false;
          console.log("查询条件--》", this.copyParmas);
          console.log("查询分页", res);
          this.tableTemplateData = res.data.list;
          this.totalCount = res.data.total;
        }, err => {
          this.$message.warning(err);
        });
      },
      //查询按钮
      searchBtn() {
        this.searchTemplateParams.pageNo = 0;
        this.copyParmas = {...this.searchTemplateParams};
        this.showListInfo();
      },
      //序号按页码递增 index [Number] 每条数据前的序号
      indexMethod(index) {
        return this.searchTemplateParams.pageNo * this.searchTemplateParams.pageSize + index + 1;
      },
      //页码切换方法 val [Number] 切换到的页码
      handleCurrentChange(val) {
        this.searchTemplateParams.pageNo = val - 1;
        this.copyParmas.pageNo = val - 1;
        this.showListInfo();
      },
      //每页数量切换方法 val [Number] 切换到的每页数量
      handleSizeChange(val) {
        this.searchTemplateParams.pageSize = val;
        this.searchTemplateParams.pageNo = 0;
        this.copyParmas.pageSize = val;
        this.copyParmas.pageNo = 0;
        this.showListInfo();
      },
      addTemplateBtn() {
        this.flag = false;
        this.addTemplateFlag.visible = true;
      },
      //导出模板文件
      exportTemplateBtn(val) {
        if (val) {
          this.$alert('将文件导出到桌面！', '温馨提示', {
            confirmButtonText: '确定',
            callback: (action) => {
              if (action === "confirm") {
                readTemplateFileApi(val, 1).then(res => {//第二个参数为1 表示下载文件
                  if (res.success) {
                    this.$message.success(res.message);
                  } else {
                    this.$message.error(res.message);
                  }
                })
              }
            }
          })
        }
      },
      //编辑
      updateTemplateBtn(val) {
        if (val) {
          this.flag = true;
          this.updateTemplateFlag.visible = true;
          console.log('编辑', val);
          this.updateTemplateFlag.data = val; //传值给子组件
        }
      },
      //删除
      deleteTemplateBtn(val) {
        this.$confirm('确定删除该记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTemplateApi(val).then(res => {
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
          this.addTemplateFlag.visible = false;
          this.updateTemplateFlag.visible = false;
          this.showListInfo();
        }
      },
      //点关闭之后回调
      closeSuccess() {
        this.flag = false;
        this.addTemplateFlag.visible = false;
        this.updateTemplateFlag.visible = false;
      },
      //重置按钮 formName [Object] 表单数据
      resetForm() {
        for (let k in this.searchTemplateParams) {
          this.searchTemplateParams[k] = '';
        }
        this.searchTemplateParams.pageNo = 0;
        this.searchTemplateParams.pageSize = 10;
        this.copyParmas = {...this.searchTemplateParams};
        this.showListInfo();
      }
    }
  };
</script>
<style scoped lang="scss">
  @import "../../styles/cms/templateListMange";
</style>
