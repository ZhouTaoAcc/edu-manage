<template>
  <el-dialog
    :title="editorFlag.title"
    :visible.sync="editorFlag.visible"
    width=50rem
    top="10vh"
    :before-close="handleClose">
    <div class="editorTemplate-box">
      <el-form ref="templateForm" :model="templateForm" label-width="100px" :rules="rules">
        <el-form-item label="所属站点" prop="siteId">
          <el-select v-model="templateForm.siteId" placeholder="请选择所属站点">
            <el-option
              v-for="item in siteList"
              :key="item.siteId"
              :label="item.siteName"
              :value="item.siteId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="templateForm.templateName"></el-input>
        </el-form-item>
        <el-form-item label="模板参数">
          <el-input v-model="templateForm.templateParameter"></el-input>
        </el-form-item>
        <el-form-item label="模板文件ID" prop="templateFileId">
          <el-input v-model="templateForm.templateFileId"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="!flag">
    <el-button @click="cancelBtn">取 消</el-button>
    <el-button type="primary" @click="confirmBtn('templateForm','add')" :loading="saveLoading">提 交</el-button>
  </span>
    <span slot="footer" class="dialog-footer" v-if="flag">
    <el-button @click="cancelBtn">取 消</el-button>
    <el-button type="primary" @click="confirmBtn('templateForm','update')" :loading="saveLoading">保 存</el-button>
  </span>
  </el-dialog>
</template>
<script>
  import {addTemplateApi, updateTemplateApi} from '../../service/cms'

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
            this.templateForm = {//解构赋值
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
        templateForm: {
          templateId: '',//主键
          siteId: '',
          templateName: '',
          templateFileId: '',
          templateParameter: ''
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
        rules: {
          siteId: [
            {required: true, message: '请选择站点ID', trigger: 'blur'}, //不能为空
          ],
          templateName: [
            {required: true, message: '请输入模板名称', trigger: 'blur'}, //不能为空
            {max: 255, message: '长度不要超过255个字符', trigger: 'blur'}
          ],
          templateFileId: [
            {required: true, message: '请输入模板文件ID', trigger: 'blur'},
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
        this.$refs['templateForm'].resetFields();
      },
      init() {//初始化
        for (let k in this.templateForm) {
          this.templateForm[k] = "";
        }
      },
      cancelBtn() {
        this.saveLoading = false;
        this.$emit('closeModel');
        this.$refs['templateForm'].resetFields();
      },
      confirmBtn(formName, type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              siteId: this.templateForm.siteId,
              templateName: this.templateForm.templateName,
              templateFileId: this.templateForm.templateFileId,
              templateParameter: this.templateForm.templateParameter
            };
            if (type === 'add') { //添加
              this.saveLoading = true;
              this.addTemplate(params);
            } else if (type === 'update') { //修改
              this.saveLoading = true;
              this.updatePage(params);
            }
          }
        });
      },
      /*调用服务接口*/
      addTemplate(params) {
        addTemplateApi(params).then(res => {
          console.log("添加参数", params);
          console.log("返回结果", res);
          if (res.success) {
            this.$message.success("添加成功！");
            this.saveLoading = false;
            this.$emit('addModel', true);
            this.$refs['templateForm'].resetFields();
          } else {
            this.$message.error(res.message)
          }
        })
      },
      updatePage(params) {
        updateTemplateApi(this.templateForm.templateId, params).then(res => {
          console.log("编辑参数", params);
          if (res.success) {
            this.$message.success("编辑成功！");
            this.$emit('addModel', true);
            this.saveLoading = false;
            this.$refs['templateForm'].resetFields();
          } else {
            this.$message.error(res.message);
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../styles/cms/editorTemplate.scss";
</style>
