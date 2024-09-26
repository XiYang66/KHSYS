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
        content: "轨控单机主要用于执行轨道维持与轨道机动任务。轨控单机故障后：无法有效执行任务规划的轨道控制任务，即无法或难以正常实现轨道维持与轨道机动任务。。"
    },
    {
        title: '姿控单机故障',
        content: "姿控单机主要用于执行整星姿态机动任务。姿控单机故障影响后无法有效执行任务规划的调姿任务，即无法或难以正常实现调整卫星姿态以确保载荷对目标的有效覆盖。"
    },
    {
        title: '能源单机故障',
        content: "能源单机主要用于实现对电源系统的储存与管理功能。能源单机故障后，将使载荷系统无法正常获得其所需的电量、使卫星平台难以维持正常模式工作，严重时，将导致整星系统无能源供应，演变成系统级故障"
    },
    {
        title: '结构单机故障',
        content: "实现整星的机械结构相关功能，如帆板展开结构与机构、转台结构与机构、整星框架结构等。本系统仿真时，针对转台结构设置了结构单机故障，当结构单机故障时，转台及转台所带动的载荷停止正常工作。"
    },
    {
        title: '载荷故障',
        content: "是卫星的重要核心。载荷故障发生后，载荷无法正常开机，从而无法执行指定遥感任务。"
    },
    {
        title: '协议故障',
        content: "星地链路间按照各星既定的指令协议与格式进行数传通信。当发生协议级故障时，星上或地面站无法解析对方所发送的指令数据，具体表现为星地链路无效。"
    },
    {
        title: '元器件故障',
        content: "重点针对载荷系统模拟元器件级故障。载荷开机过程中，若发生元器件故障，光学/SAR载荷输出的遥感图像帧为噪点图片、电子载荷输出无规律的错误侦察结果。"
    },
    {
        title: '软件故障',
        content: "重点针对姿控与轨控分系统模拟星上软件级故障。考虑星上姿控与轨控代码编写错误，则当卫星执行姿控或轨控任务时，无法按预期效果快速执行调姿或轨道机动任务。具体表现为，当卫星执行调姿或轨道机动时，卫星姿态或轨道到达预期导引律值的时间大幅变长。"
    }
]
</script>


<style lang="scss" scoped>
$color1: gray;
$color2: #0E5894;
$color3: white;
</style>


<style lang="scss" scoped>
@import '@/assets/css/_var.scss';
@import '@/assets/css/element.scss';
@import '@/assets/css/mixin.scss';

.breakdown {
    width: $popupWidth;
    height: calc(#{$popupHeight}*1.02);
    font-family: 'Source Han Sans CN';
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    background-color: $color1;
    @include scroll
}



.title {
    background-color: $color2;
    height: 28px;
    line-height: 28px;
    color: $color3;
    background-color: rgb(180, 77, 77);
    text-align: center;
    text-shadow: 0 0 5px $active-color, 0 0 5px $active-color,
}

.text {
    color: rgba(236, 161, 161, 0.813);
    padding: 10px;
    border: 1px solid $system-light;


    &:hover {
        box-shadow: inset 5px 5px 5px 5px rgba(0, 0, 0, 0.5);
        text-shadow: 0 0 5px black, 0 0 5px black,
    }

}
</style>

