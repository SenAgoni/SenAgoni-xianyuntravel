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
                <nuxt-link to="/hotel">酒店</nuxt-link>
                <nuxt-link to="/air">国内机票</nuxt-link>
            </div>
          </el-row>
         <div class="right">
            <nuxt-link to="/user/login">登录 / 注册</nuxt-link>
         </div>
      </el-row>
  </div>
</template>

<script>
export default {

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