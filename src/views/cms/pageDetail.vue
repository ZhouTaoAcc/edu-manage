<template>
  <el-dialog
    :title="detailFlag.title"
    :visible.sync="detailFlag.visible"
    width=50rem
    top="10vh"
    :before-close="handleClose">
    <div class="editor-box">
      <el-form ref="pageDate" :model="pageDate" label-width="100px">
        <div class="item">
          <el-form-item label="所属站点:" prop="siteId">
            <span class="row-span">
							{{pageDate.siteId}}
						</span>
          </el-form-item>
          <el-form-item label="所属模板:" prop="templateId">
            <span class="row-span">
							{{pageDate.templateId}}
						</span>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="页面名称:" prop="pageName">
            <span class="row-span">
							{{pageDate.pageName}}
						</span>
          </el-form-item>
          <el-form-item label="页面别名:">
            <span class="row-span">
							{{pageDate.pageAliase}}
						</span>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="页面状态:" prop="pageStatus">
            <span class="row-span">
							{{pageDate.pageStatus}}
						</span>
          </el-form-item>
          <el-form-item label="访问地址:" prop="pageWebPath">
            <span class="row-span">
							{{pageDate.pageWebPath}}
						</span>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="页面类型:">
            <span class="row-span">
							{{pageDate.pageType}}
						</span>
          </el-form-item>
          <el-form-item label="静态文件ID:" prop="htmlFileId">
            <span class="row-span">
							{{pageDate.htmlFileId}}
						</span>
          </el-form-item>
        </div>
        <el-form-item label="页面数据Url:" prop="dataUrl">
          <span class="row-span">
							{{pageDate.dataUrl}}
						</span>
        </el-form-item>
        <el-form-item label="物理路径:" prop="pagePhysicalPath">
          <span class="row-span">
							{{pageDate.pagePhysicalPath}}
						</span>
        </el-form-item>
        <el-form-item label="创建时间:">
          <span class="row-span">
							{{pageDate.pageCreateTime | formattime}}
						</span>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
  import moment from 'moment'
    export default {
        name: "pageDetail",
        props:{
          detailFlag:{
            type: Object,
            default:()=>{}
          }
        },
        data(){
          return{
            pageDate:{}
          }
        },
      created(){

      },
      watch:{
        detailFlag:{
          handler(newval){
            this.pageDate={...newval.data}
          },
          deep:true
        }
      },
      filters:{
        formattime(val){
          return moment(val).format('YYYY-MM-DD HH:mm:ss');
        }
      },
      methods:{
        handleClose(){
          this.$emit('closeModel');
        }
      }
    }
</script>

<style scoped lang="scss">
  /deep/ .el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-weight: bold;
  }
</style>
