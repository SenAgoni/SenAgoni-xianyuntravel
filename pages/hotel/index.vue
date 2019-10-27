<template>
    <div class="container" style="width:1100px;">
       <div>酒店>{{cityInfo[0].name}}酒店预订</div>
      <el-row type="flex" justify="space-between" style="margin-bottom:10px">
          <el-col :span="6">
              <el-autocomplete
                class="inline-input"
                v-model="state"
                placeholder="请输入内容"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                 @select="handleSelect"
              ></el-autocomplete>
          </el-col>


          <!-- 选择则日期版块 -->
            <el-date-picker
            :span="8"
              v-model="value"
              type="daterange"
               format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="选择进店日期"
              end-placeholder="选择离店日期">
            </el-date-picker>
            <!-- 酒店人数 -->
           <el-col :span="6">
               <el-popover
                style="width:600px;left:738px"
                placement="bottom-start"
                width="238"
                trigger="click">
                <el-row style="width:238px" type="flex" justify="space-around">
                    <el-col :span="6">
                      <span>每间</span>
                    </el-col>
                        
                        <el-col :span="6">
                          <el-select v-model="adult" placeholder="成人">
                            <el-option
                                v-for="(item,index) in 5"
                                :key="index"
                                :value="item+'成人'"
                                :label="(index+1)"
                                >
                            </el-option>
                        </el-select>
                        </el-col>

                        <el-col :span="6">
                            <el-select v-model="children" placeholder="儿童">
                              <el-option
                                  v-for="(item,index) in 5"
                                  :key="index"
                                  :value="item+'儿童'"
                                  :label="(index+1)"
                                  >
                              </el-option>
                          </el-select>
                    </el-col>
                </el-row>
                <el-divider></el-divider>
                    <el-button style="float:right" type="primary" @click="handlePeople">确定</el-button>
                <el-button slot="reference" style="position:relative"><el-input :value="people" placeholder="人数未定"></el-input><i class="el-icon-user userAvatar"></i></el-button>
              </el-popover>
           </el-col>
           <!-- 搜索酒店 -->
             <el-button type="primary" @click="handleSearch" style="padding:10px 15px" :sapn="4">点击搜索酒店</el-button>
      </el-row>
      <!-- 地图组件 -->
      <el-row class="map-right">
        <el-col :span="12">
          <span>区域</span>:
            <el-link>全部</el-link> <span class="span"></span>
            <span class="text-hidden">
              <el-link @click="handleColor(index)" :class="{active: isAdd===index }"
               v-for="(item,index) in cityInfo[0].scenics"
               v-if="index>isShow?false:true"
                :key="index">
                {{item.name}}
              </el-link>
            </span>
            <el-link 
              class="btn-more" 
               id="J_btnmore"
               @click="handleIsshow" 
              > <i data-v-d0475a26="" class="el-icon-d-arrow-right" style="color:#ff9f6b"></i>等等{{cityInfo[0].scenics.length}}个区域
            </el-link>
          <el-col class="gonglue">
           <span> 攻略</span>
           ：北京，你想要的都能在这找到。博古通今，兼容并蓄
            ，天下一城，如是帝都。 景点以故宫为中心向四处辐射；地铁便宜通畅，
            而且覆盖绝大多数景点。 由于早上有天安门升旗仪式，所以大多数人选择在天安门附近住宿。
          </el-col>
          <el-col style="margin-top:15px">
            均价
            <!-- 文字提示 -->
             <el-tooltip class="item" effect="dark" content="等级均价由平日价格计算得出，节假日价格会有上浮。" placement="top-end">
              <el-button><sup class="el-icon-question" style="color:#cccccc;ss"></sup></el-button>
            </el-tooltip>
            :
              <el-tooltip class="item" effect="dark" content="等级均价由平日价格计算得出，节假日价格会有上浮。" placement="top-end">
                <el-button> <i :class="{lastJuli:i===2}" class="iconfont iconhuangguan" v-for="(e,i) in 3" :key="e"></i> ¥332</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="等级评定是针对房价，设施和服务等各方面水平的综合评估" placement="bottom-end">
                <el-button> <i :class="{lastJuli:i===3}" class="iconfont iconhuangguan" v-for="(e,i) in 4" :key="e"></i>¥521</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="等级评定是针对房价，设施和服务等各方面水平的综合评估。" placement="top-end">
                <el-button> <i :class="{lastJuli:i===4}" class="iconfont iconhuangguan" v-for="(e,i) in 5" :key="e"></i>¥768</el-button>
              </el-tooltip>
          </el-col>
        </el-col>
        <!-- 地图组件 -->
        <el-col :span="12">
            <HotelMap :hotelDetails="hotelDetails"/>
        </el-col>
      </el-row>
      <!-- 过滤条件部分 -->
      <HoteFilter @filterData="handleFilter" :filterData="hotelDetails"/>
      <!-- 酒店详情部分 -->
          <HoteDetail v-for="(item,index) in hotelDetails" :key="index" :item="item"/>
        <!-- 分页功能 -->
      <el-row type="flex" justify="end" style="margin-bottom:10px">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>
      </el-row>
      <a href="javascript:;" id="btn" title="回到顶部" class="el-icon-caret-top"></a>
    </div>
