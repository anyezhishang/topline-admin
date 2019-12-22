//就写路由的代码
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


// 1.导入组件
import home from '../views/home/' //默认会找里面的index.js或者index.vue
import login from '../views/login/'
import article from '../views/home/article/'
import publish from '../views/home/publish/'
import comments from '../views/home/comments/'
import account from '../views/home/account/'
import media from '../views/home/media/'
import overview from '../views/home/overview/'

// 2.设置路由规则
const routes = [
    { path: "/login", component: login },
    // 路径毛都不输入，然后重定向到login
    { path: "", redirect: '/login' },

    // 在规则里写一个属性叫children：这就写可以写子路由的规则
    {
        path: "/home",
        component: home,
        // 以前的路由规则怎么写在子路由里还怎么写
        children: [
            // 加一个/代表根目录 /article访问
            // 不加代表要 /home/article 访问
            { path: "/article", component: article },
            // 路由名字
            { path: "/publish", component: publish, name: "add" },
            { path: "/edit/:id", component: publish, name: "edit" },
            { path: "/comments", component: comments },
            { path: "/account", component: account },
            { path: "/media", component: media },
            { path: "/overview", component: overview },
        ]
    },
]

// 3.创建路由对象,并使用规则
const router = new VueRouter({
    routes
})


// 在导入nprogress.js
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 注册导航前置守卫
/*
    to:去哪
    from:从哪来
    to和from都有一个属性叫path，代表路径
    next:是一个函数，调用这个函数就代表放行，不调用就是不放行
        next不传参数就代表你以前想去哪还去哪，如果传参，就代表把你放行到你指定的路径
*/
router.beforeEach((to, from, next) => {

    nprogress.start()

    // window.console.log(to)
    // window.console.log(from)
    // next();
    if (to.path == "/login") {
        // 如果去的是登录页面直接放行
        next();

    } else {

        //别的页面要判断是否有登录
        let str = window.localStorage.getItem('userInfo');
        if (str) {

            //有值代表登录了，就放行
            next()

        } else {

            Vue.prototype.$message.error('请先登录！');
            // router.push('/login');
            // 下面这句和上面这句都能实现
            next('/login');
        }
    }
})


import store from '../store/'

// 导航后置守卫
// to:到哪了
// from:从哪来
router.afterEach((to) => {
    // 完成进度条
    setTimeout(() => {
        nprogress.done();
    }, 500);


    // 改变导航菜单的激活项，变成进来后的页面
    // window.console.log(to)
    // 我们想访问vue实例里的某个属性，有三种方法：
    // 1.直接找到Vue原型调用
    // Vue.prototype.$store.commit('changeActive',to.path);
    // 2.实例化一个Vue对象
    // new Vue().$store.commit('changeActive',to.path)
    // 3.直接导入我们原来的store对象就行了
    store.commit('changeActive',to.path)

})

// 4.暴露出去
export default router;
