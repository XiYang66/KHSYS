<template>
    <div class="taskManage">
        <!-- <el-row class="title1 row0">
            <el-col :span="24">
                <el-divider>任务</el-divider>
            </el-col>
        </el-row> -->
        <!-- <el-row class="row row1" align="right">
            <el-col class="label col" :span="24">
                <div class="chart">
                    <div class="innerChart-canvas" id="chart-bubblechart" ref="dom_chart_bubblechart"
                        style="background-color: rgb(91, 91, 169);">
                    </div>
                </div>
            </el-col>
        </el-row> -->
        <el-row>
            <el-col :span="24" class="table">
                <el-table :data="tableData" style="width: 100%" height="100%" stripe
                    :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
                    <el-table-column fixed prop="index" label="序号" width="50" />
                    <el-table-column prop="type" label="任务类型" width="100" />
                    <el-table-column prop="start" label="起始时间" width="100" />
                    <el-table-column prop="end" label="结束时间" width="120" />
                    <el-table-column prop="recover" label="恢复在线模式">
                        <template #default="scope">
                            <el-button  type="primary" size="small" @click.prevent="deleteRow(scope.$index)">
                                任务重伤
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import * as echarts from 'echarts';
// import createChartAt from '@/utils/createChartAt.js'
import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
} from '@element-plus/icons-vue'

const dict = {
    1: '指令上注',
    2: '载荷开机',

}
const tableData = ref([
    {
        index: 1,
        type: dict['1'],
        start: "2022-01-01 24:04:45:511",
        end: "2022-01-02 5:04:45:313",
        recover: "1"
    },
    {
        index: 2,
        type: dict['2'],
        start: "2022-02-01 24:04:45:511",
        end: "2022-02-02 5:04:45:313",
        recover: "2"
    },
    {
        index: 3,
        type: dict['2'],
        start: "2022-03-01 24:04:45:511",
        end: "2022-03-02 5:04:45:313",
        recover: "3"
    },
    {
        index: 4,
        type: dict['2'],
        start: "2022-04-01 24:04:45:511",
        end: "2022-03-02 5:04:45:313",
        recover: "4"
    },
    {
        index: 5,
        type: dict['2'],
        start: "2022-05-01 24:04:45:511",
        end: "2022-05-02 5:04:45:313",
        recover: "5"
    },
    {
        index: 6,
        type: dict['2'],
        start: "2022-06-01 24:04:45:511",
        end: "2022-06-02 5:04:45:313",
        recover: "6"
    },
    {
        index: 7,
        type: dict['2'],
        start: "2022-07-01 24:04:45:511",
        end: "2022-07-02 5:04:45:313",
        recover: "7"
    }
])





const dom_chart_bubblechart = ref()
onMounted(() => {
    // createChartAt("chart-bubblechart", 'bubblechart')
})




const createChartAt = (idOrDom, type) => {
    if (typeof type != 'string') return
    let chartDom
    if (typeof idOrDom == 'string') {
        chartDom = document.getElementById(idOrDom);
    } else if (typeof idOrDom instanceof HTMLElement) {
        chartDom = idOrDom;
    }
    const _type = type.toLowerCase()
    let myChart = echarts.init(chartDom);
    let option
    _type === 'bubblechart' && (option = bubbleChartOption());
    option && myChart.setOption(option);
};

const bubbleChartOption = () => {
    const data = [
        // [开始时间，结束时间，任务类型（数字表示），任务名称，时间（年份或具体时间）]
        [1609459200000, 1612137600000, 1, '指令上注', '2021-01-01'],
        [1612137600000, 1614556800000, 2, '载荷开机', '2021-02-01'],
        [1614556800000, 1617235200000, 3, '任务3', '2021-03-01'],
        [1617235200000, 1619827200000, 1, '任务4', '2021-04-01'],
        [1619827200000, 1622505600000, 2, '任务5', '2021-05-01'],
        [1622505600000, 1625097600000, 3, '任务6', '2021-06-01'],
    ];

    let option = {
        backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [
            {
                offset: 0,
                color: '#f7f8fa'
            },
            {
                offset: 1,
                color: '#cdd0d5'
            }
        ]),
        title: {
            text: 'Satellite Tasks Timeline',
            left: '5%',
            top: '3%'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                let taskInfo = params[0].data;
                return `${taskInfo[3]}<br/>开始时间: ${new Date(taskInfo[0]).toLocaleString()}<br/>结束时间: ${new Date(taskInfo[1]).toLocaleString()}`;
            }
        },
        legend: {
            right: '10%',
            top: '3%',
            data: ['Tasks']
        },
        grid: {
            left: '8%',
            top: '10%'
        },
        xAxis: {
            type: 'time',
            name: '时间',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'category',
            name: '任务类型',
            data: ['类型1', '类型2', '类型3'],  // 这里代表任务分类
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            scale: true
        },
        series: [
            {
                name: 'Tasks',
                data: data.map(d => ({
                    value: [
                        d[0],  // 任务开始时间
                        d[2] - 1, // 映射到任务类型
                        d[3],  // 任务名称
                        d[4]   // 时间点
                    ],
                    taskInfo: d  // 保存任务信息
                })),
                type: 'scatter',
                symbolSize: function (data) {
                    return Math.random() * 20 + 10;  // 随机大小或基于任务重要性调整
                },
                emphasis: {
                    focus: 'series',
                    label: {
                        show: true,
                        formatter: function (param) {
                            return param.data.taskInfo[3];  // 任务名称
                        },
                        position: 'top'
                    }
                },
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(120, 36, 50, 0.5)',
                    shadowOffsetY: 5,
                    color: function (param) {
                        const taskType = param.data.taskInfo[2];
                        if (taskType === 1) return 'rgb(251, 118, 123)';
                        if (taskType === 2) return 'rgb(129, 227, 238)';
                        return 'rgb(204, 46, 72)';
                    }
                }
            }
        ]
    };
    return option;
}

</script>


<style lang="scss" scoped>
@import '@/assets/css/_var.scss';
@import '@/assets/css/element.scss';
@import '@/assets/css/mixin.scss';

.taskManage {
    // width: $popupWidth;
    height: $popupHeight;
    background-color: $color1;
    @include scroll;

    .row0 {
        text-align: center;
        font-size: $fontSize*1.3;
        color: $color3;
        text-shadow: 0 0 5px $active-color, 0 0 5px $active-color;
        margin-top: 5px;
    }

    .row1 {
        width: 100%;
        height: 50%;
    }
}

.chart {
    height: 100%;
    width: 100%;
    margin: 0 auto;
    margin-top: 2%;
    box-shadow: inset 5px 5px 5px $color5;

    .innerChart-canvas {
        margin: 0 auto;
        width: 480px;
        height: 300px;
    }
}

.table {
    margin-top: 5%;
    width: 90%;
    font-size: 10px;
}

::v-deep .cell {
    font-size: 10px;
}
</style>


<style lang="scss">
@import '@/assets/css/element.scss';
</style>
