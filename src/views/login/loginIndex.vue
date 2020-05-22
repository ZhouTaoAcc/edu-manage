<template>
  <div class="loginIndex">
    <div class="login-title"><img src="/static/images/sys_logo.png" width="250px" height="50px" alt="">后台管理系统</div>
    <div class="login-box">
      <el-form :model="loginForm"
               :rules="loginRules" ref="loginForm" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="密码" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click.native="login" :loading="editLoading">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="login-footer">
      <div class="copyright">
        <p>Copyright © 2020 XXXX. All Rights Reserved.</p>
        <div class="img">
          <i class="icon"></i><span>联系邮箱：1078853926@qq.com</span>
        </div>
        <div class="img">
          <i class="icon1"></i><span>联系地址：XXXXX</span>
        </div>
        <div class="img">
          <i class="icon2"></i><span>联系电话：18852978753</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Utils from '../../../utils/utils'
  import {loginApi, logoutApi} from '../../service/login'

  export default {
    name: "loginIndex",
    data() {
      return {
        editLoading: false,
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      login() {
        this.$refs.loginForm.validate((valid) => {
            if (valid) {
              this.editLoading = true;
              let params = {
                username: this.loginForm.username,
                password: this.loginForm.password
              };
              loginApi(params).then(res => {
                  this.editLoading = false;
                  if (res.success) {
                    if (Utils.checkLogin()) {//检验用户是否有登录后台系统的权限
                      this.$message.success("登录成功！");
                      this.$router.push({
                        path: '/welcome'
                      })
                    } else {
                      logoutApi().then(res => {
                        if (res.success) {
                          this.$message.error("权限不足,联系管理员！");
                        }
                      })
                    }
                  }
                  else {
                    this.$message.error("网络异常,请重试！")
                  }
                })
            }
          })
      }
    }

  }
</script>

<style scoped lang="scss">
  @import "../../styles/login/loginIndex";
</style>

