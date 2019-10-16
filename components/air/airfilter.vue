<template>
    <div class="filters">
        <el-row type="flex" class="filters-top" justify="space-between" align="middle">
            <el-col :span="8">
                单程： 
                {{data.info.departCity}} - {{data.info.destCity}}
                / 
                {{data.info.departDate}}
            </el-col>
            <el-col :span="4">
                <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
                    <el-option
                    v-for="(item,index) in dataAir.airport"
                    :key="index"
                    :label="item"
                    :value="item"
                    >
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select size="mini" v-model="flightTimes"  placeholder="起飞时间" @change="handleFlightTimes">
                    <el-option
                    v-for="(item,index) in dataAir.flightTimes"
                    :key="index"
                    :label="item.from+`:00 -`+item.to +`:00`"
                    :value="item.from+`,`+item.to"
                    >
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select size="mini" v-model="company"  placeholder="航空公司" @change="handleCompany">
                    <el-option
                    v-for="(item,index) in dataAir.company"
                    :key="index"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
                    <el-option
                    v-for="(item,index) in setOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <div class="filter-cancel">
            筛选：
            <el-button 
                       type="primary" 
                       round 
                       plain 
                       size="mini" 
                       @click="handleFiltersCancel">
                撤销
    		</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            airport: "",        // 机场
            flightTimes: "",    // 出发时间
            company: "",        // 航空公司
            airSize: "",        // 机型大小
            setOptions:[
                {name:"大",value:"L"},
                {name:"中",value:"M"},
                {name:"小",value:"S"},
            ],
        }
    },
    // 这需要改成对象
    props:{
        dataAir:{
            type:Object,
            default:{}
        },
        data:{
            type:Object,
            default:{}
        }
    },
    methods: {
        // 选择机场时候触发
        handleAirport(value){
           const arr = this.data.flights.filter(v=>{
               return  v.org_airport_name === value;
            })
            // 然后通过事件传值，把事件传到父组件中
            this.$emit('setDataList',arr)
        },

        // 选择出发时间时候触发
        handleFlightTimes(value){
            // 分割字符串，然后会得到一个数组
           const arr = value.split(",");
            // 如果飞机的起飞时间大于或等于开始时间并且小于结束时间的话就会是在同一个时间段的
            const arrTime = this.data.flights.filter(v=>{
                const start = +(v.dep_time.split(":")[0]);
                return  start >= +arr[0] && start < +arr[1];
            })
            this.$emit('setDataList',arrTime);
        },

         // 选择航空公司时候触发
        handleCompany(value){
            const arr = this.data.flights.filter(v=>{
               return  v.airline_name === value;
            })
            // 然后通过事件传值，把事件传到父组件中
            this.$emit('setDataList',arr)
        },

         // 选择机型时候触发
        handleAirSize(value){
           const arr = this.data.flights.filter(v=>{
               return  v.plane_size === value;
            })
            // 然后通过事件传值，把事件传到父组件中
            this.$emit('setDataList',arr)
        },
        
        // 撤销条件时候触发
        handleFiltersCancel(){
            this.airport = "";
            this.flightTimes = "";
            this.company = "";
            this.airSize = "";
            this.$emit('setDataList',this.data.flights)
        },
    }
}
</script>

<style scoped lang="less">
    .filters{
        margin-bottom:20px;
    }

    .filters-top{
        > div{
            /deep/ .el-select{
                margin-left:10px;
            }
        }
    }

    .filter-cancel{
        margin-top:10px;
    }
</style>