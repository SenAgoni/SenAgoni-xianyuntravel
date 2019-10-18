 export const state = ()=>{
     return {
         history:[]
     }
 }
 export const mutations = {
     setHistory(state,data){
         if(state.history.length != 0 && state.history.length>=5){
            // 然后就要删除超出五条的
            state.history.splice(3)
         }
        if(state.history.length!=0){
            state.history.some((v,index)=>{
                if(v.departCity !== data.departCity || v.destCity !== data.destCity){
                   // 把浏览过的数据往前面去添加 运用unshift方法
                   state.history.unshift(data);
                   return true;
                }
            })
        }else{
            state.history.unshift(data);
        }
     }
 }