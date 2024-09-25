<template>
    <div class="payloadData">
        <el-row>
            <el-col :span="24">任务</el-col>
        </el-row>
        <el-row class="name row" :gutter="gutter" align="right">
            <el-col class="label col" :span="24">
                <div class="chart" style="width:450px ; height: 137px; text-align: center; line-height: 137px;">
                    <div class="innerChart"
                        style="width:95% ; height:98%; text-align: center; line-height: 137px; background-color: rgb(91, 91, 169);">
                        map
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">遥感影像帧</el-col>
        </el-row>
        <el-row>
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

.payloadData {
    width: 480px;
    height: 429px;
    background-color: $color1;
}

.chart,
.innerChart {
    margin: 0 auto;
}
</style>

