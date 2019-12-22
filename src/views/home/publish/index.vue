<template>
  <el-card class="box-card" style="background-color:#fff;margin:20px;">
    <div
      slot="header"
      class="clearfix"
      style="padding-left:10px;background-color:lightgray;height:50px; display:flex; align-items:center;"
    >
      <span>{{title}}</span>
    </div>

    <el-form ref="form" :rules="rules" :model="form" label-width="60px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item label="内容">
        <quillEditor v-model="form.content"></quillEditor>
      </el-form-item>

      <el-form-item label="封面">
        <el-radio-group v-model="form.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>

        <el-row :gutter="20" v-if="form.cover.type > 0">
          <el-col :span="6" v-for="(item,index) in form.cover.type" :key="index">
            <!-- <cover :url="form.cover.images[index]" @image-change='form.cover.images[index] = $event'></cover> -->
            <cover v-model="form.cover.images[index]"></cover>
          </el-col>
        </el-row>
        

      </el-form-item>

      <el-form-item label="频道">
        <!-- <channel :id="form.channel_id" @change="form.channel_id = $event"></channel> -->
        <channel v-model="form.channel_id"></channel>
      </el-form-item>

      <el-form-item>
        <el-button size="small" @click="send(true)">保存草稿</el-button>
        <el-button size="small" type="primary" @click="send(false)">发布...</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

import channel from "../components/channel";
import cover from "./components/cover";

export default {
  name: "publish",
  components: {
    quillEditor,
    channel,
    cover
  },
  data() {
    return {
      title: "发表文章",
      // 都是当前最新的数据
      form: {
        title: "",
        content: "",
        channel_id: "",
        // 封面，暂时写死
        cover: {
          type: 0,
          images: []
        }
      },
      // 保存旧数据
      oldForm: {
        title: "",
        content: "",
        channel_id: "",
        // 封面，暂时写死
        cover: {
          type: 1,
          images: []
        }
      },
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" },
          { min: 5, max: 13, message: "标题在5-13个字符之间", trigger: "blur" }
        ]
      },

      // 是否为发送，默认为false
      isSend: false
    };
  },

  methods: {
    send(isDraft) {
      this.$refs["form"].validate(v => {
        if (v) {

          // type为1，数组长度为1，type为3，数组长度为3
          this.form.cover.images.length = this.form.cover.type;

          if (this.$route.name == "edit") {
            // 是修改，那么这里就要发修改的请求
            // 拿到id
            const id = this.$route.params.id;
            this.$axios
              .put(`/mp/v1_0/articles/${id}`, this.form)
              .then(() => {
                this.$message.success("修改成功！");
                this.isSend = true;
                this.$router.push("/article");
              })
              .catch(() => {
                this.$message.error("修改失败！");
              });
          } else {
            // else代表修改
            //发请求做的新增（发布）
            this.$axios
              // .post("/mp/v1_0/articles", {
              //   title: this.form.title,
              //   content: this.form.content,
              //   cover: this.form.cover,
              //   channel_id: this.form.channel_id
              // })
              .post("/mp/v1_0/articles", this.form, {
                params: {
                  draft: isDraft
                }
              })
              .then(() => {
                // 进来.then都代表发表成功
                this.$message.success("新增成功！");
                this.isSend = true;
                this.$router.push("/article");
              })
              .catch(() => {
                this.$message.error("新增失败！");
              });
          }
        }
      });
    },

    loadData() {
      //获取id
      const id = this.$route.params.id;
      // 发请求获取数据
      this.$axios.get(`/mp/v1_0/articles/${id}`).then(res => {
        // window.console.log(res)
        // 其中就有频道id
        this.form = res.data.data;

        // 保存初始值
        this.oldForm.title = this.form.title;
        this.oldForm.content = this.form.content;
      });
    }
  },

  watch: {
    // 侦听路由名字变化
    "$route.params.id"() {
      // this.title = this.$route.name === "edit" ? "修改文章" : "发表文章";
      if (this.$route.name == "edit") {
        this.title = "修改文章";
        //重新获取数据
        this.loadData();
      } else {
        this.title = "发表文章";
        // 大家在vue里要清空或者说改掉对象类型的值的时候，最好不要直接赋值
        // 而是一个属性一个属性的改
        this.form.title = this.form.content = "";
        this.oldForm.title = this.oldForm.content = "";

        this.form.cover.images = [];
        this.form.cover.type = 0;
        this.form.channel_id = "";
      }
    }

    // // id一变重新获取数据
    // "$route.params.id"() {
    //   //id一旦变化就发请求重新获取数据
    //   const id = this.$route.params.id;
    //   this.$axios.get(`/mp/v1_0/articles/${id}`).then(res => {
    //     // window.console.log(res)
    //     // 其中就有频道id
    //     this.form = res.data.data;

    //     // 保存初始值
    //     this.oldForm.title = this.form.title;
    //     this.oldForm.content = this.form.content;
    //   });
    // }
  },
  created() {
    // created只有在组件创建时调用一次
    if (this.$route.name === "edit") {
      this.title = "修改文章";
      this.loadData();
      //获取传递过来的id
      // const id = this.$route.params.id;
      // this.$axios.get(`/mp/v1_0/articles/${id}`).then(res => {
      //   // window.console.log(res)
      //   // 其中就有频道id
      //   this.form = res.data.data;

      //   // 保存初始值
      //   this.oldForm.title = this.form.title;
      //   this.oldForm.content = this.form.content;
      // });
    }
  },

  /*
    to：去哪
    from：从哪来
    next:是否放行
  */
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // window.console.log(to)
    // window.console.log(from)
    // window.console.log(next)

    // 如果你点击的是发布或者保存草稿，那么就直接放行
    if (this.isSend) {
      next();
    } else {
      // 否则
      // 判断最新的值是否等于原来的值
      if (
        this.form.title != this.oldForm.title ||
        this.form.content != this.oldForm.content
      ) {
        this.$confirm("页面存在改动的内容，请问是否要继续离开？", "是否离开")
          .then(() => {
            next();
          })
          .catch(() => {
            // 如果没传参数，原来该去哪还去哪
            // 如果有参数，就帮你放行到参数那个路径上
            // 留在当前页面
            next(from.path);
          });
      } else {
        // 没有改动的，直接放行
        next();
      }
    }
  }
};
</script>

<style lang="less">
.el-card__header {
  padding: 0;
}

.ql-editor {
  height: 400px;
}

</style>