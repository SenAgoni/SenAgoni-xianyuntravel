<template>
  <div>
       <nuxt-link :to="`/hotel/hotelDetail?id=${item.id}`">
        <el-row class="content">
        <nuxt-link :to="`/hotel/detail?id=`+item.id"> 
            <el-col :span="7">
                <img :src="item.photos" style="width:320px;height:210px" alt="">
            </el-col>
         </nuxt-link>
            <el-col :span="16">
                <el-row type="flex" justify="space-between" class="text-left">
                        <el-col :span="16">
                            <h2>{{item.name}}</h2>
                            <p style="width:405px"><span style="color:#9999a6">{{item.alias}}</span><span> <i class="iconfont iconhuangguan" v-if="item.hotellevel" v-for="e in starNum" :key="e" style="color:#f90"></i>
                            {{item.hoteltype.name}}</span></p>
                            <p style="position:relative">
                                <!-- 星星图标 -->
                                <i class="el-rate__icon el-icon-star-on" 
                                v-for="(e,index) in 5" 
                                :class="{
                                    addColor:index+1 <= Math.floor(item.stars),
                                    }" 
                                :key="index">
                                <span class="coverlayer" v-if="index+1 == Math.ceil(item.stars) && item.stars!==Math.floor(item.stars)">
                                    <i class="el-icon-star-on coverStar">
                                    </i>
                                </span>
                                </i>
                                <em>{{item.stars}}</em> 分 &nbsp;&nbsp;&nbsp;
                                <em>{{item.all_remarks}}</em> 条评价 &nbsp;&nbsp;&nbsp;
                                <em>{{item.price}}</em> 篇游记
                            <p>
                                <i class="el-icon-location"></i>
                                位于：{{item.address}}</p>
                        </el-col>
                        <el-col :span="8">
                            <div @click="See(`https://hotels.ctrip.com/hotel/694679.html`)">
                                <el-row type="flex" v-for="(el,index) in item.products" :key="index" justify="space-between" class="xiecheng">
                                        <span>{{el.name}}</span>
                                        <span>
                                            <em>￥{{el.price}}</em>起
                                            <i class="el-icon-arrow-right"></i>
                                        </span>
                                </el-row>
                            </div>
                        </el-col>
                </el-row>
            </el-col>
        </el-row>
        </nuxt-link>
  </div>
</template>

<script>
export default {
    props:{
        item:{
            type:Object,
            default:{},
        }
    },
    data(){
        return {
            hotelDetails:[],
            starNum:0,
        }
    },
    methods:{
        See(e){
            window.location.href = e;
        }
    },
    mounted(){
        if(!this.item.hotellevel) return
        this.starNum = this.item.hotellevel.level
    }
}
</script>

<style scoped lang="less">
    em{
        color: rgb(247, 186, 42);
    }
    .coverlayer{
        position: absolute;
        top:-5px;
        left:0;
        display: inline-block;
        overflow: hidden;
        width:9px;
        height:20px;
    }
    .coverStar{
        position: absolute;
        top:5px;
        left:0px;
        color: rgb(247, 186, 42);
    }
    .addColor{
        color: rgb(247, 186, 42);
    }
    .el-rate__icon{
        margin-right:0;
    }
    .text-left{
        line-height: 1.8;
    }
    .xiecheng{
        border-bottom:1px solid #ddd;
        line-height:2.6;
    }
    .content{
        margin-bottom:45px
    }
</style>