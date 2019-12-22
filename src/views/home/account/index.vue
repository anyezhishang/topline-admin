<template>
  <el-container class="my-container">
    <el-aside class="my-aside" width="500px">
      <!-- 左侧表单 -->
      <el-form ref="form" :model="form" label-width="80px" label-position="top">
        <el-form-item label="媒体名称">
          <el-input v-model="form.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="媒体简介">
          <el-input v-model="form.intro" type="textarea" size="small"></el-input>
        </el-form-item>

        <el-form-item label="头条号id">
          <el-input :value="form.id + ''" size="small" disabled></el-input>
        </el-form-item>

        <el-form-item label="绑定手机">
          <el-input v-model="form.mobile" size="small" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="form.email" size="small"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">保存更新</el-button>
        </el-form-item>
      </el-form>
    </el-aside>

    <!-- 右边 -->
    <el-main class="my-main">
      <!-- 
          
          饿了么UI提供的上传
            action：上传图片提交的地址
            show-file-list：上传后是否显示文件名,false代表不显示，默认值是true

        我们设置的是axios的基地址，顾名思义，只能是axios发的请求才会拼接基地址
        而el-upload不是通过axios发请求，就不会帮我们拼接基地址
        el-upload帮我们上传文件的时候默认用的是post请求，而且无法改
        如果非要用别的请求方式怎么办？
        那么就覆盖它原本的上传，使用自定义上传
        使用http-request自定义上传
      -->
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
        :show-file-list="false"
        :http-request="myUpload"
      >
        <!-- 真正显示图片就是靠img -->
        <img v-if="form.photo" :src="form.photo" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name:"account",
  data() {
    return {
      form: {
        name: "",
        intro: "",
        mobile: "",
        email: "",
        photo: ""
      }
    };
  },

  methods: {

    // 保存的点击事件
    save() {

        //发请求
        this.$axios.patch('/mp/v1_0/user/profile',this.form)
        .then( () => {

            this.$message.success('更新成功')
            // 把最新数据赋值给vuex
            this.$store.commit('changeUserInfo',this.form)
        })
        .catch( () => {

            this.$message.error('更新失败')
        } )
    },
    //自定义上传
    //选择完图片后调用
    myUpload(config) {
      // window.console.log(config.file);
      // ajax默认可以上传图片吗？不可以
      // 要上传图片必须还要用FormData对象
      let fm = new FormData();
      // 参数1：key（接口要求叫什么就叫什么）
      // 参数2：真正要上传的数据
      fm.append("photo", config.file);

      this.$axios.patch("/mp/v1_0/user/photo", fm).then(res => {
        //   window.console.log(res);
        this.form.photo = res.data.data.photo;
      });
    }
  },

  created() {
    this.$axios.get("/mp/v1_0/user/profile").then(res => {
      //   window.console.log(res);
      this.form = res.data.data;
    });
  }
};
</script>

<style lang="less" scoped>
.my-container {
  height: 110%;
  background-color: #fff;
  padding: 0 20px;

  .my-aside {
    padding-bottom: 20px;
  }

  .my-main {
  }
}

// 深度选择器（vue提供的）
// 用在什么地方？当我想改别人封装好的组件的某个样式
// 但是发现改了没效果，连审查元素都找不到这个样式
// 这个时候就可以用深度选择器，代表这个样式要下沉到组件里面
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>