
export const state = ()=>{
    return {
        userInfo:{},
    }
}
// 把数据暴露出去 这个方法用于登录成功后把数据存到仓库中,以便验证
export const mutations = {
    setUserInfo(state,params){
       state.userInfo = params
    }
}

// 异步验证
export const actions = {
    setData(store,data){
        // 能调用之后就可以把数据存到store当中 第一参数是上面存储数据的方法，第二个参数是调用的时候传送过来的数据
        store.commit('setUserInfo',data);
    },
    // actions不仅仅可以存储数据，还可以存储方法以便别的组件来调用 然后其他地方想要调用登录的方法就可以直接调用就可以了
    login(store,data){
        this.$axios({
            url:"/accounts/login",
            data,
            method:"POST"
        }).then(res=>{
            // 在这里把数据存到本地存储中,想要调用actions里面任何方法都要使用dispatch
            store.dispatch('setData',res.data);
            // 因为这里调用不到this下面的message这一个方法，所以要把结果返回给调用方法的那一边
            return res;
        })
    },
    //注册用户的方法封装
    async register(store,data){
        var res = await this.$axios({
            url:"/accounts/register",
            method:"POST",
            data
        })
        if( res.status==200 ){
            // 注册成功后把数据存储到本地存储中
            store.dispatch('setData',res.data);
            // 返回一个注册成功的一个结果
            return res;
        }
    },
    // 发送验证码的方法封装
    async sendCheckcode(store,tel){
        var res = await this.$axios({
            url:"/captchas",
            method:"POST",
            data:{tel}
        })
        if(res.status === 200){ 
            return res
        }
    }
}