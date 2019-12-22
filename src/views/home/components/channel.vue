<template>
  <!-- 组件的$event是值 -->
  <el-select :value="id" placeholder="请选择频道" @change="$emit('change',$event)">
    <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: "channel",
  props: ["id"],

  //你如果希望外面能用v-model，那么里面要写model
  model: {
    prop: "id",
    event: "change"
  },
  data() {
    return {
      channelList: []
    };
  },

  created() {
    // 查出所有频道
    this.$axios.get("/mp/v1_0/channels").then(res => {
      this.channelList = res.data.data.channels;
    });
  }
};
</script>

<style>
</style>