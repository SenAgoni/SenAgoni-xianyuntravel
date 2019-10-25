<template>
  <div>
    <div class="cmt-wrapper">
      <h4 class="cmt-title">评论</h4>
      <span class="replyTag el-tag el-tag--info" v-if="isShow">
        回复 @{{username}}
        <i class="el-tag__close el-icon-close" @click="handleClose"></i>
      </span>
      <div class="cmt-input">
        <div class="el-textarea">
          <textarea
            autocomplete="off"
            placeholder="说点什么吧..."
            class="el-textarea__inner"
            style="resize: none; min-height: 33px;"
            ref="comments"
          ></textarea>
        </div>
      </div>
      <div class="cmt-input-ctrls el-row is-justify-space-between el-row--flex">
        <div class="cmt-pics">
          <el-upload
            :action="$axios.defaults.baseURL+'/upload'"
            name="files"
            list-type="picture-card"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            ref="clear"
          >
            <i class="el-icon-plus"></i>
          </el-upload>

          <div class="el-dialog__wrapper" style="display: none;">
            <div
              role="dialog"
              aria-modal="true"
              aria-label="dialog"
              class="el-dialog"
              style="margin-top: 15vh;"
            ></div>
          </div>
        </div>
        <div>
          <button
            v-if="onSubmit"
            type="button"
            class="el-button cmt-submit el-button--primary el-button--mini"
            @click="handleRep"
          >
            <span>回复</span>
          </button>
          <button
            type="button"
            v-else
            class="el-button cmt-submit el-button--primary el-button--mini"
            @click="handleSubmit"
          >
            <span>提交</span>
          </button>
        </div>
      </div>
      <div class="cmt-list" v-for="(item,index) in data" :key="index">
        <div class="cmt-item">
          <div class="cmt-info">
            <img :src="$axios.defaults.baseURL+`${item.account.defaultAvatar}`" />
            {{item.account.nickname}}
            <i>{{now}}</i>
            <span>{{item.level}}</span>
          </div>

          <!-- 当前回复的评论 -->
          <CommentsFloor
            v-if="item.parent"
            @handlereply="handlereply"
            :data="item.parent"
            :now="now"
          />
          
          <div class="cmt-content">
            <div class="cmt-new">
              <p class="cmt-message">{{item.content}}</p>
              <div class="el-row el-row--flex">
                <div class="cmt-pic" v-if="item.pics.length !==0">
                  <img :src="$axios.defaults.baseURL+`${item.pics[0].url}`" />
                </div>
              </div>
              <div class="cmt-ctrl" ref="foucs">
                <a href="javascript:;" @click="handlereply(item.id)">回复</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="PageIndex"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import CommentsFloor from "@/components/post/commentsFloor.vue";
