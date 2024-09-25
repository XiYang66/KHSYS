<template>
    <div>
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="卫星属性" name="properties">
                <satelliteProp></satelliteProp>
            </el-tab-pane>
            <el-tab-pane label="故障说明" name="breakdown">
                <breakdown></breakdown>
            </el-tab-pane>
            <el-tab-pane label="任务管理" name="task-management">
                <taskManage></taskManage>
            </el-tab-pane>
            <el-tab-pane label="载荷属性" name="payload-properties"></el-tab-pane>
            <payloadProp v-if="activeTab == 'payload-properties'"></payloadProp>
            <el-tab-pane label="载荷数据" name="payload-data"></el-tab-pane>
            <payloadData v-if="activeTab == 'payload-data'"></payloadData>
        </el-tabs>
    </div>
</template>

<script setup>
import satelliteProp from './satelliteProp.vue'
import payloadProp from './payloadProp.vue'
import breakdown from './breakdown.vue'
import taskManage from './taskManage.vue'
import payloadData from './payloadData.vue'
import { ref } from 'vue'
const activeTab = ref('properties');

const handleTabClick = (tab) => {
    // console.log(tab.props.name)
}
</script>

<style lang="scss">
@import '../../assets/css/global.scss';
</style>