<template>
    <div class="payloadData">
        <el-row class="title row0">
            <el-col :span="24">任务</el-col>
        </el-row>
        <el-row class="name row1">
            <el-col class="label col" :span="24">
                <div class="chart">
                    <div class="innerChart" style="background-color: rgb(91, 91, 169);">
                        map
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row class="title row2">
            <el-col :span="24">遥感影像帧</el-col>
        </el-row>
        <el-row class="row3">
            <el-col :span="6" v-for="item in 4">
                <el-image style="width: 113px; height: 126px" :src="url" fit="fill" />
            </el-col>
        </el-row>
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

const url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'


</script>


<style lang="scss" scoped>
@import '@/assets/css/_var.scss';
@import '@/assets/css/mixin.scss';
@import '@/assets/css/element.scss';

.payloadData {
    width: $popupWidth;
    height: $popupHeight;
    background-color: $color1;

    .title {
        text-align: center;
        font-size: $fontSize*1.3;
        color: $color3;
        text-shadow: 0 0 5px $active-color, 0 0 5px $active-color,
    }

    .row1 {
        width: 100%;
        height: 50%;
        margin-bottom: 5%;
    }

    .row2 {
        margin-bottom: 2%;
    }
}

.chart {
    height: 100%;
    width: 100%;
    margin: 0 auto;
    margin-top: 2%;

    .innerChart {
        margin: 0 auto;
        height: 100%;
        width: 100%;
    }
}
</style>

