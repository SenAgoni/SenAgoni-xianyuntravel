<template>
    <section class="contianer">
 
        <el-row  type="flex" justify="space-between">

            <!-- 顶部过滤列表 -->
            <div class="flights-content">
                <!-- 过滤条件 -->
                <div>
                   <Airfilter
                   :dataAir="flightDatas.options"
                   :data="dataList"
                   @setDataList="setDataList"
                   />
                </div>
                
                <!-- 航班头部布局 -->
                <div>
                     <Airhead/>
                </div>
                
                
                <!-- 航班信息 要循环的是组件-->
                <div v-if="flightList.length>0">
                    <Airlist v-for="(item,index) in flightList"
                    :key="index"
                    :data="item"
                    />
                     <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex"
                        :page-sizes="[5, 10, 15, 20]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
                <div v-if="flightList.length === 0" style="padding:50px; text-align:center">
                    暂无航班信息
                </div>
            </div>

            <!-- 侧边栏 -->
            <div class="aside">
                <!-- 侧边栏组件 -->
                <FlightsAside/>
            </div>
        </el-row>
    </section>
</template>

<script>

import Airhead from '@/components/air/airhead'
import Airfilter from '@/components/air/airfilter'
import Airlist from '@/components/air/airlist'
import FlightsAside from '@/components/air/flightsAside'
import { async } from 'q'

export default {
    data(){
        return {
            flightDatas:{
                flights:[],
                options:{},
                info:{}
            },
            // 再复制一份数据出来
            dataList:{
                flights:[],
                options:{},
                info:{}
            },
            pageIndex:1,
            pageSize:5,
            total:0,
            fullscreenLoading:false,
            isShow:false,
        }
    },
    components:{
        Airhead,
        Airfilter,
        Airlist,
        FlightsAside
    },
    methods:{
        handleSizeChange(val){
            this.pageSize = val;
        },
        handleCurrentChange(val){
           this.pageIndex = val;
        },
        setDataList(val){
            // 筛选后直接存数据
            this.flightDatas.flights = val;
            this.total = val.length;
        },
        init(){
            this.$axios({
            url:"/airs",
            params:this.$route.query
            }).then(res=>{
                // 因为要避免dataList与flightDatas同时指向同一个内存地址，因为对象是一个复杂数据类型，内存地址是一致的，要复制一份出来
                this.dataList = {...res.data};
                this.flightDatas = res.data;
                // 总条数也要跟着筛选发生变化
                this.total = this.flightDatas.total;
                const arr = this.flightDatas.options.flightTimes.map(v=>{
                        if(v.from<10){
                            v.from = `0`+v.from
                        }else{
                            v.from = v.from
                        }
                        if(v.to<10){
                            v.to = `0`+v.to
                        }else{
                            v.to = v.to
                        }
                        return v;
                    })
                    this.flightDatas.options.flightTimes = arr
                    this.dataList.options.flightTimes = arr
                    if (this.flightDatas.length !=0) {
                        // 整屏幕加载的消除
                        this.$loading().close({fullscreen: false})
                    }
            })
        }
    },
    computed:{
        flightList(){
            // computed属性 是里面所运用到的所有东西有所变化都会触发到这一个函数的
            return  this.flightDatas.flights.slice(
                        (this.pageIndex-1) * this.pageSize
                        ,this.pageIndex * this.pageSize
                        )
        },
    },
    watch:{
         $route(){
             this.$loading({ fullscreen: true })
            this.init()
        }
    },
     mounted(){
        this.$loading({ fullscreen: true })
        this.init()
    }
}
</script>

<style scoped lang="less">
    .contianer{
        width:1000px;
        margin:20px auto;
    }

    .flights-content{
        width:745px;
        font-size:14px;
    }

    .aside{
        width:240px;
    } 
</style>