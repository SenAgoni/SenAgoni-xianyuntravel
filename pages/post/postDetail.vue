<template>
  <div class="container el-row is-justify-space-between el-row--flex">
    <div class="main">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">旅游攻略</el-breadcrumb-item>
        <el-breadcrumb-item>攻略详情</el-breadcrumb-item>
      </el-breadcrumb>

      <h1>{{data.title}}</h1>

      <div class="post-info">
        <span>攻略：2019-05-22</span>
        <span>阅读：8273</span>
      </div>

      <div class="post-content" v-html="data.content">
        
      </div>

      <div class="post-ctrl">
        <div class="el-row is-justify-center el-row--flex">
          <div class="ctrl-item">
            <i class="iconfont iconpinglun"></i>
            <p>评论({{data.comments.length}})</p>
          </div>
          <div class="ctrl-item" @click="handleStar" >
            <i class="iconfont iconstar1"></i>
            <p>收藏</p>
          </div>
          <div class="ctrl-item">
            <i class="iconfont iconfenxiang"></i>
            <p>分享</p>
          </div>
          <div class="ctrl-item" @click="handleLike">
            <i class="iconfont iconding"></i>
            <p>点赞({{data.like}})</p>
          </div>
        </div>
      </div>

      <!-- 评论和底部分页部分 -->
      <!-- dataList文章数据内容 -->
      <Comments :dataList="data.comments"/>
    </div>
    <!-- 相关攻略的详情部分 -->
    <Aside/>
    <a href="javascript:;" id="btn" title="回到顶部" class="el-icon-caret-top"></a>
  </div>
</template>

<script>
import Aside from "@/components/post/aside.vue"
import Comments from "@/components/post/comments.vue"
import {Scrollevent} from "@/untils/Scroll.js"
export default {
  data(){
    return{
      data:{
        comments:[]
      },
    }
  },
  components:{
    Aside,
    Comments
  },
  watch:{
      $route(){
        //请求数据
         this.getData()
      }
    },
  methods:{
    handleStar(){
      const id = this.$route.query.id;
      this.$axios({
        url:"/posts/star?id=" + id,
        headers:{
              Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
          },
      }).then(res=>{
        const {message} = res.data;
        console.log(res.data)
        this.$message.success(message)
      })
    },

    handleLike(){
      const id = this.$route.query.id;
      this.$axios({
        url:"/posts/like?id=" + id,
        headers:{
              Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
          },
      }).then(res=>{
        const {message} = res.data;
        console.log(res.data)
        
        this.$message.success(message)
      })
    },

    //封装请求数据
    getData(){
    const id = this.$route.query.id;
    this.$axios({
      url:"/posts?id=" + id,
    }).then(res=>{
      console.log(res.data)
      // data是一个数组 然后拿到data中的第一项数据
      this.data = res.data.data[0];
    })
    }
  },
  mounted(){
   this.getData();
   return Scrollevent();
  }
};
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
.container {
  width: 1000px;
  margin: 0 auto;
  padding-top: 20px;

  .main {
    width: 700px;

    * {
      margin: 0;
      padding: 0;
    }

    h1 {
      display: block;
      font-size: 2em;
      margin-block-start: 0.67em;
      margin-block-end: 0.67em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      font-weight: bold;
      border-bottom: 1px solid #ddd;
      padding-bottom: 20px;
    }

    .post-info {
      color: #999;
      padding: 20px;
      text-align: right;
    }

    /deep/ .post-content {
      line-height: 1.5;

      * {
        max-width: 700px !important;
      }
      img {
        margin: 10px 0;
      }
    }

    .post-ctrl {
      padding: 50px 0 30px;

      .ctrl-item {
        margin: 0 20px;
        font-size: 20px;
        text-align: center;
        cursor: pointer;

        i {
          display: block;
          font-size: 28px;
          color: orange;
        }

        p {
          margin-top: 5px;
          font-size: 14px;
          color: #999;
        }

        .like_active{
        border: 1px  red solid;
        }
      }
    }

  } 

  
}
</style>