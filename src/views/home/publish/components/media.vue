<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix" style="padding:20px;">
      <el-radio-group v-model="menu" @change="menuChange">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="收藏"></el-radio-button>
      </el-radio-group>
    </div>

    <el-row :gutter="20">
      <el-col v-for="(item,index) in list" :key="index" :span="8">
        <el-card
          class="my-card"
          :class="{ checked: item === currentItem }"
          :body-style="{ padding: '0px' }"
          style="height:150px;margin-bottom:20px;"
          @click.native="selectImage(item)"
        >
        <!-- 我给你生成的最终的原生标签加点击事件 -->
          <img :src="item.url" class="image" />
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
      layout="prev, pager, next"
      background
      :page-size="pageSize"
      :total="total"
      @current-change="pageChange"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "covermedia",
  data() {
    return {
      menu: "全部",
      list: [],
      total: 0,
      //   当前页
      page: 1,
      pageSize: 6,
      // 用来保存被点击的那个卡片
      currentItem:null
    };
  },

  methods: {

    selectImage(item){

      this.currentItem = item;
      //并且把这个图片的url直接传递给父组件
      this.$emit('image-change',item.url)
    },

    // 单选框的目录改变事件
    menuChange() {
      //发请求传入
      this.loadData();
    },

    // 页码改变事件
    pageChange(page) {
      this.page = page;
      this.loadData(page);
    },

    loadData(page = 1) {
      this.$axios
        .get("/mp/v1_0/user/images", {
          params: {
            //true代表只查收藏
            //false代表全部
            // collect: this.menu != '全部',
            // collect: this.menu == '全部' ? false : true,
            collect: !(this.menu == "全部"),
            page,
            per_page: 6
          }
        })
        .then(res => {
          //   window.console.log(res)
          this.list = res.data.data.results;
          this.total = res.data.data.total_count;
        });
    }
  },

  created() {
    this.loadData();
  }
};
</script>

<style lang="less">
.my-card {
  position: relative;

  &.checked::before{  //就是 .my-card.checked::before 的less形式
    // 伪元素默认都是行内元素，所以给宽高没用
    content:"";
    background-color:rgba(0,0,0,0.4);
    width: 100%;
    height: 100%;
    position: absolute;
    background-image:url(data:image/png;base64,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);
    background-repeat: no-repeat;
    background-size: 45px 45px;
    background-position: right top;
  }
  .el-card__body {
    height: 100%;

    img {
      height: 100% !important;
    }
  }
}

</style>