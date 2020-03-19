<template>
  <div class="mediaUpload">
    <br/>
    操作步骤：<br/>
    1、点击“选择文件”，选择要上传的文件<br/>
    2、点击“开始上传”，开始上传文件<br/>
    3、如需重新上传请重复上边的步骤。<br/><br/>
    <my-web-uploader
      ref="uploader"
      :serverUrl=this.url
      @fileChange="fileChange"
      @progress="onProgress"
      @success="onSuccess"

    >
    </my-web-uploader>
    <div class="file-panel">
      <h3>文件列表</h3>
      <div class="file-list">
        <ul class="file-item" :class="`file-${file.id}`" v-for="file in uploadFileData">
          <li class="file-type" :icon="fileCategory(file.ext)"></li>
          <li class="file-name">{{file.name}}</li>
          <li class="file-size">{{fileSize(file.size)}}</li>
          <li class="file-status">待上传...</li>
          <li class="file-operate">
            <a  @click="resume(file)" v-if="!isStop"><i class="iconfont icon-control-play">开始</i></a>
            <a  @click="stop(file)" v-if="isStop"><i class="iconfont icon-video-pause">暂停</i></a>
            <a @click="remove(file)"><i class="iconfont icon-close-big">移除</i></a>
          </li>
          <li class="progress"></li>
        </ul>
        <div class="no-file" v-if="!uploadFileData.length"><i class="iconfont icon-empty-file"></i> 暂无待上传文件</div>
      </div>
    </div>
  </div>

</template>

<script>
  import myWebUploader from '../../components/myWebUploader'

  export default {
    name: "mediaUpload",
    components: {
      myWebUploader
    },
    data() {
      return {
        uploadFile: {},//上传的文件
        uploadFileData: [],
        url: "/api/media/upload/uploadchunk",
        percentage: 0,//上传进度
        isStop:false
        // accept: {accept: 'images'}
      }
    },
    computed: {
      uploader() {
        return this.$refs.uploader;
      }
    },
    methods: {
      fileChange(file) {
        $('.file-status').html("待上传...")
        $(`.file-${file.id} .progress`).css('width', 0 + '%');
        this.uploadFileData = [];
        this.percentage = 0;
        this.uploadFileData.push(file);//绑定表格 显示在上传队列中
      },
      onSuccess(file) {
        $('.file-status').html("上传成功")
      },
      onProgress(file, percentage) {
        //进度条
        $(`.file-${file.id} .progress`).css('width', percentage * 100 + '%');
        $(`.file-${file.id} .file-status`).html((percentage * 100).toFixed(2) + '%');
      },
      resume(file) {
        this.isStop= !this.isStop;
        this.uploader.upload(file);
      },
      stop(file) {
        this.isStop= !this.isStop;
        this.uploader.stop(file);
      },
      remove(file) {
        // 取消并中断文件上传
        this.uploader.cancelFile(file);
        // 在队列中移除文件
        this.uploader.removeFile(file, true);
        // 在ui上移除
        let index = this.uploadFileData.findIndex(ele => ele.id === file.id);
        this.uploadFileData.splice(index, 1);
      },
      fileSize(size) {
        return WebUploader.Base.formatSize(size);
      },
      fileCategory(ext) {
        let type = '';
        const typeMap = {
          image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'],
          video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
          text: ['doc', 'txt', 'docx', 'pages', 'epub', 'pdf', 'numbers', 'csv', 'xls', 'xlsx', 'keynote', 'ppt', 'pptx']
        };
        Object.keys(typeMap).forEach((_type) => {
          const extensions = typeMap[_type];
          if (extensions.indexOf(ext) > -1) {
            type = _type
          }
        });
        return type
      }
    },
    mounted() {

    }
  }
</script>

<style scoped lang="scss">
  //自定义样式
  @import "../../styles/media/mediaUpload.scss";
</style>
