<template>
  <el-card class="box-card">
    <!-- 对应上面那部分 -->
    <div slot="header" class="clearfix">
      <el-form ref="form" :model="form" label-width="40px">
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label>全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <!-- <channel @change="form.channel_id = $event"></channel> -->
          <channel v-model="form.channel_id"></channel>
        </el-form-item>

        <!-- format是设置输入框上的时间格式，value-format是设置绑定数据的格式 -->
        <el-form-item label="时间">
          <el-date-picker
            v-model="form.date"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-button type="primary" @click="doSearch">筛选</el-button>
      </el-form>
    </div>

    <!-- 放下面部分 -->
    <p>共找到 {{total}} 条符合条件的内容</p>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="cover.images[0]" label="封面" width="260">
        <!-- scope.row拿到的是当前这一行的数据 -->
        <template slot-scope="scope">
          <img
            style="width:60px;"
            v-for="(item,index) in scope.row.cover.images"
            :key="index"
            :src="item"
            alt
          />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | formatStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pubdate" label="发布时间"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="$router.push(`/edit/${scope.row.id}`)">修改</el-button>
          <el-button size="mini" type="danger" @click="doDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 
      分页部分
      current-page：设置当前页
      page-size:设置页容量
      total：总数量
      layout：设置从左到右显示的一些内容
          tatal代表显示总数量
          prev代表显示上一页
          pager代表显示页码
          next代表显示下一页
    -->
    <el-pagination
      background
      @current-change="pageChange"
      layout="total,prev, pager, next"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
import channel from "../components/channel"; //channel.js  channel.vue

export default {
  // 给组件加一个name方便在谷歌工具里直接搜索
  // 起名不能跟html标签冲突
  name: "articles",
  components: {
    channel
  },
  data() {
    return {
      // 绑定的筛选条件数据
      form: {
        status: "",
        channel_id: "",
        date: ""
      },

      // 总数据量
      total: 0,

      // 表格的数据源
      tableData: []
    };
  },

  methods: {
    // 事件触发时需要传入一个参数
    async doDel(id) {
      /*
      //弹出一个确认框
      this.$confirm("请问你真的要删除吗？", "是否删除", {
        type: "error"
      })

        // 如果点确定进入.then
        .then(() => {
        
          // 要去做删除
          this.$axios
            .delete(`/mp/v1_0/articles/${id}`)
            .then( () => {
              // 重新请求第一页的数据
              this.loadData(1);

              this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(() => {
              this.$message("删除失败！");
            });
        })
        // 如果点取消就进入.catch
        .catch(() => {
          this.$message({
            type: "info",
            message: "小B崽子别瞎点"
          });
        });
     */

      //弹出一个确认框
      await this.$confirm("请问你真的要删除吗？", "是否删除", {
        type: "error"
      });

      // 要去做删除
      await this.$axios.delete(`/mp/v1_0/articles/${id}`);

      // 重新请求第一页的数据
      this.loadData(1);

      this.$message({
        type: "success",
        message: "删除成功!"
      });
    },

    // 筛选的点击事件
    doSearch() {
      // 拿到你选择的筛选条件（this.form），发请求就可以了
      // let token = JSON.parse(window.localStorage.getItem("userInfo")).token;
      // this.$axios
      //   .get("/mp/v1_0/articles", {
      //     headers: {
      //       Authorization: `Bearer ${token}`
      //     },
      //     // 如果参数这里的值为undefined，那么axios就不会帮你传这个参数
      //     params: {
      //       // 这里记得一定要用全等（在一些语法规范里也是建议我们使用全等），不然我们有一个值为0,0的值等于空字符串
      //       status: this.form.status === "" ? undefined : this.form.status,
      //       channel_id: this.form.channel_id === "" ? undefined : this.form.channel_id,
      //       begin_pubdate: this.form.date[0],
      //       end_pubdate: this.form.date[1],
      //       page: 1,
      //       per_page: 10
      //     }
      //   })
      //   .then(res => {
      //     // window.console.log(res);
      //     this.tableData = res.data.data.results;
      //     this.total = res.data.data.total_count;
      //   });
      this.loadData(1);
    },
    // 页码的改变事件
    // 参数是改变后的页码
    pageChange(page) {
      // 改变后的页码是几就要取查第几页的数据
      this.loadData(page);
    },

    // 封装一个获取数据的方法，把名字叫loadData
    // axios特点：拿到响应体后，如果响应体是JSON，它会自动调用JSON.parse转换成JS对象
    // 所以我们想改变它的这种默认对响应体转换方式
    // 那么我们就需要重写它对响应体转换的方式
    async loadData(page) {
      /*
      this.$axios
        .get("/mp/v1_0/articles", {
          // get请求的参数
          params: {
            status: this.form.status === "" ? undefined : this.form.status,
            channel_id:
              this.form.channel_id === "" ? undefined : this.form.channel_id,
            begin_pubdate: this.form.date[0],
            end_pubdate: this.form.date[1],
            page,
            per_page: 10
          }
        })
        .then(res => {
          this.tableData = res.data.data.results;
          this.total = res.data.data.total_count;
        });
    
    */

      let res = await this.$axios.get("/mp/v1_0/articles", {
        // get请求的参数
        params: {
          status: this.form.status === "" ? undefined : this.form.status,
          channel_id:
            this.form.channel_id === "" ? undefined : this.form.channel_id,
          begin_pubdate: this.form.date[0],
          end_pubdate: this.form.date[1],
          page,
          per_page: 10
        }
      });

      this.tableData = res.data.data.results;
      this.tatal = res.data.data.total_count;
    }
  },

  filters: {
    formatStatus(val) {
      // switch里的判断是全等判断
      switch (
        val //因为val是数字，所以这里case也要写数字
      ) {
        case 0:
          return "草稿";
        case 1:
          return "待审核";
        case 2:
          return "审核通过";
        case 3:
          return "审核失败";
      }
    }
  },

  beforeCreate() {
    window.console.log("article -beforecreate");
  },

  created() {
    // 查出第一页的文章
    // 拿出本地存储里的token
    this.loadData(1);
  }
};
</script>

<style>
</style>