<template>
  <el-container>
    <el-header height="34px">
      <div class="header-left">
        <boardList ref="boardListMethod"></boardList>
      </div>
      <div class="header-icon">workflow</div>
      <div class="header-right">
        <el-button
          type="text"
          icon="el-icon-message-solid"
          style="height:40px; width: 40px; padding:0px; font-size: 25px"
        ></el-button>
        <el-dropdown>
          <el-link style="font-size: 16px; margin-top: -15px; color: aqua;">{{userInfo.username}}</el-link>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-warning-outline" @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-main>
      <div class="boardHeader">
        <div class="boardHeader-left">
          <div class="boardHeader-info" style="font-size: 20px">
            <span style="font-family: 微软雅黑">{{currentBoard.name}}</span>
          </div>
          <span style="margin-left:10px"></span>
          <invite @wsmsg="websocketsend"></invite>
        </div>
      </div>
      <table id="board-table" class="board-table">
        <thead>
          <tr>
            <th class="columnHeader">
              <div class="columnHeader-inner">
                <div class="columnHeader-nameAndInfo">
                  <h2 class="columnHeader-name">To-do</h2>
                </div>
                <div class="columnHeader-right">
                  <el-button
                    type="text"
                    icon="el-icon-plus"
                    style="height:40px; width: 40px; padding:0px; font-size: 25px"
                    @click="showDialog(1)"
                  ></el-button>
                </div>
              </div>
            </th>
            <th class="columnHeader">
              <div class="columnHeader-inner">
                <div class="columnHeader-nameAndInfo">
                  <h2 class="columnHeader-name">Do today</h2>
                </div>
                <div class="columnHeader-right">
                  <el-button
                    type="text"
                    icon="el-icon-plus"
                    style="height:40px; width: 40px; padding:0px; font-size: 25px"
                    @click="showDialog(2)"
                  ></el-button>
                </div>
              </div>
            </th>
            <th class="columnHeader">
              <div class="columnHeader-inner">
                <div class="columnHeader-nameAndInfo">
                  <h2 class="columnHeader-name">In progress</h2>
                </div>
                <div class="columnHeader-right">
                  <el-button
                    type="text"
                    icon="el-icon-plus"
                    style="height:40px; width: 40px; padding:0px; font-size: 25px"
                    @click="showDialog(3)"
                  ></el-button>
                </div>
              </div>
            </th>
            <th class="columnHeader column-last">
              <div class="columnHeader-inner">
                <div class="columnHeader-nameAndInfo">
                  <h2 class="columnHeader-name">Done</h2>
                </div>
                <div class="columnHeader-right">
                  <el-button
                    type="text"
                    icon="el-icon-plus"
                    style="height:40px; width: 40px; padding:0px; font-size: 25px"
                    @click="showDialog(4)"
                  ></el-button>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="board-swimlane swimlane-first swimlane-last">
            <td class="board-taskListCell">
              <div class="taskList">
                <draggable
                  id="list1"
                  class="drag-list"
                  tag="el-collapse"
                  :list="list1"
                  @change="onchange"
                  @add="onadd"
                  :options="dragOptions"
                >
                  <task v-for="(item, index) in list1" :key="index" :item="item" :board="currentBoard"></task>
                </draggable>
              </div>
            </td>
            <td class="board-taskListCell">
              <div class="taskList">
                <draggable
                  id="list2"
                  class="drag-list"
                  tag="el-collapse"
                  :list="list2"
                  @change="onchange"
                  @add="onadd"
                  :options="dragOptions"
                >
                  <task v-for="(item, index) in list2" :key="index" :item="item" :board="currentBoard"></task>
                </draggable>
              </div>
            </td>
            <td class="board-taskListCell">
              <div class="taskList">
                <draggable
                  id="list3"
                  class="drag-list"
                  tag="el-collapse"
                  :list="list3"
                  @change="onchange"
                  @add="onadd"
                  :options="dragOptions"
                >
                  <task v-for="(item, index) in list3" :key="index" :item="item" :board="currentBoard"></task>
                </draggable>
              </div>
            </td>
            <td class="board-taskListCell column-last">
              <div class="taskList">
                <draggable
                  id="list4"
                  class="drag-list"
                  tag="el-collapse"
                  :list="list4"
                  @change="onchange"
                  @add="onadd"
                  :options="dragOptions"
                >
                  <task v-for="(item, index) in list4" :key="index" :item="item" :board="currentBoard"></task>
                </draggable>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <el-dialog
        title="创建任务"
        :visible.sync="dialogVisible"
        width="25%"
        :before-close="handleClose"
        center
        :close-on-click-modal="false"
        :show-close="false"
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
          <el-option
            v-for="(item, index) in colors"
            :key="index"
            :label="item.text"
            :value="item.id"
          ></el-option>
        </el-select>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAdd">取 消</el-button>
          <el-button type="primary" @click="addTask">确 定</el-button>
        </span>
      </el-dialog>
      <login :notlogin="notlogin"></login>
    </el-main>
  </el-container>
