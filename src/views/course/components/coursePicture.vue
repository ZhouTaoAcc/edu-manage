<template>
  <div class="coursePicture">
    <el-form :model="courseForm" label-width="80px" ref="courseForm">
      <el-form-item label="课程名称" prop="name">
        <el-input v-model="courseForm.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="课程图片">
        <el-upload
          action="/api/fileServer/upload"
          list-type="picture-card"
          :file-list="fileList"
          :data="uploadData"
          :limit="1"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-exceed="rejectUpload"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" hidden>
      <el-button type="primary" @click.native="save">提交</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="图片预览">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import {findCourseBaseById, findCoursePicById, addCoursePicApi,deleteCoursePicApi} from '../../../service/course'
  import sysUrlConfig from '../../../../static/config/baseUrl'

  export default {
    name: "coursePicture",
    data() {
      return {
        courseid: '',
        fileId: '',
        courseForm: {},
        dialogVisible: false,
        dialogImageUrl: '',
        fileList: [],//组件绑定 回显
        uploadData: {
          filetag: "coursePic",
          businesskey: this.$route.query.courseid,
          files:null
        },//上传提交的额外的数据 ，将uploadData转成key/value提交给服务器
        imgUrl: sysUrlConfig.imgUrl,
      }
    },
    methods: {
      handlePictureCardPreview(file) {
        console.log(file);
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //在上传前钩子
      beforeUpload(file) {
        const isMatch = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp';
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isMatch) {
          this.$message.warning("文件格式不匹配");
        }
        if (!isLt1M) {
          this.$message.warning("图片大小不能超过 1MB!");
        }
        this.uploadData.files=file;//注意：加上要上传的文件
        console.log('beforeUpload',this.uploadData)
      },
      //上传成功回调 返回后台响应结果
      handleSuccess(response,file,fileList) {
        console.log('handleSuccess',response)
        if(response.success){
          this.$message.success("上传成功!");
          this.fileId= response.data.fileId;
          /*保存课程图片*/
          this.save();
        }else{
          this.$message.error(response.message);
          this.fileList=[];
        }
      },
      //超出文件上传个数提示信息
      rejectUpload() {
        this.$message.warning("最多上传1个图片");
      },
      //删除文件
      handleRemove(file, fileList) {
        deleteCoursePicApi(this.courseid).then(res => {
          if(res.success){
            this.$message.success(res.message)
          }else {
            this.$message.error(res.message)
          }
        })
      },
      save() {
        let params = {
          courseid: this.courseid,
          pic: this.fileId
        };
        addCoursePicApi(params).then(res => {
          if(!res.success){
            this.$message.error(res.message)
          }
        })
      }
    },
    mounted() {
      this.courseid = this.$route.query.courseid;
      //查询课程基本信息
      findCourseBaseById(this.courseid).then((res) => {
        this.courseForm = {...res};
      });
      //查询课程图片 回显
      findCoursePicById(this.courseid).then(res => {
        if (res && res.pic) {
          let imgUrl = this.imgUrl + res.pic;
          //将图片服务器地址设置到fileList[] 回显
          this.fileList.push({name: 'pic', url: imgUrl, fileId: res.pic})
        }else {
          this.$message.warning("暂无图片信息！")
        }
      });
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../styles/course/components/coursePicture";
</style>
