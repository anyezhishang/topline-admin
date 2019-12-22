<template>
  <div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="comment_status" label="评论状态" width="180">
        <template slot-scope="scope">{{ scope.row.comment_status ? '正常' : '关闭' }}</template>
      </el-table-column>
      <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
      <el-table-column prop="fans_comment_count" label="评论粉丝数"></el-table-column>
      <el-table-column prop="address" label="允许评论">
        <template slot-scope="scope">
          <!-- 
             active-color：开关打开的颜色
             inactive-color:开关关闭的颜色

             $event对于原生标签是事件对象
             对于组件是它最新的值（数据）
          -->
          <el-switch
            @change="changeStatus(scope.row.id,$event)"
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template>
          <el-button size="mini" type="primary" plain>修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="pageChange"
      :current-page.sync="page"
      :page-sizes="[10, 15, 20, 25,30]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "comments",
  data() {
    return {
      tableData: [],
      total: 0,
      page: 1
    };
  },

  methods: {
    sizeChange(size) {
      this.page = 1;
      this.loadData(1, size);
    },
    //页码改变事件
    pageChange(page) {
      //根据页码发请求获取数据
      this.loadData(page);
    },

    //开关值改变事件，参数是改变后的值
    changeStatus(id, val) {
      //发请求去修改状态
      this.$axios
        .put(
          "/mp/v1_0/comments/status",
          {
            allow_comment: val
          },
          {
            params: {
              article_id: "" + id
            }
          }
        )
        .then(() => {
          this.$message.success("修改成功");
        })
        .catch(() => {
          this.$message.error("修改失败！");
        });
    },

    loadData(page, size = 10) {
      this.$axios
        .get("/mp/v1_0/articles", {
          params: {
            page,
            per_page: size,
            response_type: "comment"
          }
        })
        .then(res => {
          // window.console.log(res)
          this.tableData = res.data.data.results;
          this.total = res.data.data.total_count;
        });
    }
  },

  created() {
    this.loadData(1);
  }
};
</script>

<style>
</style>