</template>

<script>
import draggable from "vuedraggable";
import task from "./Task";
import axios from "axios";
import login from "./Login";
import router from "../router";
import boardList from "./boardList";
import invite from "./Invite";
import { timeout } from 'q';

export default {
  name: "Board",
  components: {
    draggable,
    task,
    login,
    boardList,
    invite
  },
  data() {
    return {
      currentBoard: { name: "" },
      boards: [],
      task: {
        title: null,
        description: null,
        color: 1
      },
      userInfo: {
        username: "",
        userId: null
      },
      notlogin: false,
      dialogVisible: false,
      dragOptions: {
        animation: 300,
        group: "people",
        scroll: true,
        scrollSpeed: 2000,
        scrollSensitivity: 10,
        ghostClass: "ghost-class"
      },
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      colors: [
        { id: 1, text: "黄色" },
        { id: 2, text: "绿色" },
        { id: 3, text: "红色" },
        { id: 4, text: "蓝色" }
      ],
      styles: ["yellowcolor", "greencolor", "redcolor", "bluecolor"],
      dragedTask: null,
      websocket: null,
      notification: null,
      inviter: null
    };
  },
  methods: {
    getBoard() {
      window.localStorage.getItem("board");
      axios.get("http://127.0.0.1:8080/board/1/");
    },
    compare(p) {
      //这是比较函数
      return function(m, n) {
        var a = m[p];
        var b = n[p];
        return a - b; //升序
      };
    },
    showDialog(type) {
      this.dialogVisible = true;
      this.type = type;
    },
    clearTask() {
      this.task.title = "";
      this.task.description = "";
    },
    placeTask(task) {
      task.description = task.description.replace(/\r?\n/g, "<br>");
      if (task.type === 1) {
        this.list1.push(task);
      }
      if (task.type === 2) {
        this.list2.push(task);
      }
      if (task.type === 3) {
        this.list3.push(task);
      }
      if (task.type === 4) {
        this.list4.push(task);
      }
    },
    belongList(val) {
      if (val === 1) {
        return this.list1;
      }
      if (val === 2) {
        return this.list2;
      }
      if (val === 3) {
        return this.list3;
      }
      if (val === 4) {
        return this.list4;
      }
    },
    handleClose(done) {
      this.$confirm("内容不会保存，确认关闭？")
        .then(_ => {
          this.clearTask();
          done();
        })
        .catch(_ => {});
    },
    addTask() {
      let data = {
        title: this.task.title,
        description: this.task.description,
        creator: { id: this.userInfo.userId },
        type: this.type,
        color: this.task.color,
        order: 300.1,
        boardId: this.currentBoard.id
      };
      let taskList = this.belongList(this.type);
      if (taskList.length === 0) {
        data.order = parseFloat((Math.random() * 500 + 250).toFixed(3));
      } else {
        data.order =
          parseFloat(taskList[taskList.length - 1].order) +
          parseFloat((Math.random() * 500 + 250).toFixed(5));
      }
      axios.post("http://127.0.0.1:8088/task/addTask", data).then(res => {
        this.placeTask(res.data);
        this.dialogVisible = false;
        this.clearTask();
      });
    },
    cancelAdd() {
      this.dialogVisible = false;
      this.clearTask();
    },
    calculateOrder(task, taskList) {
      let order;
      if (task.newIndex === 0) {
        if (taskList.length === 1) {
          order = parseFloat((Math.random() * 500 + 250).toFixed(3));
        } else {
          order =
            parseFloat(taskList[1].order) -
            parseFloat((Math.random() * 500 + 250).toFixed(3));
        }
      } else if (task.newIndex === taskList.length - 1) {
        order =
          parseFloat(taskList[taskList.length - 2].order) +
          parseFloat((Math.random() * 500 + 250).toFixed(3));
      } else {
        order =
          (taskList[task.newIndex - 1].order +
            taskList[task.newIndex + 1].order) /
          2;
      }
      return order;
    },
    onchange(evt) {
      if (evt.moved) {
        let task = evt.moved;
        let taskList = this.belongList(task.element.type);
        taskList[task.newIndex].order = this.calculateOrder(task, taskList);
        let data = {
          id: task.element.id,
          type: task.element.type,
          order: taskList[task.newIndex].order,
          boardId: this.currentBoard.id
        };
        axios.post("http://127.0.0.1:8088/task/"+ this.userInfo.userId +"/updateOrder", data);
      } else if (evt.added) {
        this.dragedTask = evt.added;
      }
    },
    onadd(evt) {
      let type = this.divType(evt.to.id);
      let taskList = this.belongList(type);
      while (true) {
        if (this.dragedTask !== null) {
          break;
        }
      }
      this.dragedTask.element.type = type;
      this.dragedTask.element.order = this.calculateOrder(
        this.dragedTask,
        taskList
      );
      let data = {
        id: this.dragedTask.element.id,
        type: this.dragedTask.element.type,
        order: this.dragedTask.element.order,
        boardId: this.currentBoard.id
      };
      axios.post("http://127.0.0.1:8088/task/" + this.userInfo.userId + "/updateType", data);
    },
    divType(id) {
      if (id === "list1") {
        return 1;
      }
      if (id === "list2") {
        return 2;
      }
      if (id === "list3") {
        return 3;
      }
      if (id === "list4") {
        return 4;
      }
    },
    logout() {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("userInfo");
      window.localStorage.removeItem("board");
      router.go(0);
      this.notlogin = true;
    },
    connectWs() {
      this.websocket = new WebSocket(
        "ws://localhost:8088/websocket/" +
          this.userInfo.userId +
          "/" +
          this.currentBoard.id
      );
      this.websocket.onopen = this.websocketonopen;
      this.websocket.onmessage = this.websocketonmessage;
      this.websocket.onerror = this.websocketonerror;
      this.websocket.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
    },
    websocketonerror() {
      //连接建立失败重连
      this.connectWs();
    },
    websocketonmessage(e) {
      //数据接收
      let data = JSON.parse(e.data);
      if (data.code === 100) {
        this.$message.error(data.msg);
      }
      if (data.code === 101) {
        this.$message({
          message: data.msg,
          type: "success"
        });
      }
      if (data.code === 102) {
        let task = data.data.task
        let list = this.belongList(task.type)
        let task1 = list.find(element => element.id === task.id)
        task1.order = task.order
        list = list.sort(this.compare("order"))
      }
      if (data.code === 103) {
        let task = data.data.task
        let list = this.belongList(task.type)
        let task1 = list.find(element => element.id === task.id)
        task1.title = task.title
        task1.color = task.color
        task1.description = task.description.replace(/\r?\n/g, "<br>");
      }
      if (data.code === 104) {
        this.placeTask(data.data.task)
      }
      if (data.code === 105) {
        let list = this.belongList(data.data.task.type)
        let task = this.findTask(data.data.task.id)
        let oldList = this.belongList(task.type)
        let oldIndex = this.list1.findIndex(element => element.id === task.id)
        oldList.splice(oldIndex, 1)
        task.type = data.data.task.type
        task.order = data.data.task.order
        list.push(task)
        list = list.sort(this.compare("order"))
      }
      if (data.code === 400) {
        this.showNotify(data.data);
      }
    },
    websocketsend(Data) {
      //数据发送
      this.websocket.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
    },
    findTask(id){
      let task1 = this.list1.find(element => element.id === id)
      if(task1){
        return task1
      }
      let task2 = this.list2.find(element => element.id === id)
      if(task2){
        return task2
      }
      let task3 = this.list3.find(element => element.id === id)
      if(task3){
        return task3
      }
      let task4 = this.list4.find(element => element.id === id)
      if(task4){
        return task4
      }
    },
    showNotify(data) {
      const h = this.$createElement;
      if (this.notification) {
        this.notification.close();
      }
      this.inviter = data.inviter;
      this.notification = this.$notify.info({
        title:
          data.inviter.name + " 邀请你加入 " + data.inviter.boardList[0].name,
        dangerouslyUseHTMLString: true,
        duration: 0,
        message: h("p", null, [
          h(
            "el-button",
            {
              on: {
                click: this.accept
              },
              attrs: {
                size: "small",
                type: "primary"
              }
            },
            "接受"
          ),
          h(
            "el-button",
            {
              on: {
                click: this.reject
              },
              attrs: {
                size: "small",
                type: "danger"
              }
            },
            "拒绝"
          )
        ]),
        showClose: false
      });
    },
    close() {
      this.notification.close();
    },
    accept() {
      this.close();
      let data = {};
      data["inviter"] = this.inviter;
      let invitee = { id: this.userInfo.userId, name: this.userInfo.username };
      data["invitee"] = invitee;
      console.log(data);
      axios.post("http://127.0.0.1:8088/user/acceptInvite", data).then(res => {
        console.log(res.data);
        this.$refs.boardListMethod.joinNewBoard(res.data);
        this.inviter = null;
      });
    },
    reject(inviter) {
      this.close();
      let data = {};
      data["inviter"] = this.inviter;
      let invitee = { id: this.userInfo.userId, name: this.userInfo.username };
      data["invitee"] = invitee;
      console.log(data);
      axios.post("http://127.0.0.1:8088/user/rejectInvite", data).then(res => {
        console.log(res.data);
        this.$refs.boardListMethod.joinNewBoard(res.data);
        this.inviter = null;
      });
    }
  },
  created() {
    if (window.localStorage.getItem("board") !== null) {
      this.currentBoard = JSON.parse(window.localStorage.getItem("board"));
    }
    if (window.localStorage.getItem("token") !== null) {
      axios
        .post("http://127.0.0.1:8088/user/autoLogin", null, {
          headers: { Authorization: window.localStorage.getItem("token") }
        })
        .then(res => {
          if (res.data === true) {
            this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
            axios
              .get(
                "http://127.0.0.1:8088/board/" +
                  this.currentBoard.id +
                  "/getTasks"
              )
              .then(res => {
                let tasks = res.data.sort(this.compare("order"));
                for (const task of tasks) {
                  this.placeTask(task);
                }
              });
            
              this.connectWs();
            
          } else {
            window.localStorage.removeItem("userInfo");
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("board");
            this.notlogin = true;
          }
        });
    } else {
      this.notlogin = true;
    }
  },
  destroyed() {
    this.websocket.close()
    console.log(1)
  }
};
</script>

