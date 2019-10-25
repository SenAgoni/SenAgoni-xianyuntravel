<template>
  <div class="container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/hotel?city=广州'}">酒店预订</el-breadcrumb-item>
      <el-breadcrumb-item>{{hotelData.name}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 标题信息 -->
    <el-row class="name-info">
      <el-col class="el-col-24">
        <el-row>
          <h4 class="hotel-cn-name">
            {{hotelData.name}}
            <span v-if="hotelData.hotellevel" :title="`${hotelData.hotellevel.level}星级`">
              <i
                class="iconfont iconhuangguan"
                v-if="hotelData.hotellevel"
                v-for="(item) in hotelData.hotellevel.level"
                :key="item"
              ></i>
            </span>
          </h4>
        </el-row>
        <el-row>
          <span class="hotel-en-name">{{hotelData.alias}}</span>
        </el-row>
        <el-row class="location">
          <i class="iconfont iconlocation"></i>
          {{hotelData.address}}
        </el-row>
      </el-col>
    </el-row>

    <!-- 酒店图片 -->
    <el-row class="hotel-pic">
      <el-col :span="16" class="big-pic">
        <i>
          <img :src="imgs[img].src" alt />
        </i>
      </el-col>
      <el-col :span="8" class="small-pic">
        <el-row>
          <el-col :span="12" v-for="(item,index) in imgs" :key="index">
            <i @click="changeImg(index)">
              <!-- <img :src="$axios.defaults.baseURL+item.url" alt /> -->
              <img :src="item.src" alt />
            </i>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 价格等信息 -->
    <el-table
      :data="hotelData.products"
      style="width: 100%"
      class="price"
      @row-click="See(`https://hotels.ctrip.com/hotel/694679.html`)"
    >
      <el-table-column prop="name" label="价格来源" width="360"></el-table-column>
      <el-table-column prop="bestType" label="低价房型" width="360"></el-table-column>
      <el-table-column prop="price" label="最低价格/每晚">
        <template slot-scope="scope" class="height-light">
          <span class="height-light">￥{{scope.row.price}}</span>
          起
          <i class="el-icon-arrow-right height-light"></i>
        </template>
      </el-table-column>
    </el-table>

    <!-- 地图&周边 -->
    <Map :position="hotelData.location" />

    <!-- 酒店基本信息 -->
    <div class="hotel-info">
      <el-row class="base-info">
        <el-col :span="4">基本信息</el-col>
        <el-col :span="20">
          <span v-if="hotelData.enterTime !== 'null'">入住时间: {{hotelData.enterTime}}之后</span>
          <span v-if="hotelData.leftTime !=='null'">离店时间: {{hotelData.leftTime}}之前</span>
          <span
            v-if="!hotelData.lastBuildTime && !hotelData.renovat_time"
          >{{hotelData.lastBuildTime}}/{{hotelData.renovat_time}}</span>
          <span
           v-else
          >{{hotelData.lastBuildTime}}{{hotelData.renovat_time}}</span>
          <span v-if="hotelData.roomCount">酒店规模: {{hotelData.roomCount}}间客房</span>
        </el-col>
      </el-row>
      <el-row class="assets">
        <el-col :span="4">主要设施</el-col>
        <el-col :span="20">
          <span class="asset" v-for="(item,index) in hotelData.hotelassets" :key="index">{{item}}</span>
          <i v-if="hotelData.hotelassets.length == 0">-</i>
        </el-col>
      </el-row>
      <el-row class="paking">
        <el-col :span="4">停车服务</el-col>
        <el-col :span="20">{{hotelData.paking?hotelData.paking:'-'}}</el-col>
      </el-row>
      <el-row class="brance">
        <el-col :span="4">品牌信息</el-col>
        <el-col :span="20">{{hotelData.hotelbrand?hotelData.hotelbrand.name:'-'}}</el-col>
      </el-row>
    </div>

    <!-- 评论 -->
    <div class="comment">
      <h3>{{total}} 条真实用户评论</h3>
      <el-row type="flex">
        <el-col :span="4" class="remark">
          <p>总评数: {{hotelData.all_remarks}}</p>
          <p>好评数: {{hotelData.very_good_remarks}}</p>
          <p>差评数: {{hotelData.very_bad_remarks}}</p>
        </el-col>
        <el-col :span="5" class="score">
          <div class="stars">
            <span>
              <i
                class="el-rate__icon el-icon-star-on star"
                :class="{heightLight:index < hotelData.stars}"
                v-for="index in 5"
                :key="index"
              >
                <i
                  class="el-rate__icon el-icon-star-on banStar heightLight"
                  v-if="Math.ceil(hotelData.stars) == index"
                ></i>
              </i>
            </span>
            <span class="height-light">{{hotelData.stars}}分</span>
          </div>
          <div class="recommend" v-if="hotelData.stars >= 3">推荐</div>
        </el-col>
        <!-- <el-col :span="3" class="circle">
          <el-progress type="circle" :percentage="hotelData.environment?hotelData.environment:0" :width="70" :stroke-width="2" color="#f90" :format="format">
            <span>环境</span>
            <span>7</span>
          </el-progress>
        </el-col>-->
        <el-col :span="3" class="dashboard">
          <el-progress
            type="dashboard"
            :percentage="hotelData.environment"
            :width="70"
            :stroke-width="4"
            color="#f90"
            :format="format"
          ></el-progress>
          <p class="height-light">环境</p>
        </el-col>
        <el-col :span="3" class="dashboard">
          <el-progress
            type="dashboard"
            :percentage="hotelData.product"
            :width="70"
            :stroke-width="4"
            color="#f90"
            :format="format"
          ></el-progress>
          <p class="height-light">产品</p>
        </el-col>
        <el-col :span="3" class="dashboard">
          <el-progress
            type="dashboard"
            :percentage="hotelData.service"
            :width="70"
            :stroke-width="4"
            color="#f90"
            :format="format"
          ></el-progress>
          <p class="height-light">服务</p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Map from "@/components/hotel/map.vue";
export default {
  components: {
    Map
  },
  mounted() {
    this.getHotelData();
    // this.format();
  },
  data() {
    return {
      hotelData: {
        hotellevel: {
          level: 0
        },
        hotelassets: [],
        scores: {}
      },
      total: 0,
      nextStart: 0,
      imgs: [
        { src: require("@/static/image/1.jpg") },
        { src: require("@/static/image/2.jpg") },
        { src: require("@/static/image/3.jpg") },
        { src: require("@/static/image/4.jpg") },
        { src: require("@/static/image/5.jpg") },
        { src: require("@/static/image/6.jpg") }
      ],
      img: 0
    };
  },
  methods: {
    getHotelData() {
      this.$axios({
        url: "/hotels?id=" + this.$route.query.id
      }).then(res => {
        this.hotelData = res.data.data[0];
        this.total = res.data.total;
        this.nextStart = res.data.nextStart;
      });
    },
    //更改环形进度条中的文字
    format(percentage) {
      return percentage + "分";
    },

    See(e) {
      window.open(e);
    },

    //点击图片显示大图
    changeImg(i) {
      this.img = i;
    }
  }
};
</script>

<style scoped lang="less">
//主色调

.heightLight {
  color: #f90;
}

.height-light {
  color: #f90;
}
.container {
  width: 1000px;
  margin: 0 auto;
}

//面包屑导航样式
.el-breadcrumb {
  margin: 16px 0;
  font-family: "楷体", "simsun";
  font-size: 16px;
  font-weight: 700;

  .el-breadcrumb__inner.is-link {
    color: #007acc;
  }

  // .is-link {
  //   color: #007acc;
  // }
}

//标题信息
.name-info {
  color: #666;
  word-spacing: 1px;
  font-size: 14px;
  margin: 20px 0;

  h4 {
    color: #333;
    font-weight: 400;
    font-size: x-large;

    .iconhuangguan {
      color: #f90;
    }
  }
  .location {
    margin-top: 5px;
  }
}

//酒店内图片
.hotel-pic {
  img {
    display: block;
  }

  .big-pic {
    img {
      width: 640px;
      height: 360px;
    }
  }

  .small-pic {
    .el-col {
      padding: 0 15px 12px 0;

      img {
        width: 160px;
      }
    }
  }
}

//价格等信息
.price {
  .height-light {
    color: #f90;
    font-size: larger;
  }
}

// 酒店信息
.hotel-info {
  .base-info {
    span {
      color: #666;
      padding-right: 20px;
    }
  }

  .assets {
    span {
      border: 1px solid #eee;
      padding: 4px 10px;
      margin-right: 10px;
      border-radius: 4px;
      background-color: #eee;
      color: #666;
    }
  }
  .el-row {
    margin-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
    padding: 20px 10px;
    font-size: 14px;
  }
}

//评论
.comment {
  margin: 20px 0;

  h3 {
    margin-bottom: 20px;
  }

  .remark {
    margin-top: 10px;
    p {
      color: #666;
      font-size: 16px;
    }
  }

  .score {
    position: relative;

    .stars {
      margin-top: 30px;
      font-size: 16px;

      /deep/ .el-rate__icon {
        font-size: 20px;
      }
      .star {
        position: relative;

        .banStar {
          position: absolute;
          left: 0;
          width: 50%;
          overflow: hidden;
        }
      }
    }

    .recommend {
      position: absolute;
      margin-top: -40px;
      left: 24px;
      border: 2px solid #fa3;
      text-align: center;
      line-height: 70px;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      opacity: 0.25;
      color: #fa3;
      font-size: 20px;
      transform: rotate(-30deg);
    }
  }

  .dashboard {
    /deep/ .el-progress__text {
      color: #f90;
      font-size: 16px !important;
    }
    p {
      font-size: 16px;
      margin-left: 20px;
    }
  }
}
</style>