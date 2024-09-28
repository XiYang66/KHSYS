<template>
    <div v-if="isShow" class="investigate">
        <div class="titleBox">
            <el-image :src="titleIcon" fit="cover" lazy />
            <span style="  font-family: PangMenZhengDao;
    margin-left: 10px;
    font-size: 20px;
    color: #FFFFFF;
    text-shadow: 0 0 10px #158EFF, 0 0 20px #158EFF, 0 0 30px #158EFF, 0 0 40px #158EFF;">侦察时间窗口</span>

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
                <el-descriptions :column="1">
                    <!-- <el-descriptions-item v-for="(item, index) in Object.keys(props.data)" :label="item">: {{
                        props.data[item]
                    }}</el-descriptions-item> -->
                    <el-descriptions-item label="卫星名称：">{{ props.data.name }}</el-descriptions-item>
                    <el-descriptions-item label="侦察地点：">{{ props.data.location }}</el-descriptions-item>
                    <el-descriptions-item label="开始时间：">{{ props.data.start }}</el-descriptions-item>
                    <el-descriptions-item label="结束时间：">{{ props.data.end }}</el-descriptions-item>
                    <el-descriptions-item label="持续时间：">{{ props.data.time }}</el-descriptions-item>
                    <el-descriptions-item label="云量：">{{ props.data.cloudy }}</el-descriptions-item>
                    <el-descriptions-item label="雪量：">{{ props.data.snow }}</el-descriptions-item>
                </el-descriptions>
            </div>
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
            name: '尖兵二号改01组A星',
            location: "145.66569117286767，23.510123066996794",
            start: "2024-06-04 00:23:23",
            end: "2024-06-04 00:23:27",
            last: '4s',
            cloudy: "5",
            snow: "0",
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
$bus.on('investigate/openPopup', () => {
    openPopup()
})
$bus.on('investigate/closePopup', () => {
    closePopup()
})


</script>

<style lang="scss" scoped>
::v-deep .el-descriptions {
    padding-left: 20px;
    padding-top: 20px;
    height: 100%;
}


.task-report {
    height: 100%;
    // border-radius: 5%;
}

.main {
    width: 100%;
    height: 100%;
    display: flex;
    background: #1e2022;
    flex-direction: column;

    .left {
        width: 100%;
        height: 100%;
        border: 0;
        margin: 0;
        padding: 0;
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