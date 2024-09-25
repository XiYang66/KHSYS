<template>
    <div class="popup-statellite-descriptions">
        <div class="main" v-for="(desc, INDEX) in layout">
            <el-descriptions :column="desc.column" :size="size" :style="blockMargin" border style="margin-top: 0;"
                :key="INDEX" :class="{ 'popup-statellite-description0': INDEX == 0 }">
                <template #title>
                    <div class=" descrTitle">
                        <span>{{ desc.title }}</span>
                    </div>
                </template>
                <el-descriptions-item v-for="(item, index) in desc.items" :span="item.span" align="right">
                    <template #label>
                        <div class="label-item" :class="{ 'label-item-0': INDEX == 0 }">
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
</script>


<style lang="scss">
@import '@/assets/css/_var.scss';
@import '@/assets/css/mixin.scss';


.descrTitle {
    color: $color3;
    font-size: $fontSize;
}

.label-item {
    color: $color3;
    width: 100px;
    font-size: $fontSize;
    height: $textHeight;
    line-height: $textHeight;
}

.label-item-0 {
    width: 60px;
}

.content-item {
    color: $color3;
    font-size: $fontSize;
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
</style>
