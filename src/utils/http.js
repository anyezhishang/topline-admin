// 导入Vue
import Vue from 'vue'
// 导入路由对象
import router from '../router/'

// 导入全局axios
import axios from 'axios';
Vue.prototype.$axios = axios;
axios.defaults.baseURL = "http://ttapi.research.itcast.cn";

// 导入JSON-bigint
import JSONbig from 'json-bigint'

// axios默认对响应体做处理的方法
axios.defaults.transformResponse = [function (data) {

  // 对 data 进行任意转换处理
  // return JSON.parse(data); //这是axios默认的实现，我们现在不要它，因为它可能会造成大数字的精度丢失
  try {
    // 如果能转换，我就转换再返回
    return JSONbig.parse(data);
  }
  catch{
    // 如果上面不能转换，我就原样返回
    return data;
  }
}];


// axios的请求拦截器
// 添加请求拦截器
axios.interceptors.request.use(function (config) {

  // config就是请求报文数据
  // window.console.log(config)
  // 如果是第一次访问来做登录，也会被拦下来
  // 但是此时本地存储没有数据，那么只会取到null，null有token属性吗？没有就报错
  // 登录的时候肯定没有本地存储，所以我们不要直接取，而是要先判断有没有，再给它加token
  let obj = JSON.parse(window.localStorage.getItem('userInfo'));
  if (obj) {
    config.headers.Authorization = `Bearer ${obj.token}`;
  }
  // 在发送请求之前做些什么
  return config;

}, function (error) {

  // 如果请求失败进到这个函数
  // 对请求错误做些什么
  return Promise.reject(error);
});


// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么(成功响应调用)
  // window.console.log('响应成功',response)
  return response;
}, function (error) {
  // 对响应错误做点什么（响应出错调用）
  // window.console.dir(error)
  // return Promise.reject(error);
  if( error.response.status == 401){

    //代表token有问题，要么就是还没登录，要么就是你伪造的token
    //那就打回登录页面
    Vue.prototype.$message.error('请先登录')
    router.push('/login')

  }else{

    // 原来该怎么报错还怎么报错
    return Promise.reject(error)
  }
});