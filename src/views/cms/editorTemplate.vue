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
          <el-input v-model="templateForm.templateName" placeholder="请输入模板名称"></el-input>
        </el-form-item>
        <el-form-item label="模板参数">
          <el-input v-model="templateForm.templateParameter" placeholder="请输入模板参数"></el-input>
        </el-form-item>
        <el-form-item label="模板文件路径" prop="fileUrl">
          <el-input v-model="fileUrl" placeholder="如:C:\Users\zt\Desktop\tip11.txt"></el-input>
          <el-button @click="uploadBtn">上传</el-button>
        </el-form-item>
        <el-form-item label="模板文件ID" prop="templateFileId">
          <el-input v-model="templateForm.templateFileId" disabled></el-input>
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
  import {
    addTemplateApi,
    updateTemplateApi,
    uploadTemplateFileApi,
    deleteTemplateFileApi
  } from '../../service/cms'

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
            this.oldFileId = newVal.data.templateFileId;
          } else {//添加
            this.init();
          }
        },
        deep: true
      }
    },
    data() {
      return {
        btnName: '上传',
        oldFileId: '',//用于保存已经上传的文件id
        isUploadSuccess: false,
        saveLoading: false,
        fileUrl: '',
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
            {required: true, message: '模板文件ID不能为空！', trigger: 'blur'},
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
        this.fileUrl = '';
        this.isUploadSuccess = false;
      },
      cancelBtn() {
        this.saveLoading = false;
        this.$emit('closeModel');
        this.$refs['templateForm'].resetFields();
      },
      //上传文件模板
      uploadBtn() {
        let url = this.formatUrl(this.fileUrl);
        if (this.flag && this.oldFileId) {//编辑状态时上传文件成功 删除旧文件
          let id = this.oldFileId;
          uploadTemplateFileApi(url).then(res => {
            console.log('返回结果',res);
            if(typeof res === 'object'&&!res.success){//此时已经说明后台返回的是异常信息
              this.$message.error(res.message);
            } else {
              this.isUploadSuccess = true;//标识上传成功
              this.templateForm.templateFileId = res;
              deleteTemplateFileApi(id).then(res => {
                  this.$message.error(res.message);
              })
            }
          })
        } else {
          uploadTemplateFileApi(url).then(res => {
            if(typeof res === 'object'&&!res.success){//此时已经说明后台返回的是异常信息
                this.$message.error(res.message);
            }else {
              this.isUploadSuccess = true;//标识上传成功
              this.templateForm.templateFileId = res;
            }
          })
        }
      },
      formatUrl(val) {//对路径的操作
        if (val !== '') {
          let url = val.replace(/\\/g, "\/");//转成正斜杠
          return url;
        }
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
