<template>
  <!-- 地图周边 -->
  <div class="map">
    <div id="container"></div>
    <el-tabs
      v-model="activeTabName"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        label="风景"
        name="sights"
      >
        <span
          v-for="(item,index) in aroundData"
          :key="index"
          ref="content"
        >
          <i
            class="title"
            :data-location="item.location"
          >{{item.name}}</i>
          <i class="distance">{{(item.distance/1000).toFixed(3)}}公里</i>
        </span>
      </el-tab-pane>
      <el-tab-pane
        label="交通"
        name="traffic"
      >
        <span
          v-for="(item,index) in aroundTraffic"
          :key="index"
          ref="content"
        >
          <i
            class="title"
            :data-location="item.location"
          >{{item.name}}</i>
          <i class="distance">{{(item.distance/1000).toFixed(3)}}公里</i>
        </span>
      </el-tab-pane>
    </el-tabs>
    <ul id="my-list"></ul>
  </div>
</template>

<script>
import { reject } from "q";
export default {
  mounted() {
    this.showMap();
  },

  props: {
    position: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      activeTabName: "sights",
      mapIcon: {},
      aroundData: [{ location: "" }],
      aroundTraffic: [{ location: "" }],
      map: null,
      globalMarkers: []
    };
  },

  methods: {
    //获取城市周边数据
    showMap() {
      setTimeout(() => {
        this.$axios({
          method: "GET",
          url: `https://restapi.amap.com/v3/place/around?key=f3c02a28a5581de8b4293021ad1ec471&location=${this.position.longitude},${this.position.latitude}&radius=10000&types=110000&offset=10`
        }).then(res => {
          this.$axios({
            method: "GET",
            url: `https://restapi.amap.com/v3/place/around?key=f3c02a28a5581de8b4293021ad1ec471&location=${this.position.longitude},${this.position.latitude}&radius=10000&types=150000&offset=10`
          }).then(res => {
            if (res.data.status == 1) {
              this.aroundTraffic = res.data.pois;
            }
          });

          if (res.data.status == 1) {
            this.aroundData = res.data.pois;
            window.onLoad = () => {
              let map = new AMap.Map("container", {
                center: [this.position.longitude, this.position.latitude], //中心点坐标118.8718107,31.32846821
                zoom: 14
              });
              AMap.plugin("AMap.ToolBar", function () {
                //异步加载插件
                var toolbar = new AMap.ToolBar();
                map.addControl(toolbar);
              });

              this.map = map;

              // 当前位置的marker
              var marker = new AMap.Marker({
                position: new AMap.LngLat(
                  this.position.longitude,
                  this.position.latitude
                ), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                title: "当前位置",
                content: "<span class='marker' data-id='B0019098VX'>¤</span>"
              });

              map.add(marker);
              let obj = {
                lng: this.position.longitude,
                lat: this.position.latitude,
                P: this.position.latitude,
                Q: this.position.longitude
              };
              AMap.event.addListener(marker, "mouseover", () => {
                this.showTitle(obj, "当前位置");
              });

              AMap.event.addListener(marker, "click", e => {
                this.map.setZoomAndCenter(16, [
                  this.position.longitude,
                  this.position.latitude
                ]);
              });

              this.editMap(map);

              map.setFitView();
            };

            // 引入高德地图api
            var url =
              "https://webapi.amap.com/maps?v=1.4.15&key=39aefaadb780c5b0a42a6600125ea500&callback=onLoad";
            var jsapi = document.createElement("script");
            jsapi.charset = "utf-8";
            jsapi.src = url;
            document.head.appendChild(jsapi);
          }
        });
      }, 1000);
    },

    //根据Tab的值获取周边数据
    getAroundSights(tabName) {
      if (tabName == "sights") {
        this.$axios({
          method: "GET",
          url: `https://restapi.amap.com/v3/place/around?key=f3c02a28a5581de8b4293021ad1ec471&location=${this.position.longitude},${this.position.latitude}&radius=10000&types=011100`
        }).then(res => {
          if (res.data.status == 1) {
            this.aroundData = res.data.pois;
          }
        });
      } else if (tabName == "traffic") {
        this.$axios({
          method: "GET",
          url: `https://restapi.amap.com/v3/place/around?key=f3c02a28a5581de8b4293021ad1ec471&location=${this.position.longitude},${this.position.latitude}&radius=10000&types=011100`
        }).then(res => {
          if (res.data.status == 1) {
            this.aroundData = res.data.pois;
          }
        });
      }
    },

    // tab栏切换
    handleTabClick(tab, event) {
      this.map.remove(this.globalMarkers);
      this.globalMarkers = [];

      if (this.activeTabName == "sights") {
        this.showMarker(this.aroundData);
      } else if (this.activeTabName == "traffic") {
        this.showMarker(this.aroundTraffic);
      }
    },

    editMap() {
      // 加载SimpleMarker
      this.showMarker(this.aroundData);

      // 鼠标悬浮右侧位置数据上时该位置移动到地图中心
      console.log(1111, this.$refs.content[18], this.$refs.content)
      setTimeout(() => {
        this.$refs.content.forEach((item,index) => {
          item.addEventListener("mouseover", e => {
            let log = e.target.dataset.location.split(",")[0];
            let lat = e.target.dataset.location.split(",")[1];
            if(index > 8){
              this.map.setZoomAndCenter(20, [log, lat]);
            }else{
               this.map.setZoomAndCenter(16, [log, lat]);
            }
           
            //显示title
            let obj = {
              lng: log,
              lat: lat,
              P: lat,
              Q: log
            };
            this.showTitle(obj, item.children[0].innerText);
          });
        });
      }, 500);
    },

    // 显示marker图标 data: 通过高德地图POI获取的地图数据(数组)
    showMarker(data) {
      data.forEach((item, index) => {
        let log = item.location.split(",")[0];
        let lat = item.location.split(",")[1];
        var marker = new AMap.Marker({
          position: new AMap.LngLat(log, lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: item.name,
          content:
            "<span class='marker' data-id='B0019098VX'>" +
            (index + 1) +
            "</span>"
        });
        this.globalMarkers.push(marker);

        this.map.add(marker);

        //悬浮在marker上显示title
        let obj = {
          lng: log,
          lat: lat,
          P: lat,
          Q: log
        };
        AMap.event.addListener(marker, "mouseover", () => {
          this.showTitle(obj, item.name);
        });
        // 点击图标移动该位置到地图中心
        AMap.event.addListener(marker, "click", e => {
          this.map.setZoomAndCenter(16, [log, lat]);
        });
      });
    },

    //悬浮在marker/数据上显示title
    // obj:位置经纬度let obj = {lng: log,lat: lat,P: lat, Q: log};
    //name:显示的title  origin:事件源
    showTitle(obj, name) {
      new AMap.InfoWindow({
        content: name,
        offset: new AMap.Pixel(2, -30),
        direction: "center"
      }).open(this.map, obj);
    }
  }
};
</script>

