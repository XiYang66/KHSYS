<template>
    <div class="rightBox">
        <div class="cjgk">
            <div class="titleBox">
                <el-image :src="titleIcon" fit="cover" lazy />
                <span>场景概括</span>
            </div>
            <div ref="cjgk" class="contentBox"></div>
        </div>
        <div class="xdll">
            <div class="titleBox">
                <el-image :src="titleIcon" fit="cover" lazy />
                <span>星地链路</span>
            </div>
            <div ref="xdll" class="contentBox">
            </div>
        </div>
        <div class="xtrz">
            <div class="titleBox">
                <el-image :src="titleIcon" fit="cover" lazy />
                <span>系统日志</span>
            </div>
            <div ref="xtrz" class="contentBox">
                <el-scrollbar>
                    <li v-for="(item) in state.xtrzList">
                        <p>{{ item.text }}</p>
                        <span>{{ item.time }}</span>
                    </li>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// 引入vue3的api
import { ref, reactive, onMounted, defineExpose } from "vue"
import * as echarts from 'echarts';
import titleIcon from '@/assets/image/titleIcon.png'
import Group from '@/assets/image/Group.png';
import LD from '@/assets/image/ld.png'
const cjgk = ref()
const xdll = ref()
const xtrz = ref()

// 定义变量
const state = reactive({
    xtrzList: [
        {
            text: '尖兵十三号01星 新增/更新！',
            time: '2024-09-12 15:33:42',
        },
        {
            text: '尖兵十三号01星 新增/更新！',
            time: '2024-09-12 15:33:42',
        },
        {
            text: '尖兵十三号01星 新增/更新！',
            time: '2024-09-12 15:33:42',
        },
        {
            text: '尖兵十三号01星 新增/更新！',
            time: '2024-09-12 15:33:42',
        },
        {
            text: '尖兵十三号01星 新增/更新！',
            time: '2024-09-12 15:33:42',
        },
        {
            text: '尖兵十三号01星 新增/更新！',
            time: '2024-09-12 15:33:42',
        },
        {
            text: '尖兵十三号01星 新增/更新！',
            time: '2024-09-12 15:33:42',
        },
        {
            text: '尖兵十三号01星 新增/更新！',
            time: '2024-09-12 15:33:42',
        },
        {
            text: '尖兵十三号01星 新增/更新！',
            time: '2024-09-12 15:33:42',
        },
        {
            text: '尖兵十三号01星 新增/更新！',
            time: '2024-09-12 15:33:42',
        },
        {
            text: '尖兵十三号01星 新增/更新！',
            time: '2024-09-12 15:33:42',
        }
    ]
})