</template>

<script>
import HotelMap from '@/components/hotel/hotelmap';
import HoteFilter from '@/components/hotel/hotelfilter';
import HoteDetail from '@/components/hotel/hoteldetail';
import {Scrollevent} from "@/untils/Scroll.js"
export default {
  data(){
    return {
      value: '',
      state:'',
      cityInfo:[
        {
          scenics:[],
        },
      ],
      isAdd:false,
      isShow:11,
      iscityAdd:true,
      hotelDetails:[],
      CopyhotelDetails:[],
      adult:'',
      children:'',
      peopleNum:0,
      pageIndex:1,
      pageSize:5,
      total:0,
      people:'',
    }
  },
  components:{
     HotelMap,
     HoteFilter,
     HoteDetail
  },
  mounted(){
    // 这里是默认的是当前用户所在的地址
   this.$axios({
      url:"/cities?name="+this.$route.query.city
    }).then(res=>{
        const {data} = res.data;
        this.cityInfo = data;
        this.state = this.cityInfo[0].name;
        // 再发送一次请求
        this.init()
    })
    return Scrollevent();
  },
  methods:{
    init(){
      this.$axios({
            url:"/hotels",
            params:{
              city:this.cityInfo[0].id,
              _limit:this.pageSize,
              _start:this.pageIndex,
            }
        }).then(res=>{
            this.hotelDetails = res.data.data;
            this.total = res.data.total;
            this.CopyhotelDetails = [...this.hotelDetails]
        })
    },
    querySearch(val, cb) {
        this.$axios({
          url:"/cities?name=" + val
        }).then(res=>{
            const {data} = res.data;
            // 过滤获取到的数据 然后就生成一个新的数组，符合关键字的数组。然后传送回去显示到页面
           data.map(v=>{
                v["value"] = v.name.split("").reverse().join("").substr(1).split("").reverse().join("");
            })
            cb(data);
        })
      },
      handleSelect(val){
        this.handleSearch();
      },
      handleColor(index){
          // 只给当前这一个添加这一个样式
          this.isAdd = index;
      },
      handleIsshow(){
        if(this.iscityAdd){
          this.isShow = this.cityInfo[0].scenics.length;
        }else{
          this.isShow = 11;
        }
        this.iscityAdd = !this.iscityAdd;
      },
      // 显示人数
      handlePeople(){
        this.people = this.adult+this.children
      },
      // 搜索城市酒店的事件
      handleSearch(){
        this.$axios({
          url:"/cities?name="+this.state
        }).then(res=>{
          const {data} = res.data;
          this.cityInfo = data;
          this.state = this.cityInfo[0].name;
            this.init()
        })
      },
      handleSizeChange(val){
          // 然后就给变分页的值
          this.pageSize = val;
          this.init();
      },
      handleCurrentChange(val){
          this.pageIndex = val;
          this.init()
      },
      // 在首页限制传送过去渲染的数据 过滤的方法
      handleFilter(str){
        // 可以在这里根据传过来的参数不一样来发送请求
        str += 'city='+this.cityInfo[0].id;
        this.$axios({
          url:str,
        }).then(res=>{
          const {data} = res.data;
          // 先复制一份原有的数据,然后改变的是要渲染的数据
          this.hotelDetails = data;
        })
      }
  }
}
</script>

<style scoped lang="less">
 #btn {
    width: 50px;
    height: 50px;
    position: fixed;
    right: 25px;
    bottom: 104px;
    display: none;
    font-size: 20px;
    color: #1989fa;
    line-height: 50px;
    text-align: center;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    background-color: #f2f5f6;
    border-radius: 20%;
  }
  #btn:hover {
    background: #666;
  }
/deep/.el-input__suffix{
  right:-3px;
}
/deep/.el-popover{
  line-height:3.4;
}
/deep/.el-input__inner{
  padding-right:0;
}
  /deep/  .suerButton{
      width:30px;
      height:22px;
      text-align: center;
      line-height:22px;
      position: relative;
      padding:10px 20px;
      span{
        display: block;
        font-size:12px;
        position: absolute;
        top:0;
        left:0;
        width:20px;
        height:10px;
      }
    }
  .userAvatar{
    font-size:20px;
    color:#c0c4cc;
    position: absolute;
    top:7px;
    right:10px;
  }
.lastJuli{
  margin-right:10px;
}

.iconhuangguan {
    color: #f90;
}
  /deep/.el-button{
      padding:0;
      border:0;
  }
  .item:hover{
    background-color:0;
  }
  .item {
      margin: 4px;
    }
.gonglue{
  margin-top:20px;
}
.active{
  background-color: #ddd;
}
/deep/.el-link{
  margin-right:20px;
}
  .container{
    padding:0 150px;
  }
  .map-right{
    line-height: 1.8;
    color:#666666;
    font-size:15px;
    span{
      margin-right:20px;
      letter-spacing: 0em;
       font-size:16px;
    }
  }
</style>