<template>
  <div
    class="containers"
    style="margin:20px 0"
  >
    <div class="menu">
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
      >价格
        <span>{{price[0]}}-{{price[1]}}</span>
      </el-row>
      <el-slider
        v-model="value"
        @input="handlepriceChange"
        :format-tooltip="formatTooltip"
      ></el-slider>
    </div>

    <div class="menu">
      <p>住宿等级</p>
      <el-select
        v-model="from.levels"
        multiple
        placeholder="不限"
      >
        <el-option
          v-for="(item,index) in hotels.levels"
          :key="index"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>

    <div class="menu">
      <p>住宿类型</p>
      <el-select
        v-model="from.types"
        multiple
        placeholder="不限"
      >
        <el-option
          v-for="(item,index) in hotels.types"
          :key="index"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>

    <div class="menu">
      <p>酒店设施</p>
      <el-select
        v-model="from.assets"
        multiple
        placeholder="不限"
      >
        <el-option
          v-for="(item,index) in hotels.assets"
          :key="index"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>

    <div class="menu">
      <p>酒店品牌</p>
      <el-select
        v-model="from.brands"
        multiple
        placeholder="不限"
      >
        <el-option
          v-for="(item,index) in hotels.brands"
          :key="index"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: "",
      value: 4000,
      price: [0, 4000],
      hotels: [],
      from: {
        levels: [],
        types: [],
        assets: [],
        brands: [],
        arrPrice: [],
      }
    }
  },
  props: {
    filterData: {
      type: Array,
      default: [],
    }
  },
  watch: {
    from: {
      deep: true,
      handler() {
        // 如果这个对象中的有东西有所变化就会触发这一个方法  条件不一样就要传送不一样的参数
        var str = "/hotels?";
        if (this.from.levels.length > 0) {
          this.from.levels.forEach((v) => {
            str += 'hotellevel_in=' + v + '&';
          })
        }
        if (this.from.types.length > 0) {
          this.from.types.forEach((v) => {
            str += 'hoteltype_in=' + v + '&';
          })
        }
        if (this.from.assets.length > 0) {
          this.from.types.forEach((v) => {
            str += 'hotelasset_in=' + v + '&';
          })
        }
        if (this.from.brands.length > 0) {
          this.from.brands.forEach((v) => {
            str += 'hotelbrand_in=' + v + '&';
          })
        }
        if (this.from.arrPrice.length > 0) {
          str += 'price_lt=' + this.from.arrPrice[1] + '&';
        }
        // 调用父组件的方法把数据传过去 filter是一个关键字所以不能使用这一个方法
        this.$emit('filterData', str);
      }
    }
  },
  mounted() {
    // 这是过滤条件的请求
    this.$axios({
      url: "/hotels/options"
    }).then(res => {      ;
      this.hotels = res.data.data;
    })
  },
  methods: {
    formatTooltip(val) {
      return val / 0.025;
    },
    handlepriceChange(val) {
      this.price[1] = val / 0.025;
      // 调用父组件传送过来的方法,把价格区间传送过去，就是相当于是一个数组
      this.from.arrPrice = [0, val / 0.025]
    },
  }
}
</script>

<style scoped lang="less">
/deep/ .el-input__inner {
  border: 0;
}
.containers {
  display: flex;
  justify-content: space-between;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 15px;
}
.menu {
  width: 18%;
  line-height: 2;
  margin-right: 5px;
  padding: 0 10px;
  border-right: 1px solid #ddd;
  &:last-child {
    border-right: 0;
  }
}
.el-dropdown-link {
  cursor: pointer;
}
.el-dropdown-menu__item {
  padding: 0 70px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>