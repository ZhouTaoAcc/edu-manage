<template>
  <el-dialog
    :title="editorFlag.title"
    :visible.sync="editorFlag.visible"
    width=50rem
    top="10vh"
    :before-close="handleClose">
    <div class="editor-box">
      <el-form ref="pageForm" :model="pageForm" label-width="90px" :rules="rules">
        <div class="item">
          <el-form-item label="所属站点" prop="siteId">
            <el-select v-model="pageForm.siteId" placeholder="请选择所属站点">
              <el-option
                v-for="item in siteList"
                :key="item.siteId"
                :label="item.siteName"
                :value="item.siteId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属模板" prop="templateId">
            <el-select v-model="pageForm.templateId" placeholder="请选择所属模板">
              <el-option
                v-for="item in templateList"
                :key="item.templateId"
                :label="item.templateName"
                :value="item.templateId">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="页面名称" prop="pageName">
            <el-input v-model="pageForm.pageName" placeholder="请输入页面名称"></el-input>
          </el-form-item>
          <el-form-item label="页面别名">
            <el-input v-model="pageForm.pageAliase" placeholder="请输入页面别名"></el-input>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="页面状态" prop="pageStatus">
            <el-input v-model="pageForm.pageStatus"></el-input>
          </el-form-item>
          <el-form-item label="访问地址" prop="pageWebPath">
            <el-input v-model="pageForm.pageWebPath" placeholder="如:/include/"></el-input>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="页面类型">
            <el-radio-group v-model="pageForm.pageType">
              <el-radio class="radio" label="0">静态</el-radio>
              <el-radio class="radio" label="1">动态</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="静态文件ID" prop="htmlFileId">
            <el-input v-model="pageForm.htmlFileId" disabled></el-input>
          </el-form-item>
        </div>
        <el-form-item label="数据URL" prop="dataUrl">
          <el-input v-model="pageForm.dataUrl" placeholder="如:http://localhost:31001/cms/config/getMode/id"></el-input>
        </el-form-item>
        <el-form-item label="物理路径" prop="pagePhysicalPath">
          <el-input v-model="pageForm.pagePhysicalPath" placeholder="如:F:/item/index/"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            type="datetime"
            v-model="pageForm.pageCreateTime"
            disabled>
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="!flag">
    <el-button @click="cancelBtn">取 消</el-button>
    <el-button type="primary" @click="confirmBtn('pageForm','add')" :loading="saveLoading">提 交</el-button>
  </span>
    <span slot="footer" class="dialog-footer" v-if="flag">
    <el-button @click="cancelBtn">取 消</el-button>
    <el-button type="primary" @click="confirmBtn('pageForm','update')" :loading="saveLoading">保 存</el-button>
  </span>
  </el-dialog>
</template>
<script>
  import {addPageApi, updatePageApi} from '../../service/cms'

  export default {
    props: {
      editorFlag: {
        type: Object,
        default: () => {
        }
      },
      flag: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      editorFlag: {
        handler(newVal) {
          if (this.flag && newVal && newVal.data) { //修改
            this.pageForm = {//解构赋值
              ...newVal.data
            };
          } else {//添加
            this.init();
          }
        },
        deep: true
      }
    },
    data() {
      return {
        saveLoading: false,
        pageForm: {
          pageId: '',//唯一标识（主键）
          siteId: '',
          templateId: '',
          pageName: '',
          pageAliase: '',
          pageWebPath: '',
          pageParameter: '',
          pagePhysicalPath: '',
          pageType: '',
          pageCreateTime: '',
          pageHtml:'',
          pageStatus:'',
          pageParams:[],
          htmlFileId:'',
          dataUrl:'',
          pageTemplate:'',
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
        //模板列表
        templateList: [
          {
            templateId: '5a962b52b00ffc514038faf7',
            templateName: '首页'
          },
          {
            templateId: '5e4920f50a8f29f6f85fd69f',
            templateName: '轮播图'
          }
        ],
        rules: {
          siteId: [
            {required: true, message: '请选择站点ID', trigger: 'blur'}, //不能为空
          ],
          templateId: [
            {required: true, message: '请选择模板ID', trigger: 'blur'}, //不能为空
          ],
          pageName: [
            {required: true, message: '请输入页面名称', trigger: 'blur'},
            {max: 255, message: '长度不要超过255个字符', trigger: 'blur'}
          ],
          pageWebPath: [
            {required: true, message: '请输入访问地址', trigger: 'blur'},
            {max: 255, message: '长度不要超过255个字符', trigger: 'blur'}
          ],
          // dataUrl: [
          //   {required: true, message: '请输入页面数据Url', trigger: 'blur'},
          //   {max: 255, message: '长度不要超过255个字符', trigger: 'blur'}
          // ],
          pagePhysicalPath: [
            {required: true, message: '请输入物理路径', trigger: 'blur'},
            {max: 255, message: '长度不要超过255个字符', trigger: 'blur'}
          ]
        }
      };
    },
    created() {
      this.init();
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
        this.saveLoading = false;
        this.$refs['pageForm'].resetFields();
      },
      init() {//初始化
        for (let k in this.pageForm) {
          this.pageForm[k] = "";
        }
        this.pageForm.pageCreateTime = new Date();//date类型 MongoDB CST/UTC之间自动转换 保存到数据库
      },
      cancelBtn() {
        this.saveLoading = false;
        this.$emit('closeModel');
        this.$refs['pageForm'].resetFields();
      },
      confirmBtn(formName, type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              siteId: this.pageForm.siteId,
              templateId: this.pageForm.templateId,
              pageName: this.pageForm.pageName,
              pageAliase: this.pageForm.pageAliase,
              pageWebPath: this.pageForm.pageWebPath,
              pagePhysicalPath: this.pageForm.pagePhysicalPath,
              pageType: this.pageForm.pageType,
              pageCreateTime: this.pageForm.pageCreateTime,
              pageStatus:this.pageForm.pageStatus,
              dataUrl: this.pageForm.dataUrl,
              htmlFileId:this.pageForm.htmlFileId
            };
            if (type === 'add') { //添加
              this.saveLoading = true;
              this.addPage(params);
            } else if (type === 'update') { //修改
              this.saveLoading = true;
              this.updatePage(params);
            }
          }
        });
      },
      /*调用服务接口*/
      addPage(params) {
        addPageApi(params).then(res => {
          console.log("添加参数", params);
          console.log("返回结果", res);
          if (res.success) {
            this.$message.success("添加成功！");
            this.saveLoading = false;
            this.$emit('addModel', true);
            this.$refs['pageForm'].resetFields();
          }else{
            this.$message.error(res.message)
          }
        })
      },
      updatePage(params) {
        updatePageApi(this.pageForm.pageId,params).then(res => {
          console.log("编辑参数", params);
          if (res.success) {
            this.$message.success("编辑成功！");
            this.$emit('addModel', true);
            this.saveLoading = false;
            this.$refs['pageForm'].resetFields();
          } else {
            this.$message.error(res.message);
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../styles/cms/editorPage.scss";
</style>
