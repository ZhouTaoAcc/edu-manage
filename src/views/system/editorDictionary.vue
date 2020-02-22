<template>
  <el-dialog
    :title="editorFlag.title"
    :visible.sync="editorFlag.visible"
    width=50rem
    top="10vh"
    :before-close="handleClose">
    <div class="editorDictionary-box">
      <el-form ref="dictionaryForm" :model="dictionaryForm" label-width="100px" :rules="rules">
        <el-form-item label="字典名称" prop="dName" v-if="!flag">
          <el-input v-model="dictionaryForm.dName" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item label="类型值" prop="dType" v-if="!flag">
          <el-input v-model="dictionaryForm.dType" placeholder="请输入类型值"
                    oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="字典项名称" prop="sdName">
          <el-input v-model="dictionaryForm.sdName" placeholder="请输入字典项名称"></el-input>
        </el-form-item>
        <el-form-item label="字典项状态" prop="sdStatus">
          <el-radio-group v-model="dictionaryForm.sdStatus">
            <el-radio :label='1'>启用</el-radio>
            <el-radio :label='0'>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="!flag">
    <el-button @click="cancelBtn">取 消</el-button>
    <el-button type="primary" @click="confirmBtn('dictionaryForm','add')" :loading="saveLoading">提 交</el-button>
  </span>
    <span slot="footer" class="dialog-footer" v-if="flag">
    <el-button @click="cancelBtn">取 消</el-button>
    <el-button type="primary" @click="confirmBtn('dictionaryForm','update')" :loading="saveLoading">保 存</el-button>
  </span>
  </el-dialog>
</template>
<script>
  import {
    addDictionaryApi,
    updateDictionaryApi
  } from '../../service/system'

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
          if (this.flag && newVal && newVal.data) { /*sdName: "个体"id: "102001"sdStatus: "1"sdType: "102"*/
            this.dictionaryForm.id = newVal.data.id;
            this.dictionaryForm.sdName = newVal.data.sdName;
            this.dictionaryForm.sdType = newVal.data.sdType;
            this.dictionaryForm.sdStatus = newVal.data.sdStatus === '0' ? 0 : 1; //绑定回显
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
        dictionaryForm: {
          id: '',
          dName: '',
          dType: '',
          sdId: '',
          sdName: '',
          sdType: '',
          sdStatus: ''
        },
        rules: {
          dName: [
            {required: true, message: '请输入字典名称', trigger: 'blur'}, //不能为空
          ],
          sdStatus: [
            {required: true, message: '请选择字典项状态', trigger: 'blur'},
          ],
          sdName: [
            {required: true, message: '请输入字典项名称', trigger: 'blur'},
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
        this.$refs['dictionaryForm'].resetFields();
      },
      init() {//初始化
        for (let k in this.dictionaryForm) {
          this.dictionaryForm[k] = "";
        }
        this.dictionaryForm.sdId = new Date().getTime();
        this.dictionaryForm.sdStatus = 1
      },
      cancelBtn() {
        this.saveLoading = false;
        this.$emit('closeModel');
        this.$refs['dictionaryForm'].resetFields();
      },
      confirmBtn(formName, type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              dname: this.dictionaryForm.dName,
              dtype: this.dictionaryForm.dType,
              sdId: this.dictionaryForm.sdId,
              sdName: this.dictionaryForm.sdName,
              sdType: this.dictionaryForm.dType,
              sdStatus: this.dictionaryForm.sdStatus === 0 ? '0' : '1'
            };
            if (type === 'add') { //添加
              this.saveLoading = true;
              this.addDictionary(params);
            } else if (type === 'update') { //修改
              this.saveLoading = true;
              this.updateDictionary(params);
            }
          }
        });
      },
      /*调用服务接口*/
      addDictionary(params) {
        console.log("添加参数", params);
        addDictionaryApi(params).then(res => {
          console.log("返回结果", res);
          if (res.success) {
            this.$message.success("添加成功！");
            this.saveLoading = false;
            this.$emit('addModel', true);
            this.$refs['dictionaryForm'].resetFields();
          } else {
            this.$message.error(res.message)
          }
        })

      },
      updateDictionary(params) {
        console.log(this.dictionaryForm.sdType, this.dictionaryForm.id, params);
        updateDictionaryApi(this.dictionaryForm.sdType, this.dictionaryForm.id, params).then(res => {
          console.log("编辑参数", params);
          if (res.success) {
            this.$message.success("编辑成功！");
            this.$emit('addModel', true);
            this.saveLoading = false;
            this.$refs['dictionaryForm'].resetFields();
          } else {
            this.$message.error(res.message);
          }
        })
      }
    }

  }
</script>

<style scoped lang="scss">
  @import "../../styles/system/editorDictionary.scss";
</style>
