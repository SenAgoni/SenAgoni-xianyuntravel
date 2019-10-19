<template>
    <div class="main">
        <div class="air-column">
            <h2>乘机人</h2>
            <!-- 乘机人是需要循环的 -->
            <el-form class="member-info" >
                <div class="member-info-item" v-for="(item,index) in users" >
                    <el-form-item label="乘机人类型">
                        <el-input 
                        placeholder="姓名" 
                        class="input-with-select"
                        v-model="item.username">
                            <el-select 
                            slot="prepend" 
                            value="1" 
                            placeholder="请选择">
                                <el-option label="成人" value="1"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="证件类型">
                        <el-input 
                          placeholder="证件号码"
                          class="input-with-select"
                          v-model="item.id" 
                          >
                            <el-select 
                            slot="prepend" 
                            value="1"          
                            placeholder="请选择">
                                <el-option label="身份证" value="1" :checked="true"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <span class="delete-user" @click="handleDeleteUser(index)">-</span>
                </div>
            </el-form>

            <el-button class="add-member" type='primary' @click="handleAddUsers">添加乘机人</el-button>
        </div>

        <div class="air-column">
            <h2>保险</h2>
            <div>
                <div class="insurance-item" v-for="(item,index) in detail.insurances" >
                    <el-checkbox
                        :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`" 
                        @change="handleInsurances(item.id)"
                        border>
                    </el-checkbox> 
                </div>
            </div>
        </div>

        <div class="air-column">
            <h2>联系人</h2>
            <div class="contact">
                <el-form label-width="60px">
                    <el-form-item label="姓名">
                        <el-input v-model="contactName" :value="contactName"></el-input>
                    </el-form-item>

                    <el-form-item label="手机">
                        <el-input placeholder="请输入内容" :value="contactPhone" v-model="contactPhone">
                            <template slot="append">
                            <el-button @click="handleSendCaptcha">发送验证码</el-button>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="验证码">
                        <el-input v-model="captcha"></el-input>
                    </el-form-item>
                </el-form>   
                <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
            </div>
        </div>
        <span v-show="false">{{Allprice}}</span>
    </div>
</template>

<script>
export default {
    data(){
        return {
            users:[
                {username:"",id:""},
            ],
            captcha:"",
            insurances:[],
            contactPhone:"",
            contactName:"",
            invoice:false,
            seat_xid:this.$route.query.seat_xid,
            air:this.$route.query.id,
            detail:{},
        }
    },
    // 监听变化，然后获取价格数据
    computed:{
        Allprice(){
            if(!this.detail.seat_infos) return;
            let price = 0;
            price += this.detail.seat_infos.org_settle_price;
            this.insurances.forEach(v=>{
                price += this.detail.insurances[v-1].price 
            })
            price += this.detail.airport_tax_audlet;
            price = this.users.length * price;
            this.$emit("getAllprice",price)
            return price;
        }
    },
    mounted(){
        this.$axios({
            url:"/airs/" + this.$route.query.id,
            params:{
                seat_xid:this.$route.query.seat_xid,
            }
        }).then(res=>{
            this.detail = res.data;
            this.$emit("getAlldata",this.detail);
            this.checkInsurances = this.detail.insurances;
        })
    },
    methods: {
        // 添加乘机人
        handleAddUsers(){
            this.users.push({username:"",id:""});
        },
        
        // 移除乘机人
        handleDeleteUser(index){
            this.users.splice(index,1)
        },
        handleInsurances(id){
            if(this.insurances.length>0){
                // 会返回一个索引值
                const index = this.insurances.indexOf(id);
                if(index > -1){
                    // 代表已经存在 存在了就要删除才行
                    this.insurances.splice(index,1);
                }else{
                    this.insurances.push(id);
                }
            }else{
                this.insurances.push(id);
            }
        },
        
        // 发送手机验证码
        handleSendCaptcha(){
            // 验证手机是否已经输入
            if(!this.contactPhone){
                this.$message.error("请输入手机号码");
            }else{
              const promise =  this.$store.dispatch('user/sendCheckcode',this.contactPhone);
              promise.then(res=>{
                  this.$message.success(`验证码为：`+res.data.code)
              })
            }
        },

        // 提交订单
        handleSubmit(){
            const data ={
                users:this.users,
                contactPhone:this.contactPhone,
                contactName:this.contactName,
                invoice:this.invoice,
                seat_xid:this.seat_xid,
                air:this.air,
                insurances:this.insurances,
                captcha:this.captcha
            }
            this.$axios({
                url:"/airorders",
                method:"POST",
                headers:{
                    Authorization:`Bearer ${this.$store.state.user.userInfo.token}`,
                },
                data,
            }).then(res=>{
                const {data,message} = res.data;
                if(message === "订单提交成功"){
                    this.$message.success("正在生成订单中,请稍等")
                    // 然后就要跳转到订单页
                    this.$router.push({
                        path:'/air/pay',
                        query: {id:data.id},
                    })
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
    .air-column{
        border-bottom:1px #ddd dashed;
        padding-bottom: 20px;   
        margin-bottom: 20px;
    }

    .air-column h2{
        margin-bottom: 20px;
        font-size: 22px;
        font-weight: normal;
    }

    /deep/ .el-select .el-input {
        width: 130px;
    }

    .input-with-select{
        width:590px;
    }

    .input-with-select /deep/  .el-input-group__prepend {
        background-color: #fff;
    }
    .member-info /deep/ .el-form-item{
        margin-bottom:0;
    }

    .member-info-item{
        border-bottom:1px #eee dashed;
        padding-bottom: 20px;
        position: relative;

        &:first-child{
            .delete-user{
                display: none;
            }
        }
    }

    .add-member{
        margin-top:20px;
    }

    .delete-user{
        display: block;
        background:#ddd;
        width:16px;
        height:16px;
        font-size:14px;
        text-align: center;
        line-height: 16px;
        color:#fff;
        cursor: pointer;
        border-radius: 50px;
        position:absolute;
        right:-30px;
        top:50%;
    }

    .insurance{
        > div{
            margin-top:10px;
        }
    }

    .insurance-item{
        margin-bottom: 20px;
    }

    .contact{
        /deep/ .el-input{
            width:50%;
        }
    }

    .submit{
        margin: 50px auto;
        display: block;
        width:250px;
        height:50px;
    }
</style>