<template>
  <div>
    <el-card :class="[boxcard, styles[item.color - 1]]" shadow="hover" @click.native="modify">
      <div class="task-title" @click.stop="foldmsg">
        <el-row>
          <el-col :span="22">
            <span class="task-title-text">{{item.title}}</span>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="light" :content="'创建者：' + item.creator.name" placement="left">
            <div class="user-avatar"> <el-avatar size="small" >{{item.creator.name}}</el-avatar></div>
            </el-tooltip>
          </el-col>
        </el-row>
        
        
      </div>
      <div v-if="!fold" class="task-description">
        <el-divider></el-divider>
        <span v-html="item.description">{{item.description}}</span>
        <div style="padding-bottom: 20px"></div>
      </div>
    </el-card>
    <el-dialog
      title="修改任务"
      :visible.sync="visible"
      width="25%"
      :before-close="handleClose"
      center
      :close-on-click-modal="false"
      :show-close="false"
      append-to-body
    >
      <el-input type="text" placeholder="任务标题" v-model="task.title"></el-input>
      <div style="margin: 20px 0;"></div>
      <el-input
        type="textarea"
        placeholder="详细描述"
        v-model="task.description"
        maxlength="100"
        show-word-limit
        rows="5"
      ></el-input>
      <div style="margin: 20px 0;"></div>
      <el-select
        style="width:100%"
        v-model="task.color"
        placeholder="请选择颜色"
        :class="styles[task.color-1]"
      >
        <el-option v-for="(item, index) in colors" :key="index" :label="item.text" :value="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelModify">取 消</el-button>
        <el-button type="primary" @click="modifyTask">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "task",
  props: ["item", "board"],
  data() {
    return {
      fold: true,
      visible: false,
      task: {
        id: null,
        title: "",
        description: "",
        color: null
      },
      boxcard: "box-card",
      colors: [
        { id: 1, text: "黄色" },
        { id: 2, text: "绿色" },
        { id: 3, text: "红色" },
        { id: 4, text: "蓝色" }
      ],
      styles: ["yellowcolor", "greencolor", "redcolor", "bluecolor"]
    };
  },
  methods: {
    foldmsg() {
      if (this.fold) {
        this.fold = false;
      } else {
        this.fold = true;
      }
    },
    modify() {
      this.visible = true;
      this.task.id = this.item.id;
      this.task.type = this.item.type;
      this.task.title = this.item.title;
      this.task.description = this.item.description;
      this.task.color = this.item.color;
      this.task.boardId = this.board.id;
      this.task.description = this.task.description.replace(
        /<br\s*\/?\s*>/gi,
        "\n"
      );
    },
    modifyTask() {
      let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      let data = this.task;
      axios
        .post(
          "http://127.0.0.1:8088/task/" + userInfo.userId + "/modifyTask",
          data
        )
        .then(res => {
          this.item.title = this.task.title;
          this.item.color = this.task.color;
          this.item.description = this.task.description;
          this.item.description = this.item.description.replace(
            /\r?\n/g,
            "<br>"
          );
          this.visible = false;
        });
    },
    cancelModify() {
      this.visible = false;
    },
    handleClose(done) {
      this.$confirm("内容不会保存，确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>
<style>
.box-card {
  margin: 8px;
  cursor: pointer;
}
.yellowcolor {
  background-color: #ffffe0;
}
.greencolor {
  background-color: #dcffc2;
}
.bluecolor {
  background-color: #c3ddff;
}
.redcolor {
  background-color: #ffccd6;
}
.el-card__body {
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 12px;
  padding-right: 12px;
}
.task-title {
  height: 30px;
}
.task-title-text {
  width: 100%;
  font-size: 13px;
  line-height: 30px;
}
.el-divider--horizontal {
  margin: 0px;
  margin-bottom: 10px;
  margin-left: -5px;
}
.user-avatar {
  text-align: center;
  margin-top: 3px;
}
.user-avatar .el-avatar--small {
  width: 26px;
  height: 26px;
  line-height: 26px
}
.user-avatar .el-avatar{
  color: #f8f4ef;
  background: #000000;
}
</style>


