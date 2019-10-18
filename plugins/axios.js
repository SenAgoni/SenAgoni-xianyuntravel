/**
 * 此文件用于捕捉错误信息 这里要单独引入提示信息，因为这样子就能够使用message消息提示的方法
 */
import { Message } from 'element-ui';
export default ({$axios,redirect})=>{
    $axios.onError(err=>{
        // 这里是一个错误的请求的拦截器，只要请求发生错误就会触发这一个方法 response就是一个拦截的信息
        if(err.response.status === 400){
            Message.error(err.response.data.message);
            return;
        }
        if([401,403].indexOf(err.response.status) > -1){
            Message.error("请先登录");
            redirect('/user/login')
            return;
        }
    })
}