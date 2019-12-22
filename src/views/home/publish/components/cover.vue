<template>
  <div>
    <!-- 外面的那个显示点击选择图片 -->
    <div class="cover" @click="dialogVisible = true">

      <img style="width:100%;height:100%;" v-if="url" :src="url" alt="">
      <div v-else>
        <h2>点击选择图片</h2>
        <i class="el-icon-picture-outline"></i>
      </div>
      
    </div>

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="45%">
      <el-tabs v-model="activeName">
        <!-- label才是改标签的文字，双标签里面是放它的内容 -->
        <el-tab-pane label="上传图片" name="one">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :headers="header"
            name="image"
            :on-success="uploadOK"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>

        <el-tab-pane label="媒体库" name="two">
            <media @image-change='imageUrl = $event'></media>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

// 导入组件
import media from './media'

export default {
  name: "cover",

  props:['url'],

  model:{

    prop:"url",
    event:"image-change"
  },

  components:{

      media
  },
  data() {
    return {
      header:{
          Authorization:`Bearer ${this.$store.state.userInfo.token}`
      },
      dialogVisible: false,
      activeName: "one",
      imageUrl:"",
    };
  },

  methods: {

      // 确定的点击事件
      doOK(){

          // this.url = this.imageUrl;
          //隐藏对话框
          this.dialogVisible = false;

          // 给父组件传值
          this.$emit('image-change',this.imageUrl)
      },
      //参数1：是文件上传成功后的响应体
      uploadOK(response){
        //   window.console.log(response)
          this.imageUrl = response.data.url;
      }
  },
};
</script>

<style lang="less" scoped>
.cover {
  width: 200px;
  height: 200px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  i {
    font-size: 120px;
    color: #ccc;
  }
}

/deep/.avatar-uploader .el-upload {
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