<style scoped lang="less">
//地图
.map {
  display: flex;
  margin: 36px 0;

  #container {
    width: 650px;
    height: 360px;
  }

  .el-tabs {
    flex: 1;
    margin-left: 20px;
    font-size: 14px;

    .el-tab-pane {
      height: 300px;
      overflow-y: scroll;
      span {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        font-size: 14px;
        color: #666;

        .title {
          margin-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis; //文本溢出显示省略号
          white-space: nowrap; //文本不会换行（单行文本溢出）
          width: 230px;
        }

        .distance {
          margin-right: 10px;
        }
      }
    }
  }
}

/deep/.marker {
  display: inline-block;
  width: 22px;
  height: 36px;
  background-image: url(https://webapi.amap.com/theme/v1.3/markers/b/mark_b.png);
  background-size: 22px 36px;
  text-align: center;
  line-height: 24px;
  color: #fff;
}

/deep/ .amap-icon img,
/deep/ .amap-marker-content img {
  width: 25px;
  height: 34px;
}

/deep/ .amap-marker-label {
  // border: 0;
  background-color: #fff;
}

//坐标点title
.info {
  position: relative;
  top: 0;
  right: 0;
  min-width: 0;
}

.hidden {
  position: relative;
  top: 0;
  right: 0;
  min-width: 0;
}
</style>