/**
 * @desc 封装计算来回时间的方法
 * @params
 */
export function rankTime(arr_time,dep_time){
            const arrTime = arr_time.split(":");
            const depTime = dep_time.split(":");
            // 两个时间相减需要转换成分钟数再来算取时和分 获取到的是一个字符串，所以需要转换数据类型
            let end = arrTime[0] * 60 + +arrTime[1]
            // 开始时间
            const start = depTime[0] * 60 + +depTime[1]
            // 结束时间减去开始时间
            // 到达时间
            if(end - start < 0){
                end += (24 * 60);
            }
           const hh = Math.floor((end - start) / 60);
           const mm = (end - start) % 60;
           return hh+"小时"+mm + "分钟"
}