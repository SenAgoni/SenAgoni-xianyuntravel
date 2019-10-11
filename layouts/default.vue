<template>
  <div>
    <!-- 这里可以提取公共部分的头部出来 -->
    <Header/>
    <!-- 这是页面文件的主要渲染的文件 -->
    <nuxt />
    <!-- 这是公共底部部分 -->
    <Footer/>
  </div>
</template>
<script>
import Header from "@/components/header"
import Footer from "@/components/footer"
export default {
  components:{
    Header,
    Footer
  }
}
</script>

<style lang="less">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}


*{
  margin:0; 
  padding:0;
}
ul, li, ol{
  list-style:none;
}
a{
  text-decoration:none;
  color:inherit;
}
a:hover{
  color:inherit;
}
em,i{
  font-style: normal;
}

</style>
