<template>
  <!--上传文件公共组件-->
  <div id="uploader" class="wu-example">
    <div class="btns">
      <div id="picker">选择文件</div>
      <el-button id="ctlBtn" type="primary" class="webuploader-upload" @click="upload()"><i
        class="el-icon-upload el-icon--right"></i> 开始上传
      </el-button>
    </div>
  </div>
</template>

<script>
  import Utils from '../../utils/utils'
  export default {
    name: "myWebUploader",
    props: {//接受父组件传来的参数
      accept: {
        type: Object,
        default: null,
      },
      serverUrl: {
        type: String,
        default: () => {
        }
      },
      //是否多选
      multiple: {
        type: Boolean,
        default: true
      },
      // 上传最大数量 默认为100
      fileNumLimit: {
        type: Number,
        default: 100,
      },
      // 大小限制 默认100M
      fileSingleSizeLimit: {
        type: Number,
        default: 100 * 1024 * 1024,
      }
    },
    data() {
      return {
        uploader: null,//文件上传初始对象
        fileMd5: '',
        uploadFileList: {}
      }
    },
    methods: {

      initWebUpload() {
        this.uploader = WebUploader.create({
          swf: '../../static/plugins/webuploader/dist/Uploader.swf',// swf文件路径
          server: this.serverUrl,//上传分块的服务端地址，注意跨域问题
          auto: false, // 选完文件后，是否自动上传
          // 选择文件的按钮。可选。
          pick: {
            id: '#picker',    // 选择文件的按钮
            multiple: this.multiple,   // 是否多文件上传 默认false
            label: '',
          },
          fileVal: "file",//文件上传域的name
          // accept: {
          //   title: 'Images',
          //   exteensions: 'gif,jpg,jpeg,bmp,png',
          //   mimeTypes: '.gif,.jpg,.jpeg,.bmp,.png'
          // },  // 允许选择文件格式。
          fileNumLimit: this.fileNumLimit, // 限制上传个数
          fileSingleSizeLimit: this.fileSingleSizeLimit, // 限制单个上传图片的大小
          threads: 3,
          resize: false, // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
          chunked: true,          //分片上传
          chunkSize: 1 * 1024 * 1024,    //分片大小1M
          duplicate: true,  // 去重,根据文件名字、文件大小和最后修改时间来生成hash Key.
          prepareNextFile: true// 允许在文件传输时提前把下一个文件准备好
        });
        // 当文件被加入队列以后触发。
        this.uploader.on('fileQueued', (file) => {
          console.log(file);
          if (file.ext === 'jpg' ||file.ext === 'gif' ||file.ext === 'jpeg' || file.ext ==='bmp' || file.ext ==='png') {
            alert("请上传文档或视频类型！");
            return false;
          }
          this.uploadFileList = file;
          this.$emit('fileChange', file);//父组件接受处理
        });
        //当每个切片上传完触发。
        this.uploader.on('uploadAccept', (file, response) => {
          if (!(response && response.success)) {//分块上传失败，返回false
            return false;
          }
        });
        // 文件上传过程中创建进度条实时显示。
        this.uploader.on('uploadProgress', (file, percentage) => {
          this.$emit('progress', file, percentage);
        });
        //不管成功或者失败，文件上传完成时触发
        this.uploader.on('uploadComplete', (file, response) => {
          this.$emit('complete', file, response);
        });
        this.uploader.on('uploadSuccess', (file, response) => {
          this.$emit('success', file, response);
        });

        this.uploader.on('uploadError', (file, reason) => {
          console.error(reason);
          this.$emit('uploadError', file, reason);
        });
        this.uploader.on('error', (type) => {
          let errorMessage = '';
          if (type === 'F_EXCEED_SIZE') {
            errorMessage = `文件大小不能超过${this.fileSingleSizeLimit / (1024 * 1000)}M`;
          } else if (type === 'Q_EXCEED_NUM_LIMIT') {
            errorMessage = '文件上传已达到最大上限数';
          } else {
            errorMessage = `上传出错！请检查后重新上传！错误代码${type}`;
          }
          console.error(errorMessage);
          this.$emit('error', errorMessage);
        });

      },
      registerWebUpload() {
        WebUploader.Uploader.register({
          "before-send-file": "beforeSendFile",
          "before-send": "beforeSend",
          "after-send-file": "afterSendFile"
        }, {
          beforeSendFile: function (file) {
            //在文件发送之前request，此时还没有分片（如果配置了分片的话），可以用来做文件整体md5验证。
            // 创建一个deffered,用于通知是否完成操作
            let deferred = WebUploader.Deferred();
            (new WebUploader.Uploader()).md5File(file, 0, 100 * 1024 * 1024)
              .then(function (val) {
                this.fileMd5 = val;
                this.uploadFileList = file;
                //向服务端请求注册上传文件
                let params = {
                  // 文件唯一表示
                  fileMd5: this.fileMd5,
                  fileName: file.name,
                  fileSize: file.size,
                  mimetype: file.type,
                  fileExt: file.ext
                };
                $.ajax(
                  {
                    type: "POST",
                    url: "/media/upload/register",
                    data: params,
                    dataType: "json",
                    success(res) {
                      if (res.success) {
                        //alert('上传文件注册成功开始上传');
                        deferred.resolve();
                      } else {
                        alert(res.message);
                        deferred.reject();
                      }
                    }
                  })
              }.bind(this));
            return deferred.promise();
          }.bind(this),
          beforeSend: function (block) {
            // 每次上传分块前校验分块，如果已存在分块则不再上传，达到断点续传的目的
            let deferred = WebUploader.Deferred();
            let params = {
              // 文件唯一表示
              fileMd5: this.fileMd5,
              // 当前分块下标
              chunk: block.chunk,
              // 当前分块大小
              chunkSize: block.end - block.start
            };
            $.ajax(
              {
                type: "POST",
                url: "/media/upload/checkchunk",
                data: params,
                dataType: "json",
                success(res) {
                  if (!res.success) {
                    // 分块存在，跳过该分块
                    deferred.reject();
                  } else {
                    // 分块不存在或不完整，重新发送
                    deferred.resolve();
                  }
                }
              });
            //构建fileMd5参数，上传分块时带上fileMd5
            this.uploader.options.formData.fileMd5 = this.fileMd5;
            this.uploader.options.formData.chunk = block.chunk;
            return deferred.promise();
          }.bind(this),
          afterSendFile: function (file) {
            // 合并分块
            let params = {
              fileMd5: this.fileMd5,
              fileName: file.name,
              fileSize: file.size,
              mimetype: file.type,
              fileExt: file.ext
            };
            console.log(params);
            $.ajax(
              {
                type: "POST",
                url: "/media/upload/mergechunks",
                data: params,
                dataType: "json",
                success(res) {
                  //在这里解析合并成功结果
                  if (res && res.success) {

                  } else {
                    alert(res.message);
                  }
                }
              }
            );
          }.bind(this)
        });
      },
      //开始上传
      upload() {
        this.uploader.upload(this.uploadFileList);
      },
      stop(file) {
        this.uploader.stop(file);
      },
      // 取消并中断文件上传
      cancelFile(file) {
        this.uploader.cancelFile(file);
      },
      // 在队列中移除文件
      removeFile(file, bool) {
        this.uploader.removeFile(file, bool);
      },
      getAccept(accept) {
        switch (accept) {
          case 'text':
            return {
              title: 'Texts',
              exteensions: 'doc,docx,xls,xlsx,ppt,pptx,pdf,txt',
              mimeTypes: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt'
            };
            break;
          case 'video':
            return {
              title: 'Videos',
              exteensions: 'mp4',
              mimeTypes: '.mp4'
            };
            break;
          case 'image':
            return {
              title: 'Images',
              exteensions: 'gif,jpg,jpeg,bmp,png',
              mimeTypes: '.gif,.jpg,.jpeg,.bmp,.png'
            };
            break;
          default:
            return accept
        }
      }
    },
    mounted() {
      this.registerWebUpload(); //注意先后顺序
      this.initWebUpload();

    }
  }
</script>

<style scoped lang="scss">
  /*引入提供的css*/
  @import "../../static/plugins/webuploader/webuploader.css";

  .wu-example {
    position: relative;
    width: 260px;
    height: 60px;
    .btns {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      .webuploader-upload {
        height: 42px;
        .el-icon--right {
          margin: 0px;
        }
        &:hover {
          background: #00a2d4;
        }
      }
    }
  }
</style>
