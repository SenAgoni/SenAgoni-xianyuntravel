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
                <el-select size="mini" v-model="filter.airport" placeholder="起飞机场">
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
                <el-select size="mini" v-model="filter.flightTimes"  placeholder="起飞时间">
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
                <el-select size="mini" v-model="filter.company"  placeholder="航空公司">
                    <el-option
                    v-for="(item,index) in dataAir.company"
                    :key="index"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select size="mini" v-model="filter.airSize" placeholder="机型">
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
            filter:{
                airport: "",        // 机场
                flightTimes: "",    // 出发时间
                company: "",        // 航空公司
                airSize: "",        // 机型大小
            },
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
    watch:{
        filter:{
            deep:true,
            handler(){
               var arr = this.data.flights.filter(v=>{
                     // filter 过滤后的是一个符合条件的出去
                     let valid = true;
                     if(this.filter.airport &&　v.org_airport_name !== this.filter.airport){
                         valid = false;
                     }
                    //  判断时间
                     if(this.filter.flightTimes){
                        //  这是要选中的时间的开始时间
                        let start = +this.filter.flightTimes.split(",")[0];
                        let end = +this.filter.flightTimes.split(",")[1];
                        let dep = +v.dep_time.split(":")[0];
                        if(start > dep || end<=dep){
                            valid = false;
                        }
                     }
                     if(this.filter.company &&　v.airline_name !== this.filter.company){
                         valid = false;
                     }
                     if(this.filter.airSize &&　v.plane_size !== this.filter.airSize){
                         valid = false;
                     }
                     return valid;
                })
                this.$emit('setDataList',arr)
            }
        }
    },
    methods: {
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