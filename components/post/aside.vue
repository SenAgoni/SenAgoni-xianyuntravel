<template>

    <div class="aside">
        <h4 class="aside-title">相关攻略</h4>
        <div class="recommend-list" v-for="(item,index) in data" :key="index">
          <div class="recommend-item nuxt-link-active" @click="handlePost(item.id)">
            <div class="post-imgText el-row el-row--flex">
              <div class="post-img el-row is-align-middle el-row--flex">
                <img :src="item.images[0]" alt="">
              </div>
              <div class="post-text">
                <div>{{item.title}}</div>
                <p>{{now}} 1:59 阅读 {{item.watch}}</p>
              </div>
            </div>
          </div>
        </div>
    </div>

</template>

<script>
export default {
  props:{
    now: {
      type: String,
      default: ""
    },
  },
    data(){
      return{
        //攻略
        data:[]
      }
    },
    
    methods:{
      handlePost(id){
        this.$router.push({
          path:"/post/postDetail",
          query:{
            id
          }
        })
        this.mounted();
      },
    },
    mounted(){
       //获取总数据
      this.$axios({
        url:"/posts/recommend" 
      }).then(res=>{
        const {data} = res.data;
        this.data = data
      })
    },
}
</script>

<style scoped lang="less">
.aside{
    width: 280px;

    .aside-title{
      font-weight: 400;
      font-size: 18px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
    }
    
    .recommend-item{
      display: block;
      padding: 20px 0;
      border-bottom: 1px solid #ddd;

      .post-imgText{

        .post-text{
          flex: 1;
          position: relative;
          div{
            line-height: 1.4em;
            height: 2.8em;
            overflow: hidden;
            position: absolute;
            left: 10px;
            top: 0;
            width: 100%;
          }

          p{
            position: absolute;
            bottom: 0;
            left: 10px;
            font-size: 12px;
            color: #999;
          }
        }
        
        .post-img{
          img{
            width: 100px;
            height: 80px;
            object-fit: cover;
          }
        }
      }
    }

    .el-row--flex{
      display: flex;
    }

    .el-row{
      box-sizing: border-box;
    }

    .el-row--flex.is-align-middle{
      align-items: center;
    }

  }
</style>