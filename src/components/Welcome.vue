<template>
  <el-main>
    <div class="editArea" :style="$store.state.editBox">
      <div>
        <el-input
          class="input"
          type="textarea"
          placeholder="请输入内容"
          v-model="textarea"
          maxlength="200"
          show-word-limit
          :autosize="{ minRows: 2 }"
        >
        </el-input>
      </div>
      <div class="editBottom">
        <el-button type="primary" @click="upload">发布</el-button>
      </div>
    </div>
    <div v-for="item in infoList" :key="item.t_id" class="talkArea">
      <div class="header">
        <div class="talk-header">
          <el-avatar :src="item.img"></el-avatar>
        </div>
      </div>
      <li class="content-style">{{ item.content }}</li>
      <!-- 点赞、评论、分享区域 -->
      <div class="pin-action-row">
        <div class="action-box">
          <div class="like-action" @click="like(item.t_id)">
            <div class="action-title-box">
              <i v-if="item.like_count === 0" class="el-icon-star-off">赞</i>
              <i
                v-else-if="user_like_list.indexOf(item.t_id) != -1"
                class="el-icon-star-on"
                >{{ item.like_count }}</i
              >
              <i v-else class="el-icon-star-off">{{ item.like_count }}</i>
            </div>
          </div>
          <div class="comment-action" @click="comment_list(item.t_id)">
            <i v-if="item.comment_count === 0" class="el-icon-chat-square"
              >评论</i
            >
            <i v-else class="el-icon-chat-square">{{ item.comment_count }}</i>
          </div>
          <div class="share-action" @click="share">
            <i class="el-icon-share"></i>分享
          </div>
        </div>
        <!-- 评论列表区域 -->
        <div v-show="table_comment_list[item.t_id]">
          <div class="comment_area">
            <div class="comment-form">
              <div class="avatar-box">
                <el-avatar :src="avatar_img" slot="prepend"></el-avatar>
                <span class="el-input">
                  <input
                    type="text"
                    autocomplete="off"
                    v-model="comment_content"
                    placeholder="输入评论..."
                    class="el-inputinner"
                  />
                </span>
              </div>
              <div class="commentBottom">
                <el-button
                  type="primary"
                  size="small"
                  @click="comment_upload(item.t_id)"
                  >评论</el-button
                >
              </div>
            </div>
          </div>
          <div class="comment-list" v-show="comment_state == true">
            <!-- 展示评论列表 -->
            <div class="item">
              <div class="comment" v-for="comment in user_comment_list[item.t_id]" :key="comment.c_id">
                <el-avatar class="comment_avatar" :src="comment.avatar_img" size="medium"></el-avatar>
                <div class="content-box">
                  <div class="meta-box"></div>
                  <div class="content">{{ comment.content }}</div>
                  <div class="sub-content-list"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
import Vue from "vue";
export default {
  inject: ["reload"],
  data() {
    return {
      infoList: [],
      user_like_list: [],
      // 这是不是可以改为map结构？？？？？（后期再说）
      table_comment_list: [],
      user_comment_list: [],
      text: "",
      textarea: "",
      avatar_img: "",
      comment_content: "",
      comment_state: false
    };
  },
  created() {
    this.getInfoList();
  },
  methods: {
    async getInfoList() {
      this.avatar_img = sessionStorage.getItem("avatar_img");
      const { data: res } = await this.$http.get("/");
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("请求数据失败！");
      }
      this.infoList = res.data;
      // console.log("res.data: ", res.data);
      // console.log("res.data2: ", res.data2);
      // console.log("res.data3: ", res.data3);

      if (this.$store.state.token != "") {
        const userId = sessionStorage.getItem("userId");
        for (let i of res.data2) {
          if (parseInt(i.u_id) == parseInt(userId)) {
            this.user_like_list.push(i.t_id);
            console.log("加入成功");
          } else {
            console.log("加入失败");
          }
        }
        console.log(this.user_like_list);
      }
    },
    async upload() {
      if (!this.textarea) {
        this.$message.error("发布内容不能为空！");
      }
      if (this.textarea.length > 0) {
        const { data: res } = await this.$http.post("/uploadMind", {
          textarea: this.textarea,
          time: Date.now(),
        });
        console.log(res);
        if (res.meta.status != 200) {
          return this.$message.error("你的心情坠落了！");
        } else {
          location.reload();
          return this.$message.success("发布成功！");
        }
      }
    },
    async like(t_id) {
      if (!sessionStorage.getItem("token")) {
        return this.$message.error("请先登录账号！");
      }
      const { data: res } = await this.$http.post("like", { t_id: t_id });
      console.log("like 的 res: ", res);
      if (res.meta.status != 200) {
        return this.$message.error("点赞失败！");
      } else {
        return this.reload();
      }
    },
    async comment_list(id) {
      /* 
        当vue开发实例创建好之后，再去修改其中的内容，需要使用Vue.set
      */
      if (this.table_comment_list[id] == true) {
        this.table_comment_list[id] = false;
        Vue.set(this.table_comment_list, id, false);
      } else {
        this.table_comment_list[id] = true;
        Vue.set(this.table_comment_list, id, true);
        /* 
        处理展示评论列表的响应事件：
        get:
      */
        const { data: res } = await this.$http.post("/show_comment_list", {
          t_id: id
        });
        if(res.meta.status == 200) {
          this.comment_state = true
          console.log("评论列表展示");
          console.log(res);
          // this.user_comment_list = res.data;
          
          this.user_comment_list[id] = JSON.parse(JSON.stringify(res.data))
          // Vue.set(this.user_comment_list, id, res.data);
        } else {
          this.comment_state = false
          console.log("评论列表为空");
        }

      }
      
    },
    async comment_upload(t_id) {
      /* 
          处理发布评论的响应事件：
          post：userId, t_id, content(input)
        */
      if (!this.comment_content) {
        this.$message.error("发布内容不能为空！");
      }
      if (this.comment_content.length > 0) {
        const { data: res } = await this.$http.post("/uploadComment", {
          comment_content: this.comment_content,
          t_id: t_id,
          avatar_img: sessionStorage.getItem("avatar_img"),
          comment_time: Date.now(),
        });

        console.log("评论上传的返回值： ", res);
        if (res.meta.status != 200) {
          return this.$message.error("发布评论失败！");
        } else {
          location.reload();
          return this.$message.success("评论发布成功！");
        }
      }
    },
    share() {},
  },
};
</script>


