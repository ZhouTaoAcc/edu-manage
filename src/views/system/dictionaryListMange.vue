<template>
  <div class="edu-dictionaryList-contain">
    <!--面包屑行-->
    <div class="breadcrumb-operation">
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item v-for="(item)  in levelList" :key="item.path" v-if="item.meta.title">
          <router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <span class="operation">
         <span class="el-icon-circle-plus" @click="addDictionaryBtn"> 添加字典</span>
      </span>
    </div>
    <!--查询部分-->
    <div class="edu-dictionaryList-top">
      <el-form
        class="edu-dictionaryList-ft"
        label-position="right"
        :model="searchDicParams"
        ref="searchDicParams"
      >
        <div class="edu-dictionaryList-fdy">
          <el-form-item
            label="字典名称："
            class="edu-dictionaryList-fiu"
            prop="dName"
          >
            <el-input
              v-model="searchDicParams.dName"
              placeholder="请输入字典名称"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="类型值："
            class="edu-dictionaryList-fiu"
            prop="dType"
          >
            <el-input
              v-model="searchDicParams.dType"
              placeholder="请输入类型值"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label=" "
            class="edu-dictionaryList-fiu">
            <div class="btn-click">
              <el-button type="primary" @click="searchBtn">查询</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!--显示结果部分-->
    <div class="edu-dictionaryList-content">
      <div class="edu-dictionaryList-res">
        <div class="edu-dictionaryList-tab">
          <el-table
            :data="tableDictionaryData"
            v-loading="loading"
            element-loading-text="拼命加载中..."
            row-key="id"
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            :row-style="rowStyle">
            <el-table-column
              prop="dname"
              label="字典名称"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.dname}}
              </template>
            </el-table-column>
            <el-table-column
              prop="dtype"
              label="类型值"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.dtype}}
              </template>
            </el-table-column>
            <el-table-column
              prop="sdName"
              label="字典项名称"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.sdName}}
              </template>
            </el-table-column>
            <el-table-column
              prop="sdStatus"
              label="字典项状态"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{scope.row.sdStatus| formatType}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="150"
              align="center"
              fixed="right"
              class="child-background">
              <template slot-scope="scope">
                <span v-if="!scope.row.dtype&&scope.row.sdStatus==='1'" class="el-icon-open tab-btn"
                      @click.stop="setStatus(scope.row,0)">禁用</span>
                <span v-if="!scope.row.dtype&&scope.row.sdStatus==='0'" class="el-icon-turn-off tab-btn"
                      @click.stop="setStatus(scope.row,1)">启用</span>
                <span v-if="!scope.row.dtype" class="el-icon-edit-outline tab-btn"
                      @click.stop="updateDictionaryBtn(scope.row)">编辑</span>
                <span v-if="scope.row.dtype" class="el-icon-delete tab-btn"
                      @click.stop="deleteDictionaryBtn(scope.row.id)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="edu-dictionaryList-pag">
          <div class="edu-dictionaryList-pag-content">
            <el-pagination
              :current-page="searchDicParams.pageNo+1"
              :page-sizes="[10,20,50,100]"
              :page-size="searchDicParams.pageSize"
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
    <editor-Dictionary
      :flag="flag"
      :editorFlag.sync="!flag ? addDictionaryFlag: updateDictionaryFlag"
      @addModel="addSuccess"
      @closeModel="closeSuccess">
    </editor-Dictionary>
  </div>
</template>

