<template>
  <el-dialog
    title="用户密码:guest"
    :visible.sync="notlogin"
    width="25%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :show-close="false"
    center
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="登录" name="first">
        <el-form label-position="left" label-width="70px" class="form">
          <el-form-item label="用户名：">
            <el-input type="text" v-model="loginUser.name"></el-input>
          </el-form-item>
          <el-form-item label="密码：">
            <el-input type="password" v-model="loginUser.password"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="width:100%" @click="login">确 定</el-button>
      </el-tab-pane>
      <el-tab-pane label="注册" name="second">
        <el-form label-position="left" label-width="70px" class="form">
          <el-form-item label="用户名：">
            <el-input type="text" v-model="registerUser.name"></el-input>
          </el-form-item>
          <el-form-item label="密码：">
            <el-input type="password" v-model="registerUser.password"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="width:100%" @click="register">确 定</el-button>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import axios from "axios";
import jwt from "jsonwebtoken";
import router from "../router";

export default {
  name: "login",
  props: ["notlogin"],
  data() {
    return {
      loginUser: {
        name: "",
        password: ""
      },
      registerUser: {
        name: "",
        password: ""
      },
      activeName: "first"
    };
  },
  methods: {
    register() {
      axios
        .post("http://127.0.0.1:8088/user/register", this.registerUser)
        .then(res => {
          let token = res.data;
          if (token === "该用户名已注册") {
            alert("该用户名已注册");
          } else {
            let userInfo = jwt.decode(token, { complete: true }).payload;
            window.localStorage.setItem("token", token);
            window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
            let userId = userInfo.userId;
            axios
              .get("http://127.0.0.1:8088/user/" + userId + "/boards")
              .then(res => {
                window.localStorage.setItem(
                  "board",
                  JSON.stringify(res.data.pop())
                );
              });
            router.go(0);
          }
        });
    },
    login() {
      console.log(this.loginUser);
      axios
        .post("http://127.0.0.1:8088/user/login", this.loginUser)
        .then(res => {
          if (res.data === "用户名或密码错误") {
            alert("用户名或密码错误");
          } else {
            let token = res.data;
            let userInfo = jwt.decode(token, { complete: true }).payload;
            window.localStorage.setItem("token", token);
            window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
            let userId = userInfo.userId;
            axios
              .get("http://127.0.0.1:8088/user/" + userId + "/boards")
              .then(res => {
                window.localStorage.setItem(
                  "board",
                  JSON.stringify(res.data.pop())
                );
              });
            router.go(0);
          }
        });
    },
    handleClose() {}
  }
};
</script>