<style lang="less" scoped>
.talkArea {
  height: auto !important;
  display: block;
  margin-left: 25%;
  width: 40%;
  height: 200px;
  border-radius: 10px;
  border-block-width: 100px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-bottom: 10px;
  margin-top: 10px;
  background-color: #ffffff;
  list-style-type: none;
  .comment_area {
    display: block;
    position: relative;
    border-top: 1px solid #ebebeb;
    padding-top: 1.333rem;
    padding-bottom: 0.1rem;
    .comment-form {
      margin: 0 1.666rem 1rem;
      display: flex;
      position: relative;
      padding: 1rem 1.333rem;
      background-color: #fafbfc;
      border-radius: 3px;
      .avatar-box {
        flex: 0 0 auto;
        display: block;
      }
    }
  }
  .comment-list {
  display: block;
  margin: 0 1.666rem 0 6.5rem;
  .item {
      margin-bottom: 1.333rem;
      .comment {
          display: flex;
        .comment_avatar {
          display: inline;
        }
        .content-box {
          border-bottom: 1px solid #f1f1f1;
          margin-left: .833rem;
          flex: 1 1 auto;
          display: block;
          .content {
            margin-top: .55rem;
            font-size: 0.9rem;
            line-height: 1.833rem;
            word-wrap: break-word;
            white-space: pre-wrap;
            color: #505050;
            overflow: hidden;
          }
          .sub-content-list {
            margin: 1rem 0;
            padding: 0 0 0 1rem;
            background-color: #fafbfc;
            border-radius: 3px;
          }
        }
      }
  }
}
}



.el-input {
  position: absolute;
  font-size: 14px;
  display: inline-block;
  margin-left: 20px;
  width: 80%;
  .el-inputinner {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid#f1f1f1;
    box-sizing: border-box;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }
}

.comment_area {
  display: block;
  position: relative;
  border-top: 1px solid #ebebeb;
  padding-top: 1.333rem;
  margin-bottom: 10px;
}

.title-style {
  margin-left: 10px;
}
.content-style {
  margin-left: 60px;
  margin-top: 10px;
  font-size: 20px;
}

.talk-header {
  padding-top: 2%;
  padding-left: 2%;
}

.editArea {
  height: auto !important;
  height: 150px;
  min-height: 150px;
  margin-left: 25%;
  width: 40%;
  border-radius: 10px;
  border-block-width: 100px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-top: 10px;
  background-color: #f9fafb;
  list-style-type: none;
  .input {
    font-size: 20px;
    padding-top: 3%;
    padding-left: 5%;
    padding-right: 5%;
    // padding-bottom: 5%;
    background-color: #ffffff;
    box-sizing: border-box;
  }
}

.editBottom {
  padding-top: 2%;
  padding-bottom: 2%;
  padding-left: 87%;
  background-color: #ffffff;
}

.commentBottom {
  padding-top: 9%;
  padding-bottom: 0%;
  padding-left: 80%;
}

.pin-action-row {
  display: block;
  .action-box {
    display: flex;
    position: relative;
    margin-top: 3.7rem;
    height: 34px;
    border-top: 1px solid #ebebeb;
    .like-action {
      flex: 1 1 33.333%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 100%;
      cursor: pointer;
      .action-title-box {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    ::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -1rem;
      width: 1px;
      height: 2rem;
      background-color: #ebebeb;
    }
    .comment-action {
      flex: 1 1 33.333%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 100%;
      cursor: pointer;
    }
    .share-action {
      flex: 1 1 33.333%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 100%;
      cursor: pointer;
    }
  }
}
</style>