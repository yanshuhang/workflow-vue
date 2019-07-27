<template>
  <div>
      <button @click="connects">连接</button>
  </div>
</template>
<script>
export default {
  name: "ws",
  methods: {
    connect() {
      new WebSocket(
        "ws://localhost:8088/websocket/" +
          1 +
          "/" +
          1
      );
    },
    connects() {
        setInterval(() => {
            this.connect()
        }, 1);
    }
  }
};
</script>
