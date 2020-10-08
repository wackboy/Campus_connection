<template>
  <div class="editInfo">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-upload
      class="avatar-uploader"
      action="http://localhost:3000/changeUserHeadpic"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :headers="headers"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-button>上传头像</el-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        imageUrl: '',
        headers: {}
      };
    },
    created() {
      this.headers = {
          token: sessionStorage.getItem("token")
        }
    },
    methods: {
      async handleAvatarSuccess(res, file) {
        
        if(res.meta.status == 200) this.$router.push('/home')
        // this.imageUrl = URL.createObjectURL(file.raw);
        // console.log('imageURL:', this.imageUrl);
        // const img_content = {
        //   image_url: this.imageUrl,
        //   file: file
        // }
        // // 前端post上传URL地址给后端，后端根据id更新数据表
        // const {data: Res} = await this.$http.post("update", img_content)
        // console.log('图片上传后的res: ', Res);
        // if(Res.meta.stauts != 200) {
        //   return this.$message.error("更新数据失败！")
        // }

        // this.$router.replace('/home')
        // this.$message.success('头像更换成功！')


      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>

<style lang="less" scoped>
.editInfo {
  margin-left: 25%;
  width: 40%;
  height: 200px;
  border-radius: 10px;
  border-block-width: 100px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-top: 10px;
  background-color: #ffffff;
  list-style-type: none;
}


  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>