export default {
  props: {
    dataList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      //接受数据
      data: [],
      // 分页初始值
      PageIndex: 1,
      limit: 2,

      // 总数据数
      total: 0,

      //定义数据初始值
      pics: [],
      content: "",
      //获取当地时间
      now: "",
      //这个是定义回复用户的id
      follow: 0,
      //定义显示回复弹框
      isShow: false,
      //定义一个用户名
      username: "",
      //定义一个功能默认是提交
      onSubmit: false,
      //定义isHave的默认值
      isHave: false
    };
  },
  components: {
    CommentsFloor
  },
  methods: {
    //提交按钮
    handleSubmit() {
      if (!this.$refs.comments.value) {
        this.$message.error("内容不能为空");

        return;
      }
      this.content = this.$refs.comments.value;
      // 创建日期对象，保存到 now 变量中
      var now = new Date();
      // 从日期对象中，调用 getFullYear 方法，获取年份保存到变量中
      var YYYY = now.getFullYear();
      var mm = now.getMonth() + 1;
      var dd = now.getDate();
      var HH = now.getHours(); // 获取 时
      var MM = now.getMinutes(); // 获取 分
      var SS = now.getSeconds(); // 获取 秒

      // 小于 10 补充 '0'
      // if 分支语句中，如果内部只有一行代码，可以省略花括号 {}，甚至可以写在一行里面
      if (HH < 10) HH = "0" + HH;
      if (MM < 10) MM = "0" + MM;
      if (SS < 10) SS = "0" + SS;

      var formatTime =
        YYYY + "-" + mm + "-" + dd + " " + HH + ":" + MM + ":" + SS;
      this.now = formatTime;
      //提交评论成功
      this.$axios({
        url: "/comments",
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        },
        method: "POST",
        data: {
          content: this.content,
          pics: this.pics,
          post: this.$route.query.id
        }
      }).then(res => {
        const { message } = res.data;

        this.$message.success(message);

        window.location.reload();

        this.dataList.length++;
      });
    },
    //回复按钮
    handleRep() {
      if (!this.$refs.comments.value) {
        this.$message.error("内容不能为空");

        return;
      }
      this.content = this.$refs.comments.value;
      // 创建日期对象，保存到 now 变量中
      var now = new Date();
      // 从日期对象中，调用 getFullYear 方法，获取年份保存到变量中
      var YYYY = now.getFullYear();
      var mm = now.getMonth() + 1;
      var dd = now.getDate();
      var HH = now.getHours(); // 获取 时
      var MM = now.getMinutes(); // 获取 分
      var SS = now.getSeconds(); // 获取 秒

      // 小于 10 补充 '0'
      // if 分支语句中，如果内部只有一行代码，可以省略花括号 {}，甚至可以写在一行里面
      if (HH < 10) HH = "0" + HH;
      if (MM < 10) MM = "0" + MM;
      if (SS < 10) SS = "0" + SS;

      var formatTime =
        YYYY + "-" + mm + "-" + dd + " " + HH + ":" + MM + ":" + SS;
      this.now = formatTime;
      //提交评论成功
      this.$axios({
        url: "/comments",
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        },
        method: "POST",
        data: {
          content: this.content,
          pics: this.pics,
          post: this.$route.query.id,
          follow: this.follow
        }
      }).then(res => {
        const { message } = res.data;

        this.$message.success(message);

        window.location.reload();
        this.dataList.length++;
      });
    },
    //上传图片
    handleAvatarSuccess(res, file) {
      this.pics.push({
        id: res[0].id,
        url: this.$axios.defaults.baseURL + res[0].url
      });
    },
    //删除图片
    handleRemove(file, fileList) {
      // console.log(file)
      const id = file.response[0].id;

      const arr = [];

      this.pics.forEach(v => {
        //从cover中删除掉已经移除的图片
        if (v.id !== id) {
          arr.push(v);
        }
      });
      this.pics = arr;
    },

    //点击回复评论
    handlereply(id) {
      //改变回复名字盒子的显示状态
      this.isShow = true;
      this.follow = id;
      this.$refs.comments.focus();
      //循环遍历数组拿到对应id的名字
      this.data.some(v => {
        if (v.id === id) {
          this.username = v.account.nickname;
          return true;
        }
      });
      this.onSubmit = true;
    },
    //点击关闭不显示回复名字盒子
    handleClose() {
      this.isShow = false;
      this.onSubmit = false;
    },
    // 条数切换时候触发
    handleSizeChange(val) {
      this.PageSize = val;
      this.getData();
    },

    // 切换页数时候触发
    handleCurrentChange(val) {
      this.PageIndex = val;
      this.start = (val - 1) * this.limit;
      this.getData();
    },
    //封装获取数据
    getData() {
      //获取文章评论列表数据
      this.$axios({
        url: "/posts/comments",
        params: {
          post: this.$route.query.id,
          _start: this.start,
          _limit: this.limit
        }
      }).then(res => {
        // console.log(res.data);
        this.total = res.data.total;
        this.data = res.data.data;
      });
    }
  },

  mounted() {
    //获取文章评论列表数据
    this.getData();

    //获取总条数
  }
};
</script>

<style scoped lang="less">
.cmt-wrapper {
  margin-bottom: 20px;

  .cmt-title {
    font-weight: 400;
    font-size: 18px;
    margin-bottom: 20px;
  }
  .replyTag{
    margin-bottom: 10px;
  }
  .el-tag--info{
    background-color: rgba(144,147,153,.1);
    border-color: rgba(144,147,153,.2);
  }
  .el-tag{
    padding: 0 10px;
    height: 32px;
    line-height: 30px;
    font-size: 12px;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid rgba(64,158,255,.2);
    white-space: nowrap;
  }
  .cmt-input {
    margin-bottom: 10px;

    .el-textarea {
      display: inline-block;
      width: 100%;
      vertical-align: bottom;
      font-size: 14px;

      .el-textarea__inner {
        display: block;
        padding: 5px 15px;
        line-height: 1.5;
        box-sizing: border-box;
        width: 100%;
        font-size: inherit;
        color: #606266;
        background-color: #fff;
        background-image: none;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
  }

  .cmt-input-ctrls {
    margin-bottom: 30px;

    .el-button--mini {
      padding: 7px 15px;
      font-size: 12px;
      border-radius: 3px;
    }

    .el-button--primary {
      color: #fff;
      background-color: #409eff;
      border-color: #409eff;
    }

    .el-button {
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      text-align: center;
      font-weight: 500;
    }
  }
  .el-row--flex {
    display: flex;
  }
  .el-row--flex.is-justify-space-between {
    justify-content: space-between;
  }
  .el-row {
    box-sizing: border-box;
  }

  .cmt-list {
    border: 1px solid #ddd;

    .cmt-item {
      padding: 20px 20px 5px;

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
      .cmt-content{
         padding:15px;
         &:hover > .cmt-new > .cmt-ctrl > a{
          display: block; 
      }
       .cmt-pic{
          width: 80px;
          height: 80px;
          border-radius: 6px;
          overflow: hidden;
          margin-right: 5px;
          margin-top: 10px;
          padding: 5px;
          border: 1px dashed #ddd;
          img{
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
        a {
          text-decoration: none;
          color: inherit;
          display: none;
        }
      } 
      }
    }
  }
  /deep/.cmt-floor{
    .cmt-content{
      padding:15px;
      }
    }
  }


.pagination {
  margin-bottom: 20px;
}
</style>