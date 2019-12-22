<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix" style="padding:20px;">
      <el-radio-group v-model="menu" @change="menuChange">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="收藏"></el-radio-button>
      </el-radio-group>

      <!-- 要想办法在这里加请求头 -->
      <el-upload
        style="float:right;"
        class="upload-demo"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="header"
        name="image"
        :show-file-list="false"
        :on-success="uploadOK"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>

    <el-row :gutter="20">
      <el-col v-for="(item,index) in list" :key="index" :span="4">
        <el-card :body-style="{ padding: '0px' }" style="height:200px;margin-bottom:20px;">
          <img :src="item.url" class="image" />
          <div class="tip-box" style="padding: 14px;background-color:#f4f5f6">
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.is_collected ? '取消收藏' : '收藏'"
              placement="top"
            >
              <el-button
                @click="doCollect(item)"
                type="text"
                :icon="`el-icon-star-${item.is_collected ? 'on':'off'}`"
              ></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button @click="doDel(item)" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </div>
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
  name: "media",
  data() {
    return {
      // 请求头
      header: {
        Authorization: `Bearer ${this.$store.state.userInfo.token}`
      },
      menu: "全部",
      list: [],
      total: 0,
      //   当前页
      page: 1,
      pageSize: 12
    };
  },

  methods: {
    uploadOK() {
      this.loadData(this.page);
    },
    // 删除的点击事件
    doDel(item) {
      this.$axios.delete(`/mp/v1_0/user/images/${item.id}`).then(() => {
        this.loadData(this.page);
      });
    },

    // 收藏的点击事件
    doCollect(item) {
      // 跟原来的值做比较，原来是true就要变false，原来false变true
      item.is_collected = !item.is_collected;

      this.$axios.put(`/mp/v1_0/user/images/${item.id}`, {
        collect: item.is_collected
      });
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
            per_page: 12
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
.el-card__body {
  height: 100%;
  display: flex;
  flex-direction: column;

  img {
    height: 85%;
  }

  .tip-box {
    display: flex;
    height: 15%;
    justify-content: space-around;
    align-items: center;
    padding: 0 !important;

    .el-button {
      padding: 0;
    }
  }
}
</style>