<style>
.el-header {
  background-color: #333;
  color: rgb(194, 147, 45);
  text-align: center;
  line-height: 34px;
  font-family: "微软雅黑";
  font-size: 25px;
}
html,
body,
#app,
.el-container {
  padding: 0px;
  margin: 0px;
  height: 100%;
}
.el-main {
  padding: 10px;
  padding-top: 0px;
  height: 100%;
}
.board-table {
  margin: 0;
  padding: 0;
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  background: #fff;
  border-spacing: 0;
  /* position: relative; */
  height: calc(100% - 46px);
}
.columnHeader {
  user-select: none;
  box-sizing: border-box;
  background-color: #eee;
  border-top: 1px solid #c3c3c3;
  border-left: 1px solid #d7d7d7;
  height: 37px;
  min-width: 220px;
  vertical-align: top;
  -webkit-tap-highlight-color: transparent;
}
.columnHeader-inner {
  align-items: center;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  height: 36px;
  padding: 7px 6px 6px;
  position: relative;
}
.columnHeader-nameAndInfo {
  user-select: none;
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0 6px;
}
.columnHeader-name {
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 0 1 auto;
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  /* cursor: pointer; */
}
.board-table td {
  vertical-align: top;
}
.board-taskListCell {
  user-select: none;
  border-top: 1px solid #c3c3c3;
  border-left: 1px solid #e4e4e4;
  position: relative;
  height: 100%;
}
.column-last {
  border-right: 1px solid #c3c3c3;
}
/* .board-swimlane {
  border: 1px solid #c3c3c3;
} */
.swimlane-last .board-taskListCell {
  border-bottom: 1px solid #c3c3c3;
}
.boardHeader {
  display: flex;
  justify-content: space-between;
  z-index: 2;
  box-shadow: none;
  height: 46px;
  padding: 7px 10px 7px 17px;
  color: #333;
  position: relative;
  box-sizing: border-box;
}
.boardHeader-left {
  flex: 0 1 auto;
}
.boardHeader-info,
.boardHeader-left {
  display: flex;
  align-items: center;
  min-width: 0;
}
.taskList {
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.drag-list {
  height: calc(100% - 15px);
  border: 0px;
}
.ghost-class {
  visibility: hidden;
}
.header-icon {
  text-align: center;
  display: flex;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.header-left {
  text-align: left;
  display: flex;
  position: absolute;
  height: 34px;
}
.header-left .el-dropdown {
  display: inline;
}
.header-right {
  text-align: right;
  color: aqua;
  height: 34px;
}
.yellowcolor .el-input__inner {
  background-color: #ffffe0;
}
.greencolor .el-input__inner {
  background-color: #dcffc2;
}
.bluecolor .el-input__inner {
  background-color: #c3ddff;
}
.redcolor .el-input__inner {
  background-color: #ffccd6;
}
</style>