// 生命周期
onMounted(() => {
    initCjgk()
    initXdll()
})
// 定义方法
const initCjgk = () => {
    let chart = echarts.init(cjgk.value);
    // 把配置和数据放这里
    let chartData = [
        [0, 20, 333, 0],
        ['AAA', 'BBB', 'CCC', 'DDD'],
    ];
    let getmydmc = chartData[1]; //数据点名称
    let getmyd = chartData[0]; //收入金额
    let getmydzd = [];

    let big = 0;
    getmyd.forEach((el) => {
        if (!(el === undefined || el === '' || el === 0)) {
            if (big < Number(el)) {
                big = Number(el);
            }
        } else {
            big = 100;
        }
    });
    for (let i = 0; i < getmyd.length; i++) {
        getmydzd.push(big * 4);
    }
    //计算最大值
    function calMax(arr) {
        let max = 0;
        arr.forEach((el) => {
            el.forEach((el1) => {
                if (!(el1 === undefined || el1 === '' || el1 === 0)) {
                    if (max < Number(el1)) {
                        max = Number(el1);
                    }
                } else {
                    max == 100;
                }
            });
        });
        let maxint = Math.ceil(max / 9.5);
        //不让最高的值超过最上面的刻度
        let maxval = maxint * 10;
        //让显示的刻度是整数
        return maxval;
    }

    const max = Math.ceil(calMax([getmyd]) / 10) * 10;

    let option = {
        backgroundColor: '',
        grid: {
            left: '1%',
            right: '0%',
            bottom: '0%',
            top: '5%',
            // containLabel: true,
        },
        tooltip: {
            formatter: (params) => {
                if (params.name !== '') {
                    return params.name + ' : ' + getmyd[params.dataIndex];
                }
            },
            textStyle: {
                align: 'left',
            },
        },
        xAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: false,
                    color: '#fff',
                    formatter: function (val) {
                        return val + '';
                    },
                    textStyle: {
                        fontSize: '13',
                    },
                },
                min: 0,
                max: max, // 计算最大值
                interval: max / 5, //  平均分为5份
                splitNumber: 5,
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#fff',
                    },
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#fff',
                        width: 1,
                        opacity: 0.3,
                    },
                },
                axisTick: {
                    show: false,
                },
            },
            {
                type: 'value',
                axisLabel: {
                    show: false,
                },
                min: 0,
                max: max, // 计算最大值
                interval: max / 10, //  平均分为5份
                splitNumber: 10,
                splitLine: {
                    show: false,
                    lineStyle: {
                        type: 'dashed',
                        color: '#D8D8D8',
                    },
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#fff',
                    },
                },
                axisTick: {
                    show: false,
                },
            },
        ],
        yAxis: [
            {
                inverse: false,
                data: getmydmc,
                axisLabel: {
                    padding: [0, 0, 20, -10],
                    inside: true,
                    textStyle: {
                        fontSize: 14,
                        fontFamily: 'PingFang SC',
                        fontWeight: 400,
                        color: '#d2d2d2',
                        align: 'left',
                        textShadowColor: '#00d6ff',
                        textShadowOffsetX: 0,
                        textShadowOffsetY: 0,
                        textShadowBlur: 5,
                    },
                    formatter: '{value}\n{a|占位}',
                    rich: {
                        a: {
                            color: 'transparent',
                            lineHeight: 30,
                            fontFamily: 'digital',
                            fontSize: 14,
                        },
                    },
                },
                // offset: 0,
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
            },

            {
                //左侧柱状图的Y轴
                gridIndex: 0, //y轴所在的 grid 的索引
                splitLine: 'none',
                axisTick: 'none',
                axisLine: 'none',
                data: getmyd,
                inverse: false,
                axisLabel: {
                    show: true,
                    verticalAlign: 'bottom',
                    align: 'right',
                    padding: [0, 10, 18, 0],
                    textStyle: {
                        color: '#fff',
                        fontSize: '14',
                    },
                    formatter: function (value) {
                        return '{x|' + value + '}';
                        // return '{x|' + value + '}  {y|' + '%}';
                    },
                    rich: {
                        y: {
                            color: '#3dffef',
                            fontFamily: 'Orbitron',
                            fontSize: 14,
                        },
                        x: {
                            color: '#3dffef',
                            fontFamily: 'Orbitron',
                            fontSize: 14,
                        },
                    },
                },
            },
        ],
        dataZoom: [
            {
                type: 'inside',
                show: true,
                height: 15,
                start: 1,
                end: 100,
                orient: 'vertical',
                zlevel: 66,
            },
        ],
        series: [
            {
                name: '值',
                type: 'bar',
                // barGap: '100%',
                padding: 10,
                // zlevel: 1,
                xAxisIndex: 0,
                label: {
                    show: false,
                    position: 'right',
                    textStyle: {
                        color: '#fff',
                        fontSize: 14,
                    },
                },
                itemStyle: {
                    normal: {
                        borderRadius: 0,
                        color: {
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#46B7ED', // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: '#48EDD3', // 100% 处的颜色
                                },
                            ],
                        },
                    },
                },
                barWidth: 18,
                data: getmyd,
                z: 0,
            },
            {
                // 分隔
                type: 'pictorialBar',
                symbolRotate: '-25',
                itemStyle: {
                    normal: {
                        color: 'rgba(1, 12, 38, 0.4)',
                    },
                },
                symbolRepeat: 'fixed',
                symbolMargin: 6,
                symbol: 'rect',
                symbolClip: true,
                symbolSize: [5, 22],
                symbolPosition: 'start',
                symbolOffset: [0, -2],
                data: getmyd,
                z: 66,
                animationEasing: 'elasticOut',
            },
            {
                name: '背景',
                type: 'bar',
                barWidth: 24,
                barGap: '-118%',
                data: getmydzd,
                itemStyle: {
                    normal: {
                        color: 'rgba(5,59,113,0.7)',
                        borderRadius: 0,
                        // borderColor: 'rgba(0, 255, 236, 1)',
                        borderColor: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: '#015EFE', // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: '#10C2E8', // 100% 处的颜色
                                },
                            ],
                            false
                        ),
                    },
                },
                z: -1,
            },
            {
                type: 'pictorialBar',
                name: '左内边框',
                symbol: 'rect',
                symbolSize: [3, 22],
                symbolOffset: [0, -2],
                animation: false,
                // symbolKeepAspect: true,
                // animationEasing: 'none',
                itemStyle: {
                    normal: {
                        color: 'rgba(5,59,113,1)',
                    },
                    opacity: 1,
                },
                z: 99,
                data: new Array(getmyd.length).fill(1),
            },
        ],
    };

    chart.setOption(option);
    window.onresize = function () {
        //自适应大小
        chart.resize();
    };
};
const initXdll = () => {
    let chart = echarts.init(xdll.value);
    var treeData = [
        {
            ID: 0,
            NAME: '根节点',
            children: [
                {
                    ID: 1,
                    NAME: '子节点1',
                },
                {
                    ID: 5972,
                    NAME: '子节点2',
                },
                {
                    ID: 3,
                    NAME: '子节点3',
                },
                {
                    ID: 4,
                    NAME: '子节点4',
                },
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

    chart.setOption(option);
    window.onresize = function () {
        //自适应大小
        chart.resize();
    };
};


//暴露方法
defineExpose({})
</script>

<style lang="scss" scoped>
.rightBox {
    pointer-events: auto;
    width: 320px;
    height: 98%;
    float: right;
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;

    .cjgk {
        width: 100%;
        height: 33%;
    }

    .xdll {
        width: 100%;
        height: 25%;
    }

    .xtrz {
        width: 100%;
        height: 40%;

        li {
            cursor: pointer;

            p {
                font-family: Source Han Sans CN;
                font-size: 14px;
                color: #fff;
            }

            span {
                color: rgba(255, 255, 255, 0.5);
                font-size: 12px;
            }

            &.active,
            &:hover {
                background: rgba(95, 153, 221, 0.2);

                p,
                span {
                    color: rgba(21, 136, 243, 1);
                }
            }
        }
    }
}
</style>