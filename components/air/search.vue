<template>
    <div class="search-form">

        <!-- 头部tab切换 -->
        <el-row type="flex" class="search-tab">
            <span v-for="(item, index) in tabs" :key="index"
            @click="handleSearchTab(item, index)"
            :class="{active: index === currentTab}">
                <i :class="item.icon"></i>{{item.name}}
            </span>
        </el-row>

        <el-form class="search-form-content" ref="form" label-width="80px">
            <el-form-item label="出发城市">
                <!-- fetch-suggestions 返回输入建议的方法 -->
                <!-- select 点击选中建议项时触发 -->
                <el-autocomplete
                :fetch-suggestions="queryDepartSearch"
                placeholder="请搜索出发城市"
                v-model="form.departCity"
                @select="handleSelect(`depart`)"
                @blur="handleBlur(`depart`)"
                class="el-autocomplete"
                ></el-autocomplete>
            </el-form-item>


            <el-form-item label="到达城市">
                <el-autocomplete
                :fetch-suggestions="queryDestSearch"
                v-model="form.destCity"
                placeholder="请搜索到达城市"
                @select="handleSelect(`dest`)"
                @blur="handleBlur(`dest`)"
                class="el-autocomplete"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="出发时间">
                <!-- change 用户确认选择日期时触发 -->
                <el-date-picker type="date" 
                placeholder="请选择日期" 
                v-model="form.departDate"
                style="width: 100%;"
                @change="handleDate">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="">
                <el-button style="width:100%;" 
                type="primary" 
                icon="el-icon-search"
                @click="handleSubmit">
                    搜索
                </el-button>
            </el-form-item>
            <div class="reverse">
                <span @click="handleReverse">换</span>
            </div>
        </el-form>  
      </div>
</template>

<script>
import moment from 'moment';
export default {
    data(){
        return {
            tabs: [
                {icon: "iconfont icondancheng", name: "单程"},
                {icon: "iconfont iconshuangxiang", name: "往返"}
            ],
            currentTab: 0,
            form:{
                departCity:"",
                departCode:"",
                destCity:"",
                destCode:"",
                departDate:""
            },
            cities:[],
        }
    },
    methods: {
        // tab切换时触发
        handleSearchTab(item, index){
            this.currentTab = index;
            if(index===1){
                this.$alert('目前还未提供双程机票', '提醒', {
                    confirmButtonText: '确定',
                    type: 'warning'
                });
                this.currentTab = 0;
            }
        },
        
        // 出发城市输入框获得焦点时触发
        // value 是选中的值，cb是回调函数，接收要展示的列表
        queryDepartSearch(value, cb){
            if(!value) {
                // 下面的搜索输入框是通过cb这一个回调函数来触发的，所以当我们给他返回一个空数组时，就不会触发了
                cb([]);
                return;
            }
            // 发送axios请求，获取与输入信息相关的城市信息 参数接在路由请求后面
            this.$axios({
                url:"/airs/city?name=" + value
            }).then(res=>{
                const {data} = res.data;
                // 遍历数组每一项添加一个value的值 map 方法是直接改变原有数组的,有返回值的话就会返回一个新数组
                data.map(v=>{
                   v["value"] = v.name.split("").reverse().join("").substr(1).split("").reverse().join("");
                })
                if(data.length===0){
                    // 如果后台返回的是没有数据则直接返回一个空数组，并且后续代码不执行
                    cb([]);
                    return;
                }
                this.cities = data;
                // 这里直接返回一个data也可以在网页中显示，但是，在发送请求时所需要的数据是页面中要能找到的这个数据用于下面的封装数据
                cb(data)
            })
        },

        // 目标城市输入框获得焦点时触发
        // value 是选中的值，cb是回调函数，接收要展示的列表
        queryDestSearch(value, cb){
           this.queryDepartSearch(value,cb);
        },
       
        // 出发城市下拉选择时触发
        handleSelect(type) {
            // 选择的时候把城市编码存到form对象中
            if(this.cities.length===0) return;
            this.form[type+"City"] = this.cities[0].value;
            this.form[type+"Code"] = this.cities[0].sort;
        },

        // 确认选择日期时触发
        handleDate(value){
           this.form.departDate = moment(value).format("YYYY-MM-DD");
        },
        // 离开焦点时触发
        handleBlur(type){
            this.handleSelect(type);
        },

        // 触发和目标城市切换时触发
        handleReverse(){
            // 因为每一个数据都是双向数据绑定，所以要先结构出来
            const {departCity,departCode,destCity,destCode} = this.form
            this.form.departCity = destCity;
            this.form.departCode = destCode;
            this.form.destCity = departCity;
            this.form.destCode = departCode;
        },

        // 提交表单是触发
        handleSubmit(){
            // 表单提交前要有一个验证
            var rules = {
                departCity:{message:"请输入出发城市",value:this.form.departCity},
                destCity:{message:"请输入到达城市",value:this.form.destCity},
                departDate:{message:"请输入出发日期",value:this.form.departDate},
            }
             // 把this.form数据存到history 也就是store 当中去
               this.$store.commit('air/setHistory',this.form)
            // 遍历对象，如果对象中的value的值是空的话就要阻止提交，并且警告用户
            Object.keys(rules).some(v=>{
                if(!rules[v].value){
                    this.$message.error(rules[v].message);
                    return true;
                }
                // 然后就要跳转页面
                this.$router.push({
                    path:"/air/flights",
                    query:this.form,
                })
            });
        },
    }
}
</script>

<style scoped lang="less">
.search-form{
    border:1px #ddd solid;
    border-top:none;
    width:360px;
    height:350px;
    box-sizing: border-box;
}

.search-tab{
  span{
    display: block;
    flex:1;
    text-align: center;
    height:48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top:3px #eee solid;
    background:#eee;
  }

  .active{
    border-top-color: orange;
    background:#fff;
  }

  i{
    margin-right:5px;
    font-size: 18px;

    &:first-child{
      font-size:16px;
    }
  }
}

.search-form-content{
  padding:15px 50px 15px 15px;
  position: relative;

  .el-autocomplete{
    width: 100%;
  }
}

.reverse{
  position:absolute;
  top: 35px;
  right:15px;

  &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:-35px;
      width:25px;
      height:1px;
      background:#ccc;
  }

  &:after{
      top:0;
    }

    &:before{
      top:60px;
    }

  span{
    display: block;
    position:absolute;
    top: 20px;
    right:0;
    font-size:12px;
    background: #999;
    color:#fff;
    width:20px;
    height:20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:10px;
      width:1px;
      height:20px;
      background:#ccc;
    }

    &:after{
      top:-20px;
    }

    &:before{
      top:20px;
    }
  }
}
</style>