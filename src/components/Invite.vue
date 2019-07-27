<template>
  <el-tooltip class="item" effect="dark" content="邀请其他用户" placement="top">
    <el-popover placement="top" width="160" v-model="visible">
      <div style="margin: 20px 0;"></div>
      <el-input type="text" placeholder="用户名" v-model="username"></el-input>
      <div style="margin: 20px 0;"></div>
      <div style="text-align: center; margin: 0">
        <el-button size="mini" type="text" @click="cancle">取消</el-button>
        <el-button type="primary" size="mini" @click="confirm">确定</el-button>
      </div>
      <el-button
        slot="reference"
        icon="el-icon-circle-plus-outline"
        type="text"
        style="font-size: 25px"
      ></el-button>
    </el-popover>
  </el-tooltip>
</template>
<script>
import axios from "axios";

export default {
  name: "invite",
  data() {
    return {
      visible: false,
      username: ""
    };
  },
  methods: {
    cancle() {
      this.visible = false;
      this.username = "";
    },
    confirm() {
      this.visible = false;
      // this.$emit('wsmsg', this.username);
      let data = {};
      let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      if (this.username === userInfo.username) {
        this.$message.error("不能邀请自己");
      } else {
        let board = JSON.parse(window.localStorage.getItem("board"));
        let inviter = {
          id: userInfo.userId,
          name: userInfo.username,
          boardList: [board]
        };
        let invitee = { name: this.username };
        data["inviter"] = inviter;
        data["invitee"] = invitee;
        axios.post("http://127.0.0.1:8088/user/inviteUser", data);
      }
    }
  }
};
</script>
<style>
</style>

