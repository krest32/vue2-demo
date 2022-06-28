<template>
<!-- 背景的css樣式 -->
<div class="login_container">
    <!-- 登録的盒子样式-->
    <div class="login_box">
        <div class="avatar_box">
            <img src="../assets/logo.png" alt="">
        </div>

        <!-- 登录表单区域 -->
        <!-- ref 重置功能会使用到 -->
        <!-- rules、prop 都与检验规则相关 -->
        <el-form ref="loginFormRef" label-width="0px" :rules="loginFormRules" class="login_form" :model="loginForm">
            <el-form-item prop="username">
                <!-- 使用了第三方的图标展示库 -->
                <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item class="btns">
                <el-button type="primary" @click="login">登陆</el-button>
                <el-button type="info" @click="resetData">重置</el-button>
            </el-form-item>
        </el-form>
    </div>

</div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 表单的验证规则对象
            loginFormRules: {
                // 验证用户名规则
                username: [{
                    required: true,
                    message: '请输入用户名称',
                    trigger: 'blur'
                }, {
                    min: 3,
                    max: 10,
                    message: '长度在 3 到 10 个字符',
                    trigger: 'blur'
                }],
                // 验证密码规则
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        // 登陆
        login() {
            // 得到表单的引用对象进行校验
            this.$refs.loginFormRef.validate(async valid => {
                // valid 是一个验证的结果
                if (!valid) {
                    // 如果验证不通过，那么不发起请求
                }
                // 通过http请求提交post，访问login路径，然后提交数据
                // {data: res} -> 解析数据，得到我们需要的系统返回的数据
                const {
                    data: res
                } = await this.$http.post('login', this.loginForm)
                // console.log(res)
                // this.$message.error:引入element ui的提示弹框

                if (res.meta.status !== 200) return this.$message.error('登陆失败')
                this.$message.success('登陆成功')
                // 登录成功之后，1 保存token，生效期日期为session，保存到sessionStorage中
                window.sessionStorage.setItem('token', res.data.token)
                //  2.页面跳转到后台
                this.$router.push('/home')
            })
        },
        // 重置消息
        resetData() {
            // elment ui 提供的表单数据重置功能,将表单恢复到默认的信息
            this.$refs.loginFormRef.resetFields()
        }

    }
}
</script>

<!-- 允许使用less，scoped 代表只在当前文件内生效 -->

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #FFF;
    border-radius: 3px;
    position: absolute;
    // 窗口移動到正中間
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    // 设置输入框的的样式
    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 10px #ddd;
        // 设置头像框的样式
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
    box-sizing: border-box;
}

.btns {
    display: flex;
    // 具有对齐
    justify-content: flex-end;
}
</style>
