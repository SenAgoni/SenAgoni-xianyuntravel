
export const state = ()=>{
    return {
        userInfo:{}
    }
}
// 把数据暴露出去 这个方法用于登录成功后把数据存到仓库中,以便验证
export const mutations = {
    setuserInfo(state,params){
       state.userInfo = params
    }
}