<template>
    <div class="descriptions">
        <div class="main" v-for="(desc, INDEX) in layout">
            <el-descriptions :column="desc.column" :size="size" :style="blockMargin" border style="margin-top: 0;"
                :key="INDEX" :class="{ 'description0': INDEX == 0 }">
                <template #title>
                    <div class=" descrTitle">
                        <span>{{ desc.title }}</span>
                    </div>
                </template>
                <el-descriptions-item v-for="(item, index) in desc.items" :span="item.span" align="right">
                    <template #label>
                        <div class="label-item" :class="{ 'label-item0': INDEX == 0 }">
                            {{ item.label }}
                        </div>
                    </template>
                    <div class="content-item" v-if="item.content">{{ item.content }}
                        <div class="btn" v-if="item.btn">
                            <el-button class="btn1">{{ item.btn }}</el-button>
                        </div>
                    </div>
                </el-descriptions-item>
            </el-descriptions>
            <el-row v-if="desc.title == '控制'">
                <el-col :span="6">
                    <el-button type="success" :icon="Check" circle size="small" />
                    轨迹线显隐
                </el-col>
                <el-col :span="12">
                    <el-button type="success" :icon="Check" circle size="small" />
                    标签显隐
                </el-col>
            </el-row>
        </div>
    </div>
    <!-- <div class="descriptions2" >
        <el-row class="title1 row" :gutter="gutter">
            <el-col :span="24">属性</el-col>
        </el-row>
        <el-row class="name row" :gutter="gutter" align="right">
            <el-col class="label col" :span="3">
                卫星名称
            </el-col>
            <el-col class="content col" :span="21">{{ info.name }}</el-col>
        </el-row>
        <el-row class="norad-id" :gutter="gutter">
            <el-col class="label col" :span="3">Norad-ID</el-col>
            <el-col class="content col" :span="21">{{ info.noradId }}</el-col>
        </el-row>
        <el-row class="type" :gutter="gutter">
            <el-col class="label col" :span="3">载荷类型</el-col>
            <el-col :span="9">{{ info.type }}</el-col>
            <el-col class="label col" :span="3">国家</el-col>
            <el-col class="content col" :span="9">{{ info.country }}</el-col>
        </el-row>
        <el-row class="tle1" :gutter="gutter">
            <el-col class="label col" :span="3">TLE-1</el-col>
            <el-col class="content col" :span="21">{{ info.tle1 }}</el-col>
        </el-row>
        <el-row class="tle2" :gutter="gutter">
            <el-col class="label col" :span="3">TLE-2</el-col>
            <el-col class="content col" :span="21">{{ info.tle2 }}</el-col>
        </el-row>
        <el-row class="title2" :gutter="gutter">
            <el-col class="label col" :span="24">状态</el-col>
        </el-row>
        <el-row class="status" :gutter="gutter">
            <el-col class="label col" :span="3">卫星状态</el-col>
            <el-col class="content col" :span="1">{{ info.status }}</el-col>
            <el-col :span="3">
                <el-button class="btn-wrong" style="width: 50px;height: 20px;font-size: 10px;">故障说明</el-button>
            </el-col>
        </el-row>
        <el-row class="position" :gutter="gutter">
            <el-col class="label col" :span="3">惯性系位置(Km)</el-col>
            <el-col class="content col" :span="21">{{ info.position }}</el-col>
        </el-row>
        <el-row class="velocity" :gutter="gutter">
            <el-col class="label col" :span="3">惯性系速度(Km/s)</el-col>
            <el-col class="content col" :span="21">{{ info.velocity }}</el-col>
        </el-row>
        <el-row class="zitaiAngle" :gutter="gutter">
            <el-col class="label col" :span="3">本体系姿态角(312)</el-col>
            <el-col :span="21">{{ info.zitaiAngle }}</el-col>
        </el-row>
        <el-row class="daoyinlv" :gutter="gutter">
            <el-col class="label col" :span="3">姿态角导引律(312)</el-col>
            <el-col class="content col" :span="21">{{ info.daoyinlv }}</el-col>
        </el-row>
        <el-row class="switch" :gutter="gutter">
            <el-col class="label col" :span="3">载荷开关机</el-col>
            <el-col class="content col" :span="21">{{ info.switch ? '开机' : '关机' }}</el-col>
        </el-row>
    </div> -->
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
} from '@element-plus/icons-vue'

const gutter = ref(0);//折叠项间距
const collapsedNames = ref([])

const size = ref('default')
const blockMargin = computed(() => {
    const marginMap = {
        large: '32px',
        default: '28px',
        small: '24px',
    }
    return {
        marginTop: marginMap[size.value] || marginMap.default,
    }
})

