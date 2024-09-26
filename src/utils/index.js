
/* --------------------------------- 常用的公共函数 -------------------------------- */

// 获取当前时间
export const getDateTime = () => {
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    let currentDate = new Date();
    let year = currentDate.getFullYear(); // 获取年份
    let month = currentDate.getMonth() + 1; // 获取月份（注意需要加1，因为月份从0开始）
    let day = currentDate.getDate(); // 获取日期
    // 获取时
    let hours = currentDate.getHours()
    // 获取分
    let minutes = currentDate.getMinutes()
    // 获取秒
    let seconds = currentDate.getSeconds()
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    // 输出当前日期
    return {
        date: `${year}年${month}月${day}日`,
        time: `${hours}:${minutes}:${seconds}`,
        week: `星期${weekDays[currentDate.getDay()]}`
    }
}
