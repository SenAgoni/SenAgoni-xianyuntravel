<template>
  <div class="cmt-floor">
    

    <div class="cmt-content">
<!-- 自调用部分 -->
    <commentsParent v-if="data.parent" @handlereply="handlereply" :data="data.parent" :now="now"/>
      <div class="cmt-info">

        <img :src="$axios.defaults.baseURL+`${data.account.defaultAvatar}`" />
        {{data.account.nickname}}
        <i>{{now}}</i>
        <span>{{data.level}}</span>
      </div>
      
      <p class="cmt-message">{{data.content}}</p>
      <div class="el-row el-row--flex">
        <div class="cmt-pic" v-if="data.pics.length !==0">
          <img :src="$axios.defaults.baseURL+`${data.pics[0].url}`" />
        </div>
      </div>

      <div class="cmt-ctrl">

        <a href="javascript:;" @click="handlereply">回复</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "commentsParent",
  props: {
    data: {
      type: Object,
      default: {}
    },
    now: {
      type: String,
      default: ""
    },

  },
  methods: {
    handlereply() {
     this.$emit("handlereply",this.data.id)
    },

    //点击关闭不显示回复名字盒子
    handleClose(){
    this.isShow = false;
    },
  },
};
</script>

<style scoped lang="less">
.cmt-floor {
  .cmt-content {
    padding: 15px;
    background: #f9f9f9;
    border: 1px solid #ccc;
    &:hover > .cmt-ctrl a{
        display: block
      }
  }
  .cmt-info {
    margin-bottom: 10px;
    font-size: 12px;
    color: #666;

    img {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      vertical-align: middle;
    }

    i {
      color: #999;
    }

    span {
      float: right;
    }
  }

  .cmt-pic {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    overflow: hidden;
    margin-right: 5px;
    margin-top: 10px;
    padding: 5px;
    border: 1px dashed #ddd;
    img {
      display: block;
      width: 100%;
      height: 100%;
      -o-object-fit: cover;
      object-fit: cover;
      cursor: pointer;
    }
  }
  .cmt-ctrl {
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #1e50a2;
    text-align: right;
    // display: none;

    a {
      text-decoration: none;
      color: inherit;
      display: none;
    }
  }
}
</style>