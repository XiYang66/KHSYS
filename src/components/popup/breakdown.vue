<template>
    <div class="descriptions">
        <div class="main" v-for="(item, INDEX) in layout">
            <el-row class="title1 row" :gutter="gutter">
                <el-col :span="24">{{ item.title }}</el-col>
            </el-row>
            <el-row class="name row" :gutter="gutter" align="right">
                <el-col class="label col" :span="24">
                    {{ item.content }}
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
        title: '系统极故障',
        content: "由于整星能源故障、遥测控天线故障、物理损毁等原因导致的整星故障状态。系统极故障状态下，卫星系统完全不受地面监控。"
    },
    {
        title: '轨控单机故障',
        content: "由于整星能源故障、遥测控天线故障、物理损毁等原因导致的整星故障状态。系统极故障状态下，卫星系统完全不受地面监控。"
    },
    {
        title: '姿控单机故障',
        content: "由于整星能源故障、遥测控天线故障、物理损毁等原因导致的整星故障状态。系统极故障状态下，卫星系统完全不受地面监控。"
    },
    {
        title: '能源单机故障',
        content: "由于整星能源故障、遥测控天线故障、物理损毁等原因导致的整星故障状态。系统极故障状态下，卫星系统完全不受地面监控。"
    },
    {
        title: '结构单机故障',
        content: "由于整星能源故障、遥测控天线故障、物理损毁等原因导致的整星故障状态。系统极故障状态下，卫星系统完全不受地面监控。"
    },
    {
        title: '载荷故障',
        content: "由于整星能源故障、遥测控天线故障、物理损毁等原因导致的整星故障状态。系统极故障状态下，卫星系统完全不受地面监控。"
    },
    {
        title: '协议故障',
        content: "由于整星能源故障、遥测控天线故障、物理损毁等原因导致的整星故障状态。系统极故障状态下，卫星系统完全不受地面监控。"
    },
    {
        title: '元器件故障',
        content: "由于整星能源故障、遥测控天线故障、物理损毁等原因导致的整星故障状态。系统极故障状态下，卫星系统完全不受地面监控。"
    },
]
</script>


<style lang="scss" scoped>
$color1: gray;
$color2: #0E5894;
$color3: white;
</style>


<style lang="scss" scoped>
$color1: gray;
$color2: #0E5894;
$color3: white;


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
</style>

