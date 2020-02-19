<template>
  <el-dialog
    :title="editorFlag.title"
    :visible.sync="editorFlag.visible"
    width=50rem
    top="10vh"
    :before-close="handleClose">
    <div class="editorSite-box">
      <el-form ref="siteForm" :model="siteForm" label-width="100px" :rules="rules">

        <el-form-item label="站点名称" prop="siteName">
          <el-input v-model="siteForm.siteName" placeholder="请输入站点名称"></el-input>
        </el-form-item>
        <el-form-item label="站点域" prop="siteDomain">
          <el-input v-model="siteForm.siteDomain" placeholder="请输入站点域"></el-input>
        </el-form-item>
        <el-form-item label="端口号" prop="sitePort">
          <el-input v-model="siteForm.sitePort" placeholder="请输入端口号"></el-input>
        </el-form-item>
        <el-form-item label="站点访问地址" prop="siteWebPath">
          <el-input v-model="siteForm.siteWebPath" placeholder="请输入站点访问地址"></el-input>
        </el-form-item>
        <!--<el-form-item label="创建时间" prop="siteCreateTime">-->
          <!--<el-input v-model="siteForm.siteCreateTime" disabled></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="创建时间"> <!--自动把date类型转成字符串显示 但是传输还是date类型-->
          <el-date-picker
            type="datetime"
            v-model="siteForm.siteCreateTime"
            disabled>
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="!flag">
    <el-button @click="cancelBtn">取 消</el-button>
    <el-button type="primary" @click="confirmBtn('siteForm','add')" :loading="saveLoading">提 交</el-button>
  </span>
    <span slot="footer" class="dialog-footer" v-if="flag">
    <el-button @click="cancelBtn">取 消</el-button>
    <el-button type="primary" @click="confirmBtn('siteForm','update')" :loading="saveLoading">保 存</el-button>
  </span>
  </el-dialog>
</template>
<script>
  import {
    addSiteApi,
    updateSiteApi
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
            this.siteForm = {//解构赋值
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
        siteForm: {
          siteId: '',//主键
          siteWebPath: '',
          siteName: '',
          siteDomain: '',
          sitePort: '',
          siteCreateTime: ''
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
          siteName: [
            {required: true, message: '请输入模板名称', trigger: 'blur'}, //不能为空
            {max: 255, message: '长度不要超过255个字符', trigger: 'blur'}
          ],
          siteDomain: [
            {required: true, message: '请输入站点域名！', trigger: 'blur'},
            {max: 255, message: '长度不要超过255个字符', trigger: 'blur'}
          ],
          sitePort: [
            {required: true, message: '请输入端口号！', trigger: 'blur'},
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
        this.$refs['siteForm'].resetFields();
      },
      init() {//初始化
        for (let k in this.siteForm) {
          this.siteForm[k] = "";
        }
      this.siteForm.siteCreateTime= new Date();
      },
      cancelBtn() {
        this.saveLoading = false;
        this.$emit('closeModel');
        this.$refs['siteForm'].resetFields();
      },
      confirmBtn(formName, type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              siteName: this.siteForm.siteName,
              siteDomain: this.siteForm.siteDomain,
              sitePort: this.siteForm.sitePort,
              siteWebPath: this.siteForm.siteWebPath,
              siteCreateTime: this.siteForm.siteCreateTime,
            };
            if (type === 'add') { //添加
              this.saveLoading = true;
              this.addSite(params);
            } else if (type === 'update') { //修改
              this.saveLoading = true;
              this.updatePage(params);
            }
          }
        });
      },
      /*调用服务接口*/
      addSite(params) {
        addSiteApi(params).then(res => {
          console.log("添加参数", params);
          console.log("返回结果", res);
          if (res.success) {
            this.$message.success("添加成功！");
            this.saveLoading = false;
            this.$emit('addModel', true);
            this.$refs['siteForm'].resetFields();
          } else {
            this.$message.error(res.message)
          }
        })

      },
      updatePage(params) {
        updateSiteApi(this.siteForm.siteId, params).then(res => {
          console.log("编辑参数", params);
          if (res.success) {
            this.$message.success("编辑成功！");
            this.$emit('addModel', true);
            this.saveLoading = false;
            this.$refs['siteForm'].resetFields();
          } else {
            this.$message.error(res.message);
          }
        })
      }
    }

  }
</script>

<style scoped lang="scss">
  @import "../../styles/cms/editorSite.scss";
</style>
