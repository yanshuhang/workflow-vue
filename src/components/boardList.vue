<template>
  <div>
    <el-dropdown size="mini" split-button type="info">
      <span style="font-weight: 900">boards</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          icon="el-icon-document-copy"
          v-for="(item, index) in boards"
          :key="index"
          @click.native="changeBoard(item)"
        >{{item.name}}</el-dropdown-item>
        <el-dropdown-item divided>
          <el-button type="success" plain @click="visible" size="small">创建任务板</el-button>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="创建任务版"
      :visible.sync="addBoard"
      width="25%"
      center
      :close-on-click-modal="false"
      :show-close="false"
      append-to-body
    >
      <el-input type="text" placeholder="任务板名字" v-model="newBoard.name"></el-input>
      <div style="margin: 20px 0;"></div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import router from "../router";

export default {
  name: "boardList",
  data() {
    return {
      boards: [{ id: null, name: "", creator: { id: null, name: "" } }],
      addBoard: false,
      newBoard: {name:'', creator:{id: null}},
    };
  },
  methods: {
    visible() {
      this.addBoard = true
    },
    cancelAdd() {
      this.addBoard = false
    },
    addConfirm() {
      let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      this.newBoard.creator.id = userInfo.userId
      axios.post("http://127.0.0.1:8088/board/addBoard", this.newBoard).then(res => {
        window.localStorage.setItem("board",JSON.stringify(res.data))
        this.addBoard = false
        router.go(0)
      })
    },
    changeBoard(board){
      window.localStorage.setItem("board", JSON.stringify(board))
      router.go(0)
    },
    joinNewBoard(board){
      this.boards.push(board)
    },
  },
  created() {
    let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    if (userInfo !== null) {
      let userId = userInfo.userId;
      axios
        .get("http://127.0.0.1:8088/user/" + userId + "/boards")
        .then(res => {
          this.boards = res.data;
        });
    }
  }
};
</script>