const layout = [
    {
        title: '属性',
        column: 2,
        items: [
            {
                label: '卫星名称',
                span: 3,
                content: '尖兵十三号03星',

            },
            {
                label: 'Norad-ID',
                span: 3,
                content: '99906',

            },
            {
                label: '载荷类型',
                span: 1,
                content: 'SAR',

            },
            {
                label: '国家',
                span: 1,
                content: '中国',

            },
            {
                label: 'TLE-1',
                span: 3,
                content: '1 99906U          21236 00000000   00004175 0000-0  52744-3  0',

            },
            {
                label: 'TLE-2',
                span: 3,
                content: '2 99906U          21236 00000000   00004175 0000-0  52744-3  0',

            }
        ]
    },
    {
        title: '状态',
        column: 3,
        items: [
            {
                label: '卫星状态',
                span: 3,
                content: '正常',
                btn: '故障说明',
            },
            {
                label: '惯性系位置(Km)',
                span: 3,
                content: '(-1275.93, -3747.65, 5683.59)',
            },
            {
                label: '惯性系速度(Km/s)',
                span: 3,
                content: '(0.20,6.31,4.20)',
            },
            {
                label: '本体系姿态角(312)',
                span: 3,
                content: '(00.0, 00.0, 00.0)',

            },
            {
                label: '姿态角导引律(312)',
                span: 3,
                content: '(00.0, 00.0, 00.0)',

            },
            {
                label: '载荷开关机',
                span: 3,
                content: '关机',

            }

        ]
    },
    {
        title: '控制',
        column: 3,
        items: []
    }

]

// const info = {
//     name: '尖兵十三号03星',
//     noradId: '99906',
//     type: 'SAR',
//     country: '中国',
//     tle1: '1 99906U 21236 0000000 00004175 00000-0 52744-3 0',
//     tle2: '1 99906U 21236 0000000 00004175 00000-0 52744-3 0',
//     status: '正常',
//     position: '(-1275.93, -3747.65, 5683.59)',
//     velocity: '(0.20,6.31,4.20)',
//     daoyinlv: '(00.0, 00.0, 00.0)',
//     zitaiAngle: '(00.0, 00.0, 00.0)',
//     switch: false,
// }
</script>


<style lang="scss" scoped>
$color1: gray;
$color2: #0E5894;
$color3: white;

.content {
    background-color: aquamarine;
}

.label.col {
    text-align: right;
    padding-left: 0;
    margin-left: 0px;
}

.label-item {
    color: $color3;
    width: 100px;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
}

.label-item0 {
    width: 60px;
}

.content-item {
    color: $color3;
    font-size: 12px;
    background-color: $color2;
    text-align: left;
    position: relative;

    .btn {
        position: absolute;
        top: -1px;
        right: 0;
        background-color: $color1;
        width: 60px;
        height: 25px;
        text-align: center;

        .btn1 {
            width: 50px;
            height: 20px;
            font-size: 10px;
        }
    }
}

.descrTitle {
    color: $color3;
    font-size: 12px;
}
</style>
<style lang="scss">
$color1: gray;
$color2: #0E5894;
$color3: white;

.descriptions {
    padding: 5px 10px;
    background-color: $color1;
    width: 480px;
    // height: 550px;
    font-family: 'Source Han Sans CN';
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;

    // overflow: scroll;

    .el-descriptions {
        width: 100%;
        height: 30%;

        .el-descriptions__header {
            margin: 0;

            .el-descriptions__title {
                width: 100%;
            }
        }

        // .el-descriptions__header__body {
        //     .el-descriptions__table.is-bordered {
        //         .el-descriptions__cell.el-descriptions__label.is-bordered-label.is-right {
        //             border: 1px solid #276989 !important;
        //             .label-item {
        //                 color: white;
        //             }
        //         }
        //         .el-descriptions__cell.el-descriptions__content.is-bordered-content.is-right {
        //             .content-item {}
        //         }
        //     }
        // }
    }



    .el-descriptions__body .el-descriptions__table.is-bordered .el-descriptions__cell {
        border: 1px solid #276989 !important;
    }


    .el-descriptions__title {
        background-color: $color2;
        width: 100%;
        height: 28px;
        line-height: 28px;
    }

    .el-descriptions__cell.el-descriptions__label.is-bordered-label.is-right {
        width: 100px !important
    }
}

.description0 {

    // background-color: red;
    .el-descriptions__cell.el-descriptions__label.is-bordered-label.is-right {
        width: 80px !important
    }
}
</style>

