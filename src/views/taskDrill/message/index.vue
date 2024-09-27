<template>
    <div class="message">
        <div class="titleBox">
            <el-image :src="titleIcon" fit="cover" />
            <span @click="active(1)" :class="state.active == 1 ? 'active' : ''">卫星概括</span>
            <span @click="active(2)" :class="state.active == 2 ? 'active' : ''">载荷数据</span>
            <el-icon @click="closePopup" @mouseover="state.isAnimating = true" @mouseleave="state.isAnimating = false"
                :class="state.isAnimating ? 'animate__animated animate__heartBeat' : ''">
                <CircleClose />
            </el-icon>
        </div>
        <div class="contentBox">
            <el-scrollbar>
                <div class="wxgk" v-show="state.active == 1">
                    <el-descriptions :column="1">
                        <el-descriptions-item label="载荷类型：">电子载荷</el-descriptions-item>
                        <el-descriptions-item label="卫星状态：">正常</el-descriptions-item>
                    </el-descriptions>

                    <el-divider>星地/星间链路</el-divider>
                    <div ref="LL" class="LL"></div>

                    <el-divider>任务概述</el-divider>


                    <el-descriptions :column="1">
                        <el-descriptions-item label="距下次开机任务(分钟)：">666</el-descriptions-item>
                        <el-descriptions-item label="剩余任务总时长(小时)：">11.737</el-descriptions-item>
                        <el-descriptions-item label="任务时刻表："></el-descriptions-item>
                    </el-descriptions>

                    <el-input v-model="state.textarea" :rows="7.5" disabled type="textarea" placeholder="Please input" />
                    <el-divider>主要参数</el-divider>

                    <el-descriptions :column="1">
                        <el-descriptions-item label="载荷开机状态："> <el-switch v-model="state.switch" /></el-descriptions-item>
                        <el-descriptions-item label="地影区标志：">阳照区</el-descriptions-item>
                    </el-descriptions>

                    <div ref="WX" class="WX"></div>
                    <div ref="GD" class="GD"></div>
                </div>
                <div class="zhsj" v-show="state.active == 2">

                    <el-descriptions :column="1">
                        <el-descriptions-item label="探测到目标数：">3</el-descriptions-item>
                    </el-descriptions>

                    <el-divider>目标名称</el-divider>

                    <el-tabs v-model="state.activeName" type="card">
                        <el-tab-pane label="电子特性参数" name="first">
                            <el-descriptions :column="1">
                                <el-descriptions-item label="目标雷达类型："> 警戒雷达</el-descriptions-item>
                                <el-descriptions-item label="探测经纬高："> 经-159.124*纬19.793*</el-descriptions-item>
                                <el-descriptions-item label="定位精度(m)："> 732.223</el-descriptions-item>
                                <el-descriptions-item label="置信度(%)：">90.872 </el-descriptions-item>
                                <el-descriptions-item label="到达时间：">0.007</el-descriptions-item>
                                <el-descriptions-item label="脉宽(us)：">6.4</el-descriptions-item>
                                <el-descriptions-item label="脉幅(dbm)：">-33.508 </el-descriptions-item>
                                <el-descriptions-item label="载频(MHz)：">3300</el-descriptions-item>
                                <el-descriptions-item label="方位角(°)：">0.739 </el-descriptions-item>
                                <el-descriptions-item label="俯仰(°)：">0.056</el-descriptions-item>
                            </el-descriptions>

                        </el-tab-pane>
                        <el-tab-pane label="电子特性曲线" name="second">电子特性曲线</el-tab-pane>
                    </el-tabs>
                    <el-divider>目标名称</el-divider>
                    <el-tabs v-model="state.activeName" type="card">
                        <el-tab-pane label="电子特性参数" name="first">
                            <div ref="MK" class="MK"></div>
                            <div ref="FW" class="FW"></div>
                        </el-tab-pane>
                        <el-tab-pane label="电子特性曲线" name="second">电子特性曲线</el-tab-pane>
                    </el-tabs>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script lang="ts" setup>
// 引入vue3的api
import { ref, reactive, onMounted, defineExpose, nextTick, onBeforeUnmount } from "vue"
import * as echarts from 'echarts';
import titleIcon from '@/assets/image/titleIcon.png'
import Group from '@/assets/image/Group.png';
import LD from '@/assets/image/ld.png'
import $bus from '@/utils/mitter'

