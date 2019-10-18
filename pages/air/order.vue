<template>
    <div class="container">
        <el-row type="flex" justify="space-between">
            <!-- 订单表单 -->
            <div class="main">
                <OrderForm @getAlldata="getAlldata" @getAllprice="getAllprice"/>
            </div>

            <!-- 侧边栏 -->
            <div class="aside">
                   <OrderAside :data="allData" :allprice="allprice"/>       
            </div>
        </el-row>
    </div>
</template>

<script>
import OrderForm from '@/components/air/orderForm'
import OrderAside from '@/components/air/orderAside'
export default {
    components:{
        OrderForm,
        OrderAside
    },
    data(){
        return {
            allData:{
                seat_infos:{}
            },
            allprice:0
        }
    },
    methods:{
        getAlldata(data){
            this.allData = data;
        },
        getAllprice(Allprice){
            this.allprice = Allprice
        }
    }
}
</script>

<style lang="less" scoped>
    .container{
        width:1000px;
        margin:20px auto;
    }
    
    /*aside*/
    .aside{
        width: 350px;
        height: fit-content;
        border:1px #ddd solid;
    }
</style>