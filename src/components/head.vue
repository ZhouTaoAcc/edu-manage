<template>
  <div>
    <el-col :span="24" class="header">
      <el-col :span="10">
        <div class="sys-name">后台管理系统</div>
      </el-col>
      <el-col :span="14" class="userinfo" style="text-align: right" v-if="this.logined">
        <span class="user-com" style="margin-right: 30px;font-size: 20px;">
          {{companyInfo.name}}
        </span>
        <div class="sys-user">
          <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        <img :src="user.userpic!==''?user.userpic:'/static/images/no-header.jpg'"/>
        {{user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user" command="portal">门户首页</el-dropdown-item>
              <el-dropdown-item icon="el-icon-user" command="personal">个人设置</el-dropdown-item>
              <el-dropdown-item icon="el-icon-close" command="logout">安全退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-col>
  </div>
</template>
<script type="text/javascript">
  import Utils from '../../utils/utils'
  import {logoutApi, getCompanyApi} from '../service/login'

  export default {
    data() {
      return {
        editLoading: false,
        sysName: '系统管理中心',
        user: {
          userid: '',
          username: '',
          userimg: '',
          userpic: ''
        },
        logined: true,
        collapsed: false,
        companyInfo: []
      }
    },
    methods: {
      handleCommand(command) {
        if (command === 'logout') {
          this.logout();
        }
        if (command === 'personal') {
          this.personal();
        }
        if (command === 'portal') {
          window.location.href = 'http://www.eduonline.com'
        }
      },
      personal() {

      },
      //退出登录
      logout() {
        this.$confirm('确认退出吗?', '提示', {}).then(() => {
          //跳转到统一登陆
          logoutApi().then(res => {
            if (res.success) {
              this.$message.success("退出成功！");
              Utils.delLocalStorage('activeUser');
              this.$router.push({path: '/login'});
            } else {
              this.$message.success("退出失败！");
            }
          })
        });
      },
      getCompany(id) {
        getCompanyApi(id).then(res => {
          this.companyInfo = res;
        })
      },
      refresh_user: function () {
        let activeUser = Utils.getActiveUser();//获取当前登陆人
        if (activeUser) {
          this.logined = true;
          this.user = {...activeUser};
          this.getCompany(this.user.companyId)
        }
      }
    },
    mounted() {
      this.refresh_user()
    }
  }
</script>
<style scoped lang="scss">
  .sys-name {
    font-size: 25px !important;
    text-shadow: 5px 5px 5px black;
    color: #fff;
    & > span {
      width: 100%;
      height: 100%;
      font-size: 20px !important;
    }
  }

  .sys-user {
    float: right;
  }

  .el-dropdown-link {
    font-size: 16px;
    cursor: pointer;
    color: #fff;
    & > img {
      width: 30px;
      height: 30px;
      border-radius: 16px;
      vertical-align: middle
    }
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 20px;
    margin-bottom: 20px;
  }

  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .header {
      height: 50px;
      line-height: 50px;
      color: #fff;
      .userinfo {
        text-align: right;
        padding-right: 15px;
        float: right;
        .userinfo-inner {
          cursor: pointer;
          color: #fff;
          img {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            margin: 10px 8px 10px 10px;
            float: left;
          }
        }
      }
      .logo {
        //width:230px;
        height: 50px;
        font-size: 20px;
        padding-left: 0px;
        padding-right: 20px;
        border-color: rgba(238, 241, 146, 0.3);
        border-right-width: 1px;
      }
      .logo-width {
        width: 250px;
      }
      .logo-collapse-width {
        width: 60px
      }
      .tools {
        padding: 0px 23px;
        width: 14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
      }
    }
    .main {
      display: flex;
      // background: #324057;
      position: absolute;
      top: 60px;
      bottom: 0px;
      overflow: hidden;
      aside {
        flex: 0 0 230px;
        width: 230px;
        // position: absolute;
        // top: 0px;
        // bottom: 0px;
        .el-menu {
          height: 100%;
        }
        .collapsed {
          width: 60px;
          .item {
            position: relative;
          }
          .submenu {
            position: absolute;
            top: 0px;
            left: 60px;
            z-index: 99999;
            height: auto;
            display: none;
          }

        }
      }
      .menu-collapsed {
        flex: 0 0 60px;
        width: 60px;
      }
      .menu-expanded {
        flex: 0 0 230px;
        width: 230px;
      }
      .content-container {
        background: #fff;
        flex: 1;
        // position: absolute;
        // right: 0px;
        // top: 0px;
        // bottom: 0px;
        // left: 230px;
        overflow-y: scroll;
        padding: 20px;
        .breadcrumb-container {
          //margin-bottom: 15px;
          .title {
            width: 200px;
            float: left;
            color: cyan;
          }
          .breadcrumb-inner {
            float: right;
          }
        }
        .content-wrapper {
          background-color: #fff;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
