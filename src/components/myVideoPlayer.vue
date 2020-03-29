<template>
  <div class="container">
    <div class="player">
      <video-player class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"
                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
      >
      </video-player>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      videoUrl: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        playerOptions: {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:12', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "application/x-mpegURL",
            src: '' //你的m3u8地址（动态获取）
            //如http://video.eduonline.com/video/8/1/81377da322bdded3f77c7c4c0a4182d6/hls/81377da322bdded3f77c7c4c0a4182d6.m3u8
          }],
          //poster: "poster.jpg", //你的封面地址
          width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        }
      }
    },
    watch: {
      'videoUrl': { //监听视频资源路径的变化
        handler(val) {
          this.playerOptions.sources[0].src = val;
        },
        deep: true
      }
    },
    methods: {
      onPlayerPlay(player) {
        // alert("play");
      },
      onPlayerPause(player) {
        //alert("pause");
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/css" scoped>
  .container {
    background-color: #efefef;
  }

  /deep/ .vjs-big-play-button {
    /*
     播放按钮换成圆形
    */
    height: 2em;
    width: 2em;
    line-height: 2em;
    border-radius: 1em;
  }
</style>
