<template>
    <section class="contianer">
        <el-row  type="flex" justify="space-between">

            <!-- 顶部过滤列表 -->
            <div class="flights-content">
                <!-- 过滤条件 -->
                <div>
                   <Airfilter/>
                </div>
                
                <!-- 航班头部布局 -->
                <div>
                     <Airhead/>
                </div>
                
                
                <!-- 航班信息 要循环的是组件-->
                <div>
                    <Airlist v-for="(item,index) in flightList"
                    :data="item"/>
                     <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex"
                        :page-sizes="[5, 10, 15, 20]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="flightDatas.total">
                    </el-pagination>
                </div>
            </div>

            <!-- 侧边栏 -->
            <div class="aside">
                <!-- 侧边栏组件 -->
            </div>
        </el-row>
    </section>
</template>

<script>

import Airhead from '@/components/air/airhead'
import Airfilter from '@/components/air/airfilter'
import Airlist from '@/components/air/airlist'

export default {
    data(){
        return {
            flightDatas:{
                flights:[]
            },
            pageIndex:1,
            pageSize:5,
        }
    },
    components:{
        Airhead,
        Airfilter,
        Airlist
    },
    computed:{
        flightList(){
            // computed属性 是里面所运用到的所有东西有所变化都会触发到这一个函数的
            return  this.flightDatas.flights.slice(
                        (this.pageIndex-1) * this.pageSize
                        ,this.pageIndex * this.pageSize
                        )
        }
    },
    mounted(){
        this.$axios({
            url:"/airs",
            params:this.$route.query
        }).then(res=>{
            this.flightDatas = res.data;
        })

    },
    methods:{
        handleSizeChange(val){
            this.pageSize = val;
        },
        handleCurrentChange(val){
           this.pageIndex = val;
        }
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