<template>
    <div v-if="isShow" class="task-report">
        <div class="titleBox">
            <el-image :src="titleIcon" fit="cover" lazy />
            <span style="  font-family: PangMenZhengDao;
    margin-left: 10px;
    font-size: 20px;
    color: #FFFFFF;
    text-shadow: 0 0 10px #158EFF, 0 0 20px #158EFF, 0 0 30px #158EFF, 0 0 40px #158EFF;">任务报告</span>

            <div class="close-btn" @click="closePopup">
                <!-- <el-tag class="close-btn-tag"></el-tag> -->
                <el-icon :size="20" class="close-btn-tag-icon" @mouseover="isHoverClose = true"
                    @mouseleave="isHoverClose = false" :class="isHoverClose ? 'animate__animated animate__heartBeat' : ''">
                    <CircleClose />
                </el-icon>
            </div>

        </div>
        <div class="main">
            <div class="contentBox left">
                <el-descriptions :column="1" style="margin-top: 20px; margin-left: 10px;">
                    <!-- <el-descriptions-item v-for="(item, index) in Object.keys(props.data)" :label="item">: {{
                        props.data[item]
                    }}</el-descriptions-item> -->
                    <el-descriptions-item label="任务名称：">{{ props.data.task }}</el-descriptions-item>
                    <el-descriptions-item label="卫星名称：">{{ props.data.name }}</el-descriptions-item>
                    <el-descriptions-item label="观测目标：">{{ props.data.target }}</el-descriptions-item>
                    <el-descriptions-item label="目标类型：">{{ props.data.targetType }}</el-descriptions-item>
                    <el-descriptions-item label="载荷类型：">{{ props.data.payloadType }}</el-descriptions-item>
                    <el-descriptions-item label="分辨率：">{{ props.data.resolution }}</el-descriptions-item>
                    <el-descriptions-item label="观测时间：">{{ props.data.time }}</el-descriptions-item>
                    <el-descriptions-item label="优先级：">{{ props.data.priority }}</el-descriptions-item>
                    <el-descriptions-item label="接收站：">{{ props.data.station }}</el-descriptions-item>
                    <el-descriptions-item label="结论:"> 该任务可行</el-descriptions-item>
                </el-descriptions>
            </div>
            <div class="right animate__animated animate__flip"></div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import $bus from '@/utils/mitter'
import titleIcon from '@/assets/image/titleIcon.png'
const props = defineProps({
    data: {
        type: Object,
        default: {
            task: '',
            name: '',
            target: "",
            targetType: "",
            payloadType: "",
            resolution: "",
            time: "",
            priority: "",
            station: '',
        }
    },
    isShow: {
        type: Boolean,
        default: false
    }
})
const isHoverClose = ref(false)
const isShow = ref(true)
const closePopup = () => {
    isShow.value = false
}
const openPopup = () => {
    isShow.value = true
}
$bus.on('taskReport/openPopup', () => {
    openPopup()
})
$bus.on('taskReport/closePopup', () => {
    closePopup()
})


</script>

<style lang="scss" scoped>
.task-report {
    height: 100%;
    // border-radius: 5%;
}

.main {
    width: 100%;
    height: 100%;
    display: flex;
    background: #0f86cb;

    .left {
        width: 50%;
        height: 100%;
        border: 0
    }

    .right {
        width: 50%;
        height: 100%;
        background-color: #0f86cb;
        background: url("../../assets/image/已批准.png") no-repeat;
        background-size: 100% 80%;
        background-position: center;
    }
}

.close-btn {
    margin-top: -30px;

    .close-btn-tag-icon {
        color: #fff;

        &:hover {
            cursor: pointer;
            color: red;
        }
    }
}
</style>