<script>
  import {findDictionaryListApi, setDictionaryStatusApi,deleteDictionaryApi} from '../../service/system'
  import editorDictionary from './editorDictionary'

  export default {
    components: {
      editorDictionary
    },
    data() {
      return {
        loading: true,
        flag: false, //false 增加 true修改
        addDictionaryFlag: {
          visible: false,
          title: '添加字典',
          data: {}
        },
        updateDictionaryFlag: {
          visible: false,
          title: '编辑字典',
          data: {}
        },
        //分页搜索参数
        searchDicParams: {
          dName: '',
          dType: '',
          pageNo: 0, //页码
          pageSize: 10 //每页几条
        },
        copyParmas: {}, //查询使用的参数
        totalCount: null,	//总个数
        tableDictionaryData: [],	//列表中的值
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
      this.copyParmas = {...this.searchDicParams};
      this.showListInfo();
      this.getBreadcrumb();
    },
    filters: {
      formatType(val) {
        if (val === '0') {
          return "禁用"
        } else if (val === '1') {
          return "可用"
        }
      }
    },
    methods: {
      //生成面包屑
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => item.name);
        const first = matched[0];
        if (first && first.name !== '') {
          matched = [{path: '/system', meta: {title: '系统管理'}}].concat(matched)
        }
        this.levelList = matched;
      },
      //为表格children行添加样式
      rowStyle({row, rowIndex}) {
        if (row.dtype !== undefined) {
          return {"background-color": "rgb(240, 242, 245)"}
        } else {
          return {"background-color": "#fff"}
        }
      },
      //查询分页内容
      showListInfo() {
        findDictionaryListApi(this.copyParmas).then(res => {
          console.log("查询条件--》", this.copyParmas);
          console.log("查询分页", res);
          this.loading = false;
          this.tableDictionaryData = res.data.list;
          this.totalCount = res.data.total;
        }, err => {
          this.$message.warning(err);
        });
      },
      //查询按钮
      searchBtn() {
        this.searchDicParams.pageNo = 0;
        this.copyParmas = {...this.searchDicParams};
        this.showListInfo();
      },
      //根据子节点的id设置状态
      setStatus(val, status) {
        console.log(val.sdType , val.id)
        if (val.sdType && val.id) {
          setDictionaryStatusApi(val.sdType, val.id, status).then(res => {
            if (res.success) {
              this.showListInfo();
              this.$message.success("操作成功！")
            } else {
              this.$message.error("操作失败！")
            }
          });

        }else {
          this.$message.error("参数不合法！")
        }
      },
      deleteDictionaryBtn(val){
        this.$confirm('确定删除该记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDictionaryApi(val).then(res => {
            if (res.success) {
              this.$message.success("删除成功！");
              this.showListInfo();
            } else {
              this.$message.error(res.message)
            }
          })
        })
      },
      //页码切换方法 val [Number] 切换到的页码
      handleCurrentChange(val) {
        this.searchDicParams.pageNo = val - 1;
        this.copyParmas.pageNo = val - 1;
        this.showListInfo();
      },
      //每页数量切换方法 val [Number] 切换到的每页数量
      handleSizeChange(val) {
        this.searchDicParams.pageSize = val;
        this.searchDicParams.pageNo = 0;
        this.copyParmas.pageSize = val;
        this.copyParmas.pageNo = 0;
        this.showListInfo();
      },
      addDictionaryBtn() {
        this.flag = false;
        this.addDictionaryFlag.visible = true;
      },
      updateDictionaryBtn(val) {
        if (val) {
          this.flag = true;
          this.updateDictionaryFlag.visible = true;
          console.log('编辑', val);
          this.updateDictionaryFlag.data = val; //传值给子组件
        }
      },
      //点确定之后回调
      addSuccess(val) {
        if (val) {
          this.flag = false;
          this.addDictionaryFlag.visible = false;
          this.updateDictionaryFlag.visible = false;
          this.showListInfo();
        }
      },
      //点关闭之后回调
      closeSuccess() {
        this.addDictionaryFlag.visible = false;
        this.updateDictionaryFlag.visible = false;
      },
      //重置按钮 formName [Object] 表单数据
      resetForm() {
        for (let k in this.searchDicParams) {
          this.searchDicParams[k] = '';
        }
        this.searchDicParams.pageNo = 0;
        this.searchDicParams.pageSize = 10;
        this.copyParmas = {...this.searchDicParams};
        this.showListInfo();
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../styles/system/dictionaryListManage.scss";
</style>
