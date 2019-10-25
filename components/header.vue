<template>
  <div style="padding:0 150px;border-bottom:2px solid #dddddd;border-shadow:2px solid #f5f5f5">
      <el-row type="flex" justify="space-between" align="middle">
          <el-row type="flex" justify="space-between" align="middle" class="left">
            <div class="logo">
                <img src="http://157.122.54.189:9093/images/logo.jpg" alt="">
            </div>
            <div class="navbar">
                <nuxt-link to="/">首页</nuxt-link>
                <nuxt-link to="/post">旅游攻略</nuxt-link>
                <nuxt-link to="/hotel?city=深圳">酒店</nuxt-link>
                <nuxt-link to="/air">国内机票</nuxt-link>
            </div>
          </el-row>
         <div class="right">
            <nuxt-link to="/user/login" v-if="!$store.state.user.userInfo.token">登录 / 注册</nuxt-link>
            <el-dropdown :hide-on-click="false" v-else>
                <img 
                style="width:45px;height:45px;border-radius:50%;vertical-align:middle;border:2px solid #409eff"
                :src="$axios.defaults.baseURL + $store.state.user.userInfo.user.defaultAvatar"
                >
                <span class="el-dropdown-link">
                    {{$store.state.user.userInfo.user.nickname}}
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人中心</el-dropdown-item>
                    <el-dropdown-item>
                        <!-- 在插件中不能直接使用点击数事件的方法的,需要emit或者是在里面添加一个标签, -->
                        <span @click="handleLoginOut">退出</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

         </div>
      </el-row>
  </div>
</template>

<script>
export default {
    methods:{
        handleLoginOut(){
            this.$store.commit('user/setUserInfo',{});
            this.$router.push("user/login")
        }
    }
}
</script>

<style scoped lang="less">
    /deep/ .nuxt-link-exact-active{
                background:#409eff;
                color:#fff!important;
            }
    a{
        display:inline-block;
        padding:0 20px;
        height:60px;
        line-height: 60px;
        box-sizing: border-box;

        &:hover,&:focus, &:active {
            border-bottom:5px #409eff solid;
            color:#409eff;
        }
     }
</style>