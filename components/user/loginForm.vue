<template>
      <el-form 
        :model="form" 
        ref="form"
        :rules="rules" 
        class="form">

        <el-form-item class="form-item"
            prop="username">
            <el-input 
            placeholder="用户名/手机"
            v-model="form.username"
            >
            </el-input>
        </el-form-item>

        <el-form-item class="form-item"
        prop="password"
        >
            <el-input 
            placeholder="密码" 
            v-model="form.password"
            type="password">
            </el-input>
        </el-form-item>

        <p class="form-text">
            <nuxt-link to="#">忘记密码</nuxt-link>
        </p>

        <el-button 
        class="submit"
        type="primary"
        @click="handleLoginSubmit">
            登录
        </el-button>
    </el-form>
</template>

<script>
export default {
    data(){
        return {
            form:{
                username:"",
                password:""
            },
            rules:{
                username:[
                    { required: true, message: '请输入用户名/手机号', trigger: 'blur' },
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ]
            }
        }
    },
    methods:{
        handleLoginSubmit(){
            // 在上传提交用户名与密码之前需要验证用户是否是真的已经输入用户名和密码了这里的表单组件会自己触发一个函数
            // 来验证用户是否已正确输入密码与用户名,并且返回一个布尔类型的值
            this.$refs.form.validate((valid)=>{
                if(valid){
                   const res = this.$store.dispatch('user/login',this.form);
                   const data = res.data;
                   this.$router.push('/')
                }else{
                    this.$message.error("请正确输入用户名和密码")
                }
            })
        }
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