<template>
    <div class="taskManage">
        <el-row>
            <el-col :span="24">任务</el-col>
        </el-row>
        <el-row class="name row" align="right">
            <el-col class="label col" :span="24">
                <div class="chart" style="width:450px ; height: 137px; text-align: center; line-height: 137px;">
                    <div class="innerChart" id="chart-bubblechart"
                        style="width:95% ; height:98%; text-align: center; line-height: 137px; background-color: rgb(91, 91, 169);">
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="tableData" style="width: 100%" max-height="250" stripe>
                    <el-table-column fixed prop="date" label="Date" width="150" />
                    <el-table-column prop="name" label="Name" width="120" />
                    <el-table-column prop="state" label="State" width="120" />
                    <el-table-column prop="city" label="City" width="120" />
                    <el-table-column prop="address" label="Address" width="600" />
                    <el-table-column prop="zip" label="Zip" width="120" />
                    <el-table-column fixed="right" label="Operations" min-width="120">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">
                                Remove
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
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

const tableData = ref([
    {
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-03',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
])

onMounted(() => {
    
})

</script>


<style lang="scss" scoped>
@import '@/assets/css/_var.scss';

.taskManage {
    width: 480px;
    height: 474px;
    background-color: $color1;
}

.chart,
.innerChart {
    margin: 0 auto;
}
</style>


<style lang="scss">
@import '@/assets/css/element.scss';
</style>
