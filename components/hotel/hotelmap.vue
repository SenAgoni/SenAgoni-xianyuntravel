<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script>
export default {
  props: {
    hotelDetails: {
      type: Array,
      default: [],
    }
  },
  methods: {
    init() {
      setTimeout(() => {
        window.onLoad = () => {
          var markerlist = [];
          var map = new AMap.Map('container', {
            zoom: 10,
            center: [this.hotelDetails[1].location.longitude, this.hotelDetails[1].location.latitude],
          });
          this.hotelDetails.forEach((v, index) => {
            if (v.location.longitude && v.location.latitude) {
              var marker = new AMap.Marker({
                content:
                  "<span class='marker' data-id='B0019098VX'>" +
                  (index + 1) +
                  "</span>",
                position: new AMap.LngLat(v.location.longitude, v.location.latitude),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                title: v.name
              });
              markerlist.push(marker)
            }
          })
          map.add(markerlist);
        }
        var url = 'https://webapi.amap.com/maps?v=1.4.15&key=39aefaadb780c5b0a42a6600125ea500&callback=onLoad';
        var jsapi = document.createElement('script');
        jsapi.charset = 'utf-8';
        jsapi.src = url;
        document.head.appendChild(jsapi);
      }, 500);
    }
  },
  watch: {
    hotelDetails() {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style scoped lang="less">
/deep/.marker {
  display: inline-block;
  width: 22px;
  height: 36px;
  background-image: url(https://webapi.amap.com/theme/v1.3/markers/b/mark_r.png);
  background-size: 22px 36px;
  text-align: center;
  line-height: 24px;
  color: #fff;
}
#container {
  width: 90%;
  height: 280px;
}
/deep/ .amap-icon img,
/deep/ .amap-marker-content img {
  width: 25px;
  height: 34px;
}
</style>