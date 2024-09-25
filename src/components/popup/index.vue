<template>
    <div>
        <el-tabs v-model="activeTab">
            <el-tab-pane label="卫星属性" name="properties">
               <satelliteProp></satelliteProp>
            </el-tab-pane>

            <el-tab-pane label="故障说明" name="fault-explanation">
                sss
            </el-tab-pane>
            <el-tab-pane label="任务管理" name="task-management">
                ddd
            </el-tab-pane>
            <el-tab-pane label="载荷属性" name="payload-properties"></el-tab-pane>
            <el-tab-pane label="载荷数据" name="payload-data"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import satelliteProp from './satelliteProp.vue'
const activeTab = 'properties';



</script>

<style lang="scss" scoped></style>