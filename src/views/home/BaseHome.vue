<template>
  <div class="BaseHome">
    <el-container class="baseContainer">
      <!--头部-->
      <el-header class="header">
        <p-head></p-head>
      </el-header>
      <el-container>
        <!--侧边栏 菜单-->
        <el-aside :class="isCollapse?'menu-collapsed':'menu-expanded'" style="width: auto !important;">
          <!--导航菜单-->
          <div class="CollapseBtn">
            <span v-if="isCollapse" @click="collapse"> <img src="/static/images/right-open.png" width="20px"
                                                            alt=""></span>
            <span v-else @click="collapse"> <img src="/static/images/folder.png" width="20px" alt=""></span>
          </div>
          <el-menu :default-active="$router.path"
                   router
                   unique-opened
                   background-color="#545c64"
                   text-color="#fff"
                   active-text-color="#ffd04b"
                   class="el-menu-vertical-demo"
                   @open="handleOpen"
                   @close="handleClose"
                   :collapse="isCollapse">
            <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
              <el-submenu :index="index.toString()" v-if="item.children!==''||item.children!=null">
                <template slot="title"><i :class="item.icon"></i><span slot="title">{{item.name}}</span></template>
                <el-menu-item v-for="child in item.children"
                              :index="item.path+'/'+child.path"
                              :key="child.path"
                              v-if="!child.hidden"><!--item.path+'/'+child.path 这里父路径+子路径 实现跳转-->
                  {{child.name}}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="index+''">
                <template slot="title"><i :class="item.icon"></i><span slot="title">{{item.name}}</span></template>
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>
        <!--内容区域-->
        <el-container>
          <el-main><!--所有子页面显示在此处 路由锚点-->
            <div class="grid-content bg-purple-light">
              <el-col :span="24" class="content-wrapper">
                <transition name="fade" mode="out-in">
                  <router-view></router-view>
                </transition>
                <!--<router-view></router-view>-->
              </el-col>
            </div>
          </el-main>
          <!--尾部-->
          <el-footer>
            <p-foot></p-foot>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import PHead from '@/components/head.vue';
  import PFoot from '@/components/foot.vue';

  export default {
    name: "BaseHome",
    components: {
      PHead,
      PFoot,
    },
    data() {
      return {
        isCollapse: true,
        sysUserName: '',
        sysUserAvatar: '/static/images/small.jpg',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      handleOpen() {
        console.log('handleopen');
      },
      handleClose() {
        console.log('handleclose');
      },
      //折叠导航栏
      collapse() {
        this.isCollapse = !this.isCollapse;
      },
      showMenu(i, status) {
        this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
      }
    },
    created() {
      console.log(this.$router.options.routes);
    }
  }
</script>

<style scoped lang="scss">
  @import '../../styles/home/BaseHome.scss';
</style>
