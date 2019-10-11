<template>
  <div>
    <el-carousel height="700px" :interval="5000" arrow="always" autoplay="true" :arrow="hover" loop="true">
      <el-carousel-item v-for="(item,index) in pictrues" 
      :key="index"
      :style="`
      background:url(${$axios.defaults.baseURL+item.url}) center center no-repeat;
      background-size:contain contain;`
      "
      >
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
export default{
  data(){
    return {
      pictrues:[],
    }
  },
  mounted(){
    // this.$axios返回来的也是一个对象
    this.$axios({
      url:"/scenics/banners"
    }).then(res=>{
      const {data} = res.data;
      this.pictrues = data;
    })
  }
}

</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>