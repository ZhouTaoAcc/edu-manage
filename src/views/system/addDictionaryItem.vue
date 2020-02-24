<template>
  <el-dialog
    :title="popoverFlag.title"
    :visible.sync="popoverFlag.visible"
    width=50rem
    top="10vh"
    :before-close="close">
    <div class="editorDictionaryItem-box">
      <el-form ref="dictionaryItemForm" :model="dictionaryItemForm" label-width="100px" :rules="rules">
        <el-form-item label="字典名称" prop="dName">
          <el-input v-model="dictionaryItemForm.dName" disabled></el-input>
        </el-form-item>
        <el-form-item label="类型值" prop="dType">
          <el-input v-model="dictionaryItemForm.dType"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="字典项名称" prop="sdName">
          <el-input v-model="dictionaryItemForm.sdName" placeholder="请输入字典项名称"></el-input>
        </el-form-item>
        <el-form-item label="字典项状态" prop="sdStatus">
          <el-radio-group v-model="dictionaryItemForm.sdStatus">
            <el-radio :label='1'>启用</el-radio>
            <el-radio :label='0'>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="addItemBtn('dictionaryItemForm')">提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import {
    addDictionaryItemApi,
  } from '../../service/system'

  export default {
    name: "addDictionaryItem",
    props: {
      popoverFlag: {
        type: Object,
        default: () => {
        }
      }
    },
    watch: {
      popoverFlag: {
        handler(newVal) {
          if (newVal.data.dtype) {
            this.dictionaryItemForm.sdType = newVal.data.dtype;
            this.dictionaryItemForm.dName = newVal.data.dname;
            this.dictionaryItemForm.dType = newVal.data.dtype;
          }
        },
        deep: true
      }
    },
    data() {
      return {
        dictionaryItemForm: {
          dName: '',
          dType: '',
          sdId: new Date().getTime(),
          sdType: '',
          sdName: '',
          sdStatus: 1
        },
        rules: {
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
    methods: {
      addItemBtn(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              sdId: this.dictionaryItemForm.sdId,
              sdName: this.dictionaryItemForm.sdName,
              sdType: this.dictionaryItemForm.sdType,
              sdStatus: this.dictionaryItemForm.sdStatus === 0 ? '0' : '1'
            };
            this.addItemApi(params);
          }
        })
      },
      addItemApi(params) {
        addDictionaryItemApi(this.dictionaryItemForm.sdType, params).then(res => {
          if (res.success) {
            this.$message.success("添加成功！");
            this.$emit('addModel', true);
            this.$refs['dictionaryItemForm'].resetFields();
          } else {
            this.$message.error(res.message)
          }
        })
      },
      close() {
        this.$emit('closeModel');
        this.$refs['dictionaryItemForm'].resetFields();
      }
    }
  }
</script>


<style scoped lang="scss">
  /*编辑模板编辑页面样式*/
  .editorDictionaryItem-box {
    display: flex;
    /deep/ .el-form {
      width: 100%;
      padding-left: 165px;
      /deep/ .el-form-item {
        width: 350px;
        /deep/ .el-form-item__content {
          width: 250px;
        }
        &:nth-child(4) {
          /deep/ .el-form-item__content {
            width: 250px;
            display: flex;
          }
          .el-button {
            margin-left: 20px;
          }
        }
        /deep/ .el-radio-group {
          font-size: 0;
          line-height: 50px;
        }
      }
      /deep/ .el-form-item__error {
        color: #F56C6C;
        font-size: 14px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
      }
      /deep/ .el-input__inner {
        width: 250px;
      }
    }
  }

</style>
