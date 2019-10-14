<template>
    <el-form 
        :model="form" 
        ref="form" 
        :rules="rules"
        class="form">
            <el-form-item class="form-item" 
                prop="username" >
                <el-input
                v-model="form.username"
                placeholder="用户名/手机">
                </el-input>
            </el-form-item>

            <el-form-item class="form-item"
                prop="captcha" >
                <el-input
                v-model="form.captcha"
                placeholder="验证码" >
                    <template slot="append">
                        <el-button @click="handleCheckCode">
                            <span ref="codebtn">发送验证码</span>
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item class="form-item"
                prop="nickname">
                <el-input 
                v-model="form.nickname"
                placeholder="你的名字">
                </el-input>
            </el-form-item>

            <el-form-item class="form-item"
                prop="password">
                <el-input 
                v-model="form.password"
                placeholder="密码" 
                type="password">
                </el-input>
            </el-form-item>

            <el-form-item class="form-item"
                prop="checkpassword">
                <el-input 
                v-model="form.checkpassword"
                placeholder="确认密码" 
                type="password"
                >
                </el-input>
            </el-form-item>

            <el-button 
            class="submit" 
            type="primary"
            @click="handleSubmit()">
                注册
            </el-button>
        </el-form>
</template>

<script>
import { async } from 'q'
export default {
    data(){
        var validatePass = (rule, value, callback) => {
        if (value === '') {
                callback(new Error('请输入密码'));
            } else {
            if (this.form.password !== '') {
                this.$refs.form.validateField('checkPass');
            }
                callback();
            }
        };
      var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
            };
        return {
            // 表单数据
            form: {
                username:"",
                nickname:"",
                captcha:"",
                password:"",
                checkpassword:"",
            },
            // 表单规则
            rules: {
                username:[{ required: true, message: '请输入用户名/手机', trigger: 'blur' }],
                nickname:[{ required: true, message: '请输入昵称', trigger: 'blur' }],
                captcha:[{ required: true, message: '请输入手机验证码', trigger: 'blur' }],
                password:[{ validator:validatePass, trigger: 'blur' }],
                checkpassword:[{ validator:validatePass2, trigger: 'blur' }],
            },
        }
    },
    methods:{
        handleCheckCode(){
              let num = 10;
              var timeId = setInterval(async () => {
                    this.$refs.codebtn.innerHTML="已发送(" + num + ")";
                    num--;
                     if(num === 6){
                        const res =await this.$store.dispatch('user/sendCheckcode',this.form.username);
                        this.$message.success("验证码为" + res.data.code)
                    }
                    if(num === 0){
                        this.$refs.codebtn.innerHTML="发送验证码"
                        clearInterval(timeId)
                    }
                }, 1000);
        },
        handleSubmit(){
            this.$refs.form.validate(async (valid)=>{
                if(valid){
                    // 在发送数据之前需要把表单内二次验证密码的数据删除
                    const {checkpassword,...props} = this.form;
                    const res = this.$store.dispatch('user/register',props);
                    const data = res.data;
                    this.$message.success("注册成功")
                    this.$router.push('/')
                }else{
                    this.$message.error("请正确输入用户名和密码")
                }
            })
        },
    }
}
</script>

<style scoped lang="less">
    .form{
        padding:25px;
    }

    .form-item{
        margin-bottom:20px;
    }

    .form-text{
        font-size:12px;
        color:#409EFF;
        text-align: right;
        line-height: 1;
    }

    .submit{
        width:100%;
        margin-top:10px;
    }
</style>