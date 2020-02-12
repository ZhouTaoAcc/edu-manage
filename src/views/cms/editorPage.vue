<template>
  <el-dialog
    :title="editorFlag.title"
    :visible.sync="editorFlag.visible"
    width=50rem
    top="10vh"
    :before-close="handleClose">
    <div class="editor-box">
      <el-form ref="pageForm" :model="pageForm" label-width="80px" :rules="rules">
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
            <el-input v-model="pageForm.pageName"></el-input>
          </el-form-item>
          <el-form-item label="页面别名">
            <el-input v-model="pageForm.pageAliase"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="访问路径" prop="pageWebPath">
          <el-input v-model="pageForm.pageWebPath"></el-input>
        </el-form-item>
        <el-form-item label="物理路径" prop="pagePhysicalPath">
          <el-input v-model="pageForm.pagePhysicalPath"></el-input>
        </el-form-item>

        <el-form-item label="页面类型">
          <el-radio-group v-model="pageForm.pageType">
            <el-radio class="radio" label="0">静态</el-radio>
            <el-radio class="radio" label="1">动态</el-radio>
          </el-radio-group>
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
    <el-button type="primary" @click="confirmBtn('pageForm','add')"  :loading="saveLoading">确 定</el-button>
  </span>
    <span slot="footer" class="dialog-footer" v-if="flag">
    <el-button @click="cancelBtn">取 消</el-button>
    <el-button type="primary" @click="confirmBtn('pageForm','update')"  :loading="saveLoading">保 存</el-button>
  </span>
  </el-dialog>
</template>
<script>
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
    data() {
      return {
        saveLoading: false,
        pageForm: {
          siteId: '',
          templateId: '',
          pageName: '',
          pageAliase: '',
          pageWebPath: '',
          pageParameter: '',
          pagePhysicalPath: '',
          pageType: '',
          pageCreateTime: new Date()
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
            templateId: '5a962bf8b00ffc514038fafa',
            templateName: '轮播图'
          }
        ],
        rules:{
          siteId: [
            {required: true, message: '请选择站点ID'}, //不能为空
          ],
          templateId: [
            {required: true, message: '请选择模板ID'}, //不能为空
          ],
          pageName: [
            {required: true, message: '请输入页面名称'},
            {max: 255, message: '长度不要超过255个字符'}
          ],
          pageWebPath: [
            {required: true, message: '请输入访问路径'},
            {max: 255, message: '长度不要超过255个字符'}
          ],
          pagePhysicalPath: [
            {required: true, message: '请输入物理路径'},
            {max: 255, message: '长度不要超过255个字符'}
          ]
        }
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      cancelBtn() {
        this.saveLoading = false;
        this.$emit('closeModel');
        this.$refs['pageForm'].resetFields();
      },
      confirmBtn(formName, type) {
        this.$refs[formName].validate((valid) => {
          if(true){

            if (type === 'add') { //添加
              this.saveLoading = true;
              this.addPage(params);
            } else if (type === 'update') { //修改
              params.id = _this.form.id;
              this.saveLoading = true;
              this.updatePage(params);
            }
          }
        });
      },
      /*调用服务接口*/
      addPage(){

      },
      updatePage(){

      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../styles/cms/editorPage.scss";
</style>
