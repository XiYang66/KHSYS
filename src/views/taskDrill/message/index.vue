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

                    <el-input v-model="state.textarea" :rows="7.5" disabled type="textarea"
                        placeholder="Please input" />
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
                        <el-descriptions-item label="探测到目标：">XXXX</el-descriptions-item>
                    </el-descriptions>

                    <el-divider>目标名称</el-divider>
                
                    <el-tabs v-model="state.activeName" type="card">
                        <el-tab-pane label="电子特性参数" name="first">
                            <el-descriptions :column="1">
                                <el-descriptions-item label="目标雷达类型："> XXXXXXX</el-descriptions-item>
                                <el-descriptions-item label="探测经纬高："> XXXXXXX</el-descriptions-item>
                                <el-descriptions-item label="定位精度(m)："> XXXXXXX</el-descriptions-item>
                                <el-descriptions-item label="置信度(%)：">XXXXXXX </el-descriptions-item>
                                <el-descriptions-item label="到达时间："> XXXXXXX</el-descriptions-item>
                                <el-descriptions-item label="脉宽(us)："> XXXXXXX</el-descriptions-item>
                                <el-descriptions-item label="脉幅(dbm)：">XXXXXXX </el-descriptions-item>
                                <el-descriptions-item label="载频(MHz)："> XXXXXXX</el-descriptions-item>
                                <el-descriptions-item label="方位角(°)：">XXXXXXX </el-descriptions-item>
                                <el-descriptions-item label="俯仰(°)：">XXXXXXX </el-descriptions-item>
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
import { ref, reactive, onMounted, defineExpose, nextTick } from "vue"
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
    var data = [
        {
            name: "数据中心",
            symbol: `image://` + Group,
            symbolSize: [100, 100],
            value: [170, 200],
            x: 300,
            y: 400,

        },
        {
            name: "分数据中心一",
            x: 400,
            y: 400,
            symbol: `image://` + LD,
            symbolSize: [60, 60],
            value: [400, 400],

        },
        {
            name: "分数据中心二",
            x: 400,
            y: 400,
            symbol: `image://` + LD,
            value: [10, 380],
            symbolSize: [60, 60],

        },
        {
            name: "分数据中心三",
            x: 400,
            y: 400,
            value: [10, 10],
            symbol: `image://` + LD,
            symbolSize: [60, 60],

        },
    ];

    let option = ({
        xAxis: {
            show: false,
            type: "value"
        },
        yAxis: {
            show: false,
            type: "value"
        },
        tooltip: {
            show: false
        },
        series: [
            {
                type: "graph",
                zlevel: 5,
                draggable: false,
                coordinateSystem: "cartesian2d", //使用二维的直角坐标系（也称笛卡尔坐标系）
                label: {
                    normal: {
                        show: true
                    }
                },
                data: data,
                links: [
                    {
                        source: "数据中心",
                        target: "分数据中心一"
                    },
                    {
                        source: "数据中心",
                        target: "分数据中心二"
                    },
                    {
                        source: "数据中心",
                        target: "分数据中心三"
                    }

                ],
                lineStyle: {
                    normal: {
                        opacity: 1,
                        color: "#53B5EA",
                        curveness: 0.2,
                        width: 2
                    }
                }
            },
            {
                type: "lines",
                coordinateSystem: "cartesian2d",
                z: 1,
                zlevel: 2,
                animation: false,
                effect: {
                    show: true,
                    period: 8,
                    trailLength: 0.01,
                    symbolSize: 12,
                    symbol: "pin",
                    loop: true,
                    color: "rgba(55,155,255,0.5)"
                },
                lineStyle: {
                    normal: {
                        color: "#22AC38",
                        width: 0,
                        curveness: 0.2
                    }
                },

                data: [
                    {
                        coords: [
                            [170, 200],
                            [400, 400]
                        ]
                    },
                    {
                        coords: [
                            [170, 200],
                            [10, 380]
                        ]
                    },
                    {
                        coords: [
                            [170, 200],
                            [10, 10]
                        ]
                    }
                ]
            }
        ]
    });
    chart.clear();
    chart.setOption(option);
    window.onresize = function () {
        //自适应大小
        chart.resize();
    };
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
        },

        grid: {
            left: '4%',
            right: '4%',
            bottom: '10%',
            top: '16%',
            containLabel: true,
        },
        xAxis: {
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            type: 'category',
            boundaryGap: false,
            axisLine: {
                symbol: 'none',
                lineStyle: {
                    color: '#50637A',
                },
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                interval: 0,
                color: '#6071A9',
                fontSize: 12,
                padding: [10, 0, 0, 0],
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#6071A9',
                fontSize: 12,
                padding: [0, 10, 0, 0],
            },
            splitLine: {
                lineStyle: {
                    color: '#50637A',
                    type: 'dashed',
                },
            },
        },
        series: [{
            name: '产值',
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
            name: '增加值',
            data: [1, 2, 3, 4, 7, 6, 7, 8, 4, 10],
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
            name: '流入',
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
            name: '流出',
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
        },

        grid: {
            left: '4%',
            right: '4%',
            bottom: '10%',
            top: '16%',
            containLabel: true,
        },


        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                symbol: 'none',
                lineStyle: {
                    color: '#50637A',
                },
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                interval: 0,
                color: '#6071A9',
                fontSize: 12,
                padding: [10, 0, 0, 0],
            },
            data: nameArr
        }],
        yAxis: [{
            type: 'value',
            axisLabel: {
                color: '#6071A9',
                fontSize: 12,
                padding: [0, 10, 0, 0],
            },
            splitLine: {
                lineStyle: {
                    color: '#50637A',
                    type: 'dashed',
                },
            },
        }],
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
        },

        grid: {
            left: '4%',
            right: '4%',
            bottom: '10%',
            top: '16%',
            containLabel: true,
        },


        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                symbol: 'none',
                lineStyle: {
                    color: '#50637A',
                },
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                interval: 0,
                color: '#6071A9',
                fontSize: 12,
                padding: [10, 0, 0, 0],
            },
            data: xLabel
        }],
        yAxis: [{
            type: 'value',
            axisLabel: {
                color: '#6071A9',
                fontSize: 12,
                padding: [0, 10, 0, 0],
            },
            splitLine: {
                lineStyle: {
                    color: '#50637A',
                    type: 'dashed',
                },
            },
        }],
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
    let xLabel = ['2021.07.26', '2021.07.27', '2021.07.28', '2021.07.29', '2021.07.30', '2021.07.31', '2021.08.01']
    let option = {
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
        },

        grid: {
            left: '4%',
            right: '4%',
            bottom: '10%',
            top: '16%',
            containLabel: true,
        },


        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                symbol: 'none',
                lineStyle: {
                    color: '#50637A',
                },
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                interval: 0,
                color: '#6071A9',
                fontSize: 12,
                padding: [10, 0, 0, 0],
            },
            data: xLabel
        }],
        yAxis: [{
            type: 'value',
            axisLabel: {
                color: '#6071A9',
                fontSize: 12,
                padding: [0, 10, 0, 0],
            },
            splitLine: {
                lineStyle: {
                    color: '#50637A',
                    type: 'dashed',
                },
            },
        }],
        series: [{
            name: '注册总量',
            type: 'line',
            smooth: true, //是否平滑
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbol: 'circle',
            symbolSize: 15,
            lineStyle: {
                normal: {
                    color: "#00b3f4",
                    shadowColor: 'rgba(0, 0, 0, .3)',
                    shadowBlur: 0,
                    shadowOffsetY: 5,
                    shadowOffsetX: 5,
                },
            },
            label: {
                show: true,
                position: 'top',
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
            data: ["40", "60", "22", "85", "50", "40", "42"]
        },

        ]
    };
    chart.clear();
    chart.setOption(option);
    window.onresize = function () {
        //自适应大小
        chart.resize();
    };
}
//暴露方法
defineExpose({})
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