// 定义变量
let state = reactive({
    active: 1,
    textarea:
        `1.载荷开机
XXXXXXXXXXXXXXXXXXXXXXXX
2.载荷开机
2024-08-24 04:12:54.968~2024-08-24 04:12:54.968
3.载荷开机
2024-08-24 04:12:54.968~2024-08-24 04:12:54.968`,
    switch: true,
    activeName: 'first',
    isAnimating: false,
});
const LL = ref()
const WX = ref()
const GD = ref()
const MK = ref()
const FW = ref()

// 生命周期
onMounted(() => {
    initEcharts()
});

// 关闭弹框
const closePopup = () => {
    $bus.emit('MessageFlag', false)
    $bus.emit('RightBoxFlag', true)
}
// 切换tab
const active = (val) => {
    state.active = val
    nextTick(() => {
        initEcharts()
    });

}
$bus.on('initEcharts', () => {
    nextTick(() => {
        initEcharts()
    });
})
/* ------------------------------- echarts渲染区 ------------------------------- */
// 渲染echarts 
const initEcharts = () => {
    initLL();
    initWX();
    initGD();

    initMK();
    initFW();
}
const initLL = () => {
    let chart = echarts.init(LL.value);
    chart.resize();
    var treeData = [
        {
            ID: 0,
            NAME: '卫星',
            children: [
                {
                    ID: 1,
                    NAME: '佳木斯站',
                },
                {
                    ID: 5972,
                    NAME: '太原站',
                },
                {
                    ID: 3,
                    NAME: '渭南站',
                },
                {
                    ID: 4,
                    NAME: ' 三亚站',
                },
                {
                    ID: 4,
                    NAME: ' 青岛站',
                }
            ]
        }
    ];
    let option = {
        series: [
            {
                type: 'tree',
                edgeShape: 'polyline', // 链接线是折现还是曲线
                orient: 'TB',
                roam: true,
                data: treeData,
                width: '85%',
                height: '75%',
                left: '5%',
                right: '5%',
                top: '12%',
                bottom: '1%',
                symbolSize: 2,
                initialTreeDepth: 10,
                label: {
                    normal: {
                        position: 0,
                        align: 'center',
                        padding: [10, 20],
                        fontWeight: 'bold',
                        formatter: function (param) {
                            let NAME =
                                param.data.NAME.substring(0, 8) +
                                '\n' +
                                param.data.NAME.substring(8, 16) +
                                '\n' +
                                param.data.NAME.substring(16);
                            if (param.data.ID === 0) {
                                return [`{rootImg|}`, `{NAME|${NAME}}`].join('\n');
                            }
                            return [`{img|}`, `{NAME|${NAME}}`].join('\n');
                        },
                        rich: {
                            rootImg: {
                                backgroundColor: {
                                    image: Group, // 替换为根节点图片路径
                                },
                                width: 40,
                                height: 40,
                            },
                            img: {
                                backgroundColor: {
                                    image: LD,
                                },
                                width: 20,
                                height: 20,
                            },
                            NAME: {
                                color: '#fff',
                                fontSize: 14,
                                opacity: 0.9,
                                verticalAlign: 'bottom',
                            },
                        },
                    },
                },
                lineStyle: {
                    color: '#3375ca',
                    width: 2,
                    opacity: 0.5,
                },
                symbol: 'none', // 去掉节点上的原点
                expandAndCollapse: true,
                animationDuration: 1500,
                animationEasing: 'cubicInOut', // 动画缓动效果
                animationDurationUpdate: 750,
            }
        ]
    };
    chart.clear();
    chart.setOption(option);
    window.onresize = function () {
        //自适应大小
        chart.resize();
    };
}

const axis = (step = 200) => ({
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        axisLabel: {
            show: false,
        },
    },
    yAxis: {
        type: 'value',
        position: 'right',
        interval: step,
        axisLine: {
            show: false,
        },
        axisTick: {
            show: true,
        },
        axisLabel: {
            show: true,
            color: '#fff',

        },
        splitLine: {
            show: false, // 隐藏网格线
        },
    },
})


