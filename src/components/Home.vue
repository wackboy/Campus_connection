<template>
  <el-container class="home-container">
    <el-header>
      <el-menu
        :default-active="activeIndex"
        router
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#FFFFFF"
        text-color="black"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="welcome">首页</el-menu-item>
        <el-menu-item index="freeTalk">闲言碎语</el-menu-item>
        <el-menu-item index="seekFriend">天涯比邻</el-menu-item>
        <el-menu-item index="academic">学术交流</el-menu-item>
      </el-menu>
      <el-input
        placeholder="请输入搜索内容"
        v-model="input"
        clearable
      ></el-input>
      <el-button class="login" v-if="!this.$cookies.isKey('WACKYBOY')" type="primary" @click="login"
        >登录</el-button
      >
      <el-button v-if="this.$cookies.isKey('WACKYBOY')" :type="editState" @click="edit"
        >记录心情</el-button
      >
      <el-dropdown v-if="this.$cookies.isKey('WACKYBOY')">
        <el-avatar fit="fill" :src="user.avatar_img"></el-avatar>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="writePaper">写文章</el-dropdown-item>
          <el-dropdown-item>我赞过的</el-dropdown-item>
          <el-dropdown-item>我的关注</el-dropdown-item>
          <el-dropdown-item @click.native="editInfo">修改信息</el-dropdown-item>
          <el-dropdown-item @click.native="logout">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <router-view></router-view>
      </el-container>
    </el-container>
  </el-container>
</template>


<script>
export default {
  data() {
    return {
      activeIndex: "welcome",
      input: "",
      user: {
      },
      editState: "primary"
    };
  },
  created() {
    this.getUserInfoList();
    this.getToken();
  },
  methods: {
    getToken() {
      this.$store.state.token = sessionStorage.getItem("token");
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    login() {
      this.$router.push("/login");
    },
    edit() {
      
       if(this.$store.state.editBox === "") {
         this.editState = "primary"
         this.$store.state.editBox = "display:none"
       } else {
         this.editState = "success"
         this.$store.state.editBox = ""
       }
    },
    clicked() {
      console.log("点击了头像");
    },
    // 获取进入首页的用户信息表
    async getUserInfoList() {
      const { data: res } = await this.$http.get("/auth/verify");
      this.user = res;
      this.$store.state.user = this.user;
      localStorage.setItem("userid", this.user.userid);
      console.log('verify');
    },

    writePaper() {
      console.log("写文章");
    },

    editInfo() {
      this.$router.push("/editInfo");
    },

    logout() {
      this.$confirm("请问确定退出么, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 应该同样是要请求后端删除Cookie，安全
          this.$cookies.remove("WACKYBOY" , "/" , "localhost")
          location.reload()
          this.$message({
            type: "success",
            message: "退出成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "还好你在",
          });
        });
    },
  },
};
</script>


<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  padding-left: 0%;
  align-items: center;
  color: #ffff;
  font-size: 10px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  .el-menu-demo {
    display: flex;
    margin-right: 0%;
    margin-left: 25%;
    .el-menu-item {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #17191f;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf2;
}

.toggler-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-input {
  width: 15%;
  margin-left: 5%;
  margin-right: 0%;
}

.el-button {
  margin-right: 0%;
}

.el-dropdown {
  margin-left: 0;
  margin-right: 23%;
}

.login {
  margin-right: 25%;
}
</style>
