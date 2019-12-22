<template>
  <div class="login-wrap">
    <div class="login">
      <div class="logo-box">
        <img src="./images/login_logo.png" alt />
      </div>

      <!-- 表单绑定的数据 -->
      <el-form :model="form" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button :disabled="btnDisabled" @click="getCode">{{ btnText }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item prop="agree">
          <el-checkbox v-model="form.agree">
            我已阅读并同意
            <a href="javascript:void(0)">用户协议</a>和
            <a href="javascript:void(0)">隐私条款</a>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button :loading="isLoading" type="primary" style="width:100%;" @click="doLogin"> {{ msg }} </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg:'登录',
      isLoading:false,
      // 这个属性控制获取验证码是否禁用
      btnDisabled: false,
      btnText: "获取验证码",
      form: {
        mobile: "18801185985",
        code: "246810",
        agree: true
      },
      //规则对象
      rules: {
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          //   { min:11,max:11,message:'请输入正确的手机号',trigger:'blur' }
          // 下面这句和上面这句一样的意思
          //   { len: 11, message: "请输入正确的手机号", trigger: "blur" }
          {
            pattern: "0?(13|14|15|18|17)[0-9]{9}",
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],

        code: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
          { len: 6, message: "验证码必须为6位", trigger: "blur" }
        ],

        agree: [
          { pattern: /true/, message: "必须勾选同意协议！", trigger: "change" }
        ]
      }
    };
  },

  methods: {
    getCode() {
      //先把按钮禁用
      this.btnDisabled = true;
      //准备变量记录时间
      let sec = 60;
      this.btnText = "还有60秒";

      let timerID = setInterval(() => {
        
        if(sec == 59){

          this.form.code = "246810";
        }

        sec--;
        this.btnText = "还有" + sec + "秒";

        if( sec == 0){

          //停止计时器
          clearInterval(timerID);
          //文字变回获取验证码
          this.btnText = "获取验证码";
          //启用
          this.btnDisabled = false;
        }
        
      }, 1000);
    },
    doLogin() {
      //找到表单元素，调用validate方法，做整个表单验证
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {

          this.isLoading = true;
          this.msg = "正在登录中..."

          // alert("全部通过");
          // 全部通过再发请求，注意：千万不能有空格
          this.$axios
            .post("/mp/v1_0/authorizations", {
              mobile: this.form.mobile,
              code: this.form.code
            })
            .then(res => {
              // 跟eslint这个插件有关
              // eslint是做代码规范的检查工具
              // window.console.log(res);
              // 把登录成功返回的用户信息存到localStorage
              // 本地存储只能存字符串
              // window.localStorage.setItem('userInfo',JSON.stringify(res.data.data))
              // 存到vuex,也存了本地存储
              this.$message.success("登录成功！");
              this.$store.commit('changeUserInfo',res.data.data);


              this.$router.push("/home");
            })
            .catch(() => {
              //如果账号密码其中有一个错误，就会得到响应码报错
              //报错就会进到catch，只要进到then就代表成功
              //只要进到catch就失败
              this.$message.error("手机号或验证码错误！");
              this.isLoading = false;
              this.msg = '登录';
            });
        }
      });
    }
  }
};
</script>



<style lang="less">
.login-wrap {
  /* 
            参数1：路径
            参数2：是否平铺
            参数3：图片位置
            参数4：写参数4的时候必须在参数3后面打一个/  图片大小
                    cover:等比例缩放，图片一定会覆盖盒子（可能会有超出）
                    contain：等比例缩放，图片一定被包含在盒子里面（一定不会超出）
            参数5：背景颜色
 */
  background: url(./images/login_bg.jpg) no-repeat center / cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .login {
    width: 300px;
    background-color: #fff;
    padding: 20px 40px;

    .logo-box {
      text-align: center;
      padding: 20px 0;

      img {
        width: 150px;
      }
    }
  }
}
</style>