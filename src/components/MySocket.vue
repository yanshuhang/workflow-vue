<template>
  <div>
    <button @click="connect">连接</button>
    <h1>{{msg}}</h1>

    <el-button plain @click="open">隐藏关闭按钮</el-button>
     <el-button @click="close">关闭</el-button>
  </div>
</template>

<script>
export default {
  name: "mySocket",
  data() {
    return {
      msg: "",
      ws: null,
      instance: null,
    };
  },
  methods: {
    connect() {
      this.ws = new WebSocket("ws://localhost:8088/my/websocket");
      this.ws.onopen = this.websocketonopen;
      this.ws.onmessage = this.websocketonmessage;
      this.ws.onerror = this.websocketonerror;
      this.ws.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      let token = window.localStorage.getItem("token");
      this.ws.send(token);
    },
    websocketonerror() {
      //连接建立失败重连
      this.connect();
    },
    websocketonmessage(e) {
      //数据接收
      this.msg = e.data;
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
    },
    open() {
      const h = this.$createElement;
      if (this.instance) {
        this.instance.close()
      }
       this.instance = this.$notify.info({
        title: "xxx邀请你加入sss",
        dangerouslyUseHTMLString: true,
        duration:0,
        message: h("p", null, [
          h(
            "el-button",
            {
              on: {
                click: this.close
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
                click: this.close
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
      // instance.close()
    },
    close() {
      this.instance.close()
    },
  }
};
</script>

