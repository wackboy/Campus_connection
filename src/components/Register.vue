<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="registerRef" :model="register" :rules="registerRules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="register.userName" prefix-icon="el-icon-user-solid"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="register.password" prefix-icon="el-icon-lock" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="regist">注册</el-button>
                    <el-button type="info" @click="resetregister">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            // 这是登录表单的数据绑定对象
            register: {
                userName: '',
                password: ''
            },
            // 这是表单的验证规则对象
            registerRules: {
                // 验证用户名是否合法
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 点击重置按钮，重置登陆表单
        resetregister() {
            this.$refs.registerRef.resetFields();
        },
        regist() {
            this.$refs.registerRef.validate(async valid => {
                if(!valid)  return;
                const {data: res} = await this.$http.post('register', this.register);
                if(res.meta.status !== 200) return this.$message.error('注册失败');
                this.$message.success('注册成功了！')
                /* 
                    1. 将登录成功后的token，保存到客户端的sessionStorage中
                        1.1 项目中除了登录之外的其他API接口，必须再登录之后才能访问
                        1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
                */
                console.log(res);
                localStorage.setItem('eleToken', res.token)
                this.$store.state.token = localStorage.getItem('eleToken')  
                // window.sessionStorage.setItem('token', res.data.token);
                // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
                this.$router.push('/login')
            })  
        }
    },
}
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .avatar_box {
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        // 盒子溢出处理
        box-sizing: border-box;
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>










/* methods: {
    async clickme() {
        const userName = '风缘'
        const password = '123456'
        const {data: res} = await this.$http.post('/login?userName=' + userName + '&&password=' + password)
        console.log('res: ', res);
        localStorage.setItem('eleToken', res.token)
        this.$store.state.token = localStorage.getItem('eleToken')
        if(res.meta.status != 200) {
            return this.$message.error("请求数据失败！")
        }
        this.userName = res.result.userName
        this.$router.replace('/home')
    } */