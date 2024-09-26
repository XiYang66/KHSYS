<template>
    <div class="breakdown">
        <div class="main" v-for="(item, INDEX) in layout">
            <el-row class="title row" :gutter="gutter">
                <el-col :span="24">{{ item.title }}</el-col>
            </el-row>
            <el-row class="text row" :gutter="gutter" align="right">
                <el-col class="content col" :span="24">
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
@import '@/assets/css/_var.scss';

.breakdown {
    width: $popupWidth;
    height: calc(#{$popupHeight} - #{$popupHeadHeight}*1.5);
    font-family: 'Source Han Sans CN';
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    background-color: $color1;
    overflow-y: scroll;

    /* 应用于特定元素的滚动条样式 */
    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: $color5;
    }

    &::-webkit-scrollbar-track {
        background-color: $color1;
    }
}



.title {
    background-color: $color2;
    height: 28px;
    line-height: 28px;
    color: $color3
}

.text {
    padding: 10px;
}
</style>