// 模拟实时数据更新
// 最大展示数
const maxItems = 8;
let timer1
function getRandomData(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const dynamicChart = (chart, xLabel, res1, res2, currentZoom) => {
    timer1 = setInterval(() => {
        // 获取当前时间，模拟X轴新数据
        const now = new Date();
        const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

        // 在X轴和系列数据中推入新的数据点
        xLabel.push(time); // 新的X轴数据
        res1.push(getRandomData(80, 90)); // 新的Y轴数据 (随机值)
        res2.push(getRandomData(50, 60)); // 新的Y轴数据 (随机值)


        if (xLabel.length > maxItems) {
            xLabel.shift();
            res1.shift();
            res2.shift();
        }

        // console.log(xLabel.length, res1.length, res2.length);

        // // 动态更新图表
        chart.setOption({
            animation: true,
            // dataZoom: currentZoom,
            xAxis: {
                data: xLabel
            },
            yAxis: {
                type: 'value',
                position: 'right',
            },
            series: [
                {
                    name: 's1',
                    data: res1,
                },
                {
                    name: 's2',
                    data: res2,
                }
            ]
        }, {
            notMerge: false
        });
    }, 200);
}

const initWX = () => {

    let chart = echarts.init(WX.value);
    chart.resize();

    let xLabel = ['0', '14:20', '14:25', '14:30', '14:35', '14:40', '14:45', '14:50', '14:55', '13:00']
    let res1 = [2, 2, 2, 2, 2, 1, 1, 1, 2, 2];
    let res2 = [11, 17, 10, 12, 11, 20, 10, 15, 13, 11];
    let res3 = [12, 20, 18, 16, 17, 18, 20, 9, 11, 10];
    let res4 = [32, 18, 18, 40, 30, 35, 30, 36, 31, 33];
    let option = {
        title: {
            text: '卫星经纬高(高&Km)',
            textStyle: {
                align: 'center',
                color: '#fff',
                fontSize: 16,
            },
            top: '1%',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            textStyle: {
                align: 'left',
                color: '#fff'
            },
            backgroundColor: '#09365e', // 设置背景色
            borderColor: '#1a7bf9', // 边框颜色
            borderWidth: 1, // 边框宽度
            padding: 10, // 内边距
            extraCssText: 'box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);', // 添加阴影效果
        },
        grid: {
            left: '4%',
            right: '4%',
            bottom: '10%',
            top: '16%',
            containLabel: true,
        },
        ...axis(300),
        series: [{
            name: '经纬度',
            type: 'line',
            data: [1, 2, 3, 4, 5, 7, 7, 8, 9, 2],
            smooth: true,
            color: '#1D87F0',
            lineStyle: {
                width: 2,
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [{
                        offset: 0,
                        color: 'rgba(29, 135, 240, 0.6)',
                    },
                    {
                        offset: 0.8,
                        color: 'rgba(29, 135, 240, 0.2)',
                    },
                    ],
                    false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10,
            },
            symbol: 'circle',
            symbolSize: 6,
        },
        {
            name: '高度',
            data: [121, 225, 324, 453, 757, 623, 745, 852, 445, 105],
            type: 'line',
            smooth: true,
            color: '#00F7FF',
            lineStyle: {
                width: 2,
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [{
                        offset: 0,
                        color: 'rgba(0, 247, 255, .6)',
                    },
                    {
                        offset: 0.8,
                        color: 'rgba(0, 247, 255, .2)',
                    },
                    ],
                    false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10,
            },
            symbol: 'circle',
            symbolSize: 6,
        },
        ],
    };
    chart.clear();
    chart.setOption(option);
    window.onresize = function () {
        //自适应大小
        chart.resize();
    };
}
const initGD = () => {
    let chart = echarts.init(GD.value);
    chart.resize();

    let dataArr = [
        {
            name: 'x',
            list: [
                {
                    name: '3月',
                    value: 40
                },
                {
                    name: '4月',
                    value: 60
                },
                {
                    name: '5月',
                    value: 20
                },
                {
                    name: '6月',
                    value: 85
                },
                {
                    name: '7月',
                    value: 50
                },
                {
                    name: '8月',
                    value: 30
                }
            ]
        },
        {
            name: 'y',
            list: [
                {
                    name: '3月',
                    value: 50
                },
                {
                    name: '4月',
                    value: 40
                },
                {
                    name: '5月',
                    value: 15
                },
                {
                    name: '6月',
                    value: 50
                },
                {
                    name: '7月',
                    value: 40
                },
                {
                    name: '8月',
                    value: 30
                }
            ]
        }
    ]
    // x轴
    let nameArr = dataArr[0].list.map(it => it.name)
    // 颜色
    let colors = ['rgba(11, 255, 177, 1)', 'rgba(45, 173, 255, 1)']
    let option = {
        title: {
            text: '轨道系三轴姿态角(°)',
            textStyle: {
                align: 'center',
                color: '#fff',
                fontSize: 16,
            },
            top: '1%',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            textStyle: {
                align: 'left',
                color: '#fff'
            },
            backgroundColor: '#09365e', // 设置背景色
            borderColor: '#1a7bf9', // 边框颜色
            borderWidth: 1, // 边框宽度
            padding: 10, // 内边距
            extraCssText: 'box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);', // 添加阴影效果
        },

        grid: {
            left: '4%',
            right: '4%',
            bottom: '10%',
            top: '16%',
            containLabel: true,
        },

        ...axis(50),
        series: [{
            name: dataArr[0].name,
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            lineStyle: {
                normal: {
                    width: 2,
                    color: colors[0], // 线条颜色
                },
                borderColor: 'rgba(0,0,0,.4)',
            },
            itemStyle: {
                color: colors[0],
                borderColor: "#646ace",
                borderWidth: 0

            },
            tooltip: {
                show: true
            },
            data: dataArr[0].list.map(it => it.value)
        }, {
            name: dataArr[1].name,
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            lineStyle: {
                normal: {
                    width: 2,
                    color: colors[1], // 线条颜色
                },
                borderColor: 'rgba(0,0,0,.4)',
            },
            itemStyle: {
                color: colors[1],
                borderColor: "#646ace",
                borderWidth: 0

            },
            tooltip: {
                show: true
            },
            data: dataArr[1].list.map(it => it.value)
        }]
    };
    chart.clear();
    chart.setOption(option);
    window.onresize = function () {
        //自适应大小
        chart.resize();
    };
}
const initMK = () => {
    let chart = echarts.init(MK.value);
    chart.resize();
    let xLabel = ['12', '13', '14', '15', '16', '17', '18日']
    let valueData = [64, 112, 86, 151, 131, 118, 11]
    let option = {
        title: {
            text: '轨道系三轴姿态角(°)',
            textStyle: {
                align: 'center',
                color: '#fff',
                fontSize: 16,
            },
            top: '1%',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            textStyle: {
                align: 'left',
                color: '#fff'
            },
            backgroundColor: '#09365e', // 设置背景色
            borderColor: '#1a7bf9', // 边框颜色
            borderWidth: 1, // 边框宽度
            padding: 10, // 内边距
            extraCssText: 'box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);', // 添加阴影效果
        },

        grid: {
            left: '4%',
            right: '4%',
            bottom: '10%',
            top: '16%',
            containLabel: true,
        },


        ...axis(50),
        series: [
            {
                type: 'line',
                data: valueData,
                symbolSize: 10,
                symbol: 'circle',
                smooth: false,
                yAxisIndex: 0,
                label: {
                    "show": true,
                    "textStyle": {
                        "color": "#1a7bf9",
                        fontSize: 16,
                        fontFamily: 'DIN',
                        fontWeight: 'bold'
                    },
                    "position": "top",
                    formatter: function (p) {
                        return p.value > 0 ? (p.value) : '';
                    }
                },
                lineStyle: {
                    width: 2,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#1a7bf9'
                    },
                    {
                        offset: 1,
                        color: '#1a7bf9'
                    }
                    ]),
                    shadowColor: '#1a7bf9',
                    shadowBlur: 10,
                    shadowOffsetY: 10
                },
                itemStyle: {
                    normal: {
                        color: '#1a7bf9',
                        borderColor: '#fff',
                        borderWidth: 3,
                        shadowColor: '#1a7bf9',
                        shadowBlur: 5,
                    }
                },
                areaStyle: { //区域填充样式
                    normal: {
                        //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: "rgba(165, 170, 247, 1)"
                        },
                        {
                            offset: 0.5,
                            color: "rgba(165, 170, 247, 0.2)"
                        },
                        {
                            offset: 1,
                            color: "rgba(165, 170, 247, 0)"
                        }
                        ], false),
                        shadowBlur: 0 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                    }
                },
            }
        ]
    };
    chart.clear();
    chart.setOption(option);
    window.onresize = function () {
        //自适应大小
        chart.resize();
    };
}
const initFW = () => {
    let chart = echarts.init(FW.value);
    chart.resize();
    let xLabel = []
    const data1 = []
    const data2 = []
    let option = {
        animation: true, // 关闭所有动画效果
        dataZoom: [
            {
                type: 'slider', // 拖动条的类型
                start: 0,       // 起始位置
                end: 100,       // 结束位置，100% 表示显示所有数据
                xAxisIndex: 0,  // 表示控制X轴
            },
            {
                type: 'inside', // 内置的拖动缩放
                start: 0,
                end: 100,
                xAxisIndex: 0,
            }
        ],
        title: {
            text: '方位/俯仰角(°)',
            textStyle: {
                align: 'center',
                color: '#fff',
                fontSize: 16,
            },
            top: '1%',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            textStyle: {
                align: 'left',
                color: '#fff'
            },
            backgroundColor: '#09365e', // 设置背景色
            borderColor: '#1a7bf9', // 边框颜色
            borderWidth: 1, // 边框宽度
            padding: 10, // 内边距
            extraCssText: 'box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);', // 添加阴影效果
        },

        grid: {
            left: '4%',
            right: '4%',
            bottom: '10%',
            top: '16%',
            containLabel: true,
        },
        ...axis(50),
        series: [
            {
                name: 's1',
                type: 'line',
                smooth: true, //是否平滑
                animationDurationUpdate: 50, // 数据更新时的动画时长
                animationEasingUpdate: 'linear', // 数据更新时的动画过渡效果
                showAllSymbol: true,
                // symbol: 'image://./static/images/guang-circle.png',
                symbol: 'circle',
                symbolSize: 2,
                lineStyle: {
                    normal: {
                        color: "red",
                        shadowColor: 'rgba(0, 0, 0, .3)',
                        shadowBlur: 0,
                        shadowOffsetY: 5,
                        shadowOffsetX: 5,
                    },
                },
                label: {
                    show: false,
                    position: 'bottom',
                    textStyle: {
                        color: '#00b3f4',
                    }
                },
                itemStyle: {
                    color: "#00b3f4",
                    borderColor: "#fff",
                    borderWidth: 3,
                    shadowColor: 'rgba(0, 0, 0, .3)',
                    shadowBlur: 0,
                    shadowOffsetY: 2,
                    shadowOffsetX: 2,
                },
                tooltip: {
                    show: false
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0,179,244,0.3)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(0,179,244,0)'
                        }
                        ], false),
                        shadowColor: 'rgba(0,179,244, 0.9)',
                        shadowBlur: 20
                    }
                },
                data: data1
            },
            {
                name: 's2',
                type: 'line',
                smooth: true, //是否平滑
                animationDurationUpdate: 50, // 数据更新时的动画时长
                animationEasingUpdate: 'linear', // 数据更新时的动画过渡效果
                showAllSymbol: true,
                // symbol: 'image://./static/images/guang-circle.png',
                symbol: 'circle',
                symbolSize: 2,
                lineStyle: {
                    normal: {
                        color: "blue",
                        shadowColor: 'rgba(0, 0, 0, .3)',
                        shadowBlur: 0,
                        shadowOffsetY: 5,
                        shadowOffsetX: 5,
                    },
                },
                label: {
                    show: false,
                    position: 'bottom',
                    textStyle: {
                        color: '#00b3f4',
                    }
                },
                itemStyle: {
                    color: "#00b3f4",
                    borderColor: "#fff",
                    borderWidth: 3,
                    shadowColor: 'rgba(0, 0, 0, .3)',
                    shadowBlur: 0,
                    shadowOffsetY: 2,
                    shadowOffsetX: 2,
                },
                tooltip: {
                    show: false
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0,179,244,0.3)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(0,179,244,0)'
                        }
                        ], false),
                        shadowColor: 'rgba(0,179,244, 0.9)',
                        shadowBlur: 20
                    }
                },
                data: data2
            },
        ]
    };
    chart.clear();
    chart.setOption(option);
    window.onresize = function () {
        //自适应大小
        chart.resize();
    };
    // 获取当前 dataZoom 状态
    const currentZoom = chart.getOption().dataZoom;
    dynamicChart(chart, xLabel, data1, data2, currentZoom)
}
//暴露方法
defineExpose({})

onBeforeUnmount(() => {
    clearInterval(timer1)
})
</script>

<style lang="scss" scoped>
.message {
    width: 320px;
    height: 98%;
    position: absolute;
    right: 0px;
    top: 0;
    pointer-events: auto;

    .titleBox {
        span {
            text-shadow: none;
            cursor: pointer;
            color: rgba(255, 255, 255, 0.5);

            &.active {
                text-shadow: 0 0 10px #158EFF, 0 0 20px #158EFF, 0 0 30px #158EFF, 0 0 40px #158EFF;
                color: #FFFFFF;
            }
        }
    }

    .LL,
    .WX,
    .GD,
    .MK,
    .FW {
        width: 100%;
        height: 200px;
    }
}
</style>