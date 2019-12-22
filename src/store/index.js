import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


const store = new Vuex.Store({
    
    state:{

        activeIndex:"",
        // 让vuex的数据从本地存储取出来
        // 逻辑或的短路：一真则真，也就是说左边为true，右边不执行，结果就是左边的结果
        // 如果左边为false,就执行右边，结果也是右边的结果
        // e = e || window.event;
        userInfo: JSON.parse(window.localStorage.getItem('userInfo')) || {}
    },

    mutations:{

        // 修改用户信息
        changeUserInfo(state,obj){

            // state.userInfo.name = obj.name;
            // state.userInfo.photo = obj.photo;
            // state.userInfo.intro = obj.intro;
            // state.userInfo.email = obj.email;
            // state.userInfo.mobile = obj.mobile;

            // if(obj.token)
            //     state.userInfo.token = obj.token;
            
            // 它只会对已有的属性进行更新，没有的属性进行添加
            // 然后原来不冲突的保留（token）
            Object.assign(state.userInfo,obj);

            window.localStorage.setItem('userInfo',JSON.stringify(state.userInfo))
        },

        // 修改激活菜单
        changeActive(state,active){

            state.activeIndex = active;
        }
    }
})

export default store;