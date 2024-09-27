<template>
    <div class="xdBox">
        <div class="left">
            <div class="titleBox">
                <el-image :src="titleIcon" fit="cover" lazy />
                <span>训练任务列表</span>
            </div>
            <div ref="cjgk" class="contentBox">
                <el-tree default-expand-all :data="data" node-key="id" :props="defaultProps" @node-click='nodeClick'>
                    <template #default="{ node, data }">
                        <span class="tree-node">
                            <span class="label" @contextmenu="handleClickRight($event, node.label, node.isLeaf)"
                                @click="handleClick">

                                {{ node.label }}
                            </span>
                            <div class="image" v-show="!data.children">
                                <el-image :src="addone" style="height: 16px;margin: 0 5px;" fit="none" />
                                <el-image :src="Delete" style="height: 16px;" fit="cover" />
                            </div>
                        </span>
                    </template>
                </el-tree>
            </div>

        </div>
        <div class="right">
            <div class="search">
                <el-form :inline="true" :model="state.searchForm" class="demo-form-inline">
                    <el-form-item label="任务名称">
                        <el-input v-model="state.searchForm.name" placeholder="请输入关键字" clearable />

                    </el-form-item>
                    <el-form-item label="目标类型">
                        <el-select v-model="state.searchForm.region" placeholder="请选择目标类型" clearable>
                            <el-option label="机场" value="机场" />
                            <el-option label="侦查预警" value="侦查预警" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="观测时间">
                        <el-date-picker v-model="state.searchForm.date" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                            date-format="MMM DD, YYYY" time-format="HH:mm" placeholder="请输入观测时间" clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">任务接入</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-table :data="tableData" height="100%" stripe :header-cell-style="{ 'text-align': 'center' }"
                    :cell-style="{ 'text-align': 'center' }">
                    <el-table-column prop="date1" label="任务名称" />
                    <el-table-column prop="date2" label="卫星名称" />
                    <el-table-column prop="date3" label="观测目标" />
                    <el-table-column prop="date4" label="目标类型" />
                    <el-table-column prop="date5" label="载荷类型" />
                    <el-table-column prop="date6" label="分辨率" />
                    <el-table-column prop="date7" label="观测时间" />
                    <el-table-column prop="recover" label="操作" width='250px'>
                        <template #default="scope">
                            <el-button type="primary">任务下达</el-button>
                            <el-button type="primary">任务报告</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>

</template>
<script setup>
// 引入vue3的api
import { ref, reactive, onMounted } from 'vue';
import titleIcon from '@/assets/image/titleIcon.png'
import search from '@/assets/image/search.png'
import add from '@/assets/image/add.png'

import addone from '@/assets/image/add-one.png';
import Delete from '@/assets/image/delete.png';
// 定义变量
const state = reactive({
    searchForm: {
        name: ''
    }
})
    ;
const data = reactive([
    {
        id: 1,
        label: '美国',
        children: [
            {
                id: 4,
                label: '固定目标',
            },
            {
                id: 5,
                label: '移动目标',
            }
        ]
    },
    {
        id: 1,
        label: '日本',
        children: [
            {
                id: 4,
                label: '固定目标',
            },
            {
                id: 5,
                label: '移动目标',
            }
        ]
    },
    {
        id: 1,
        label: '韩国',
        children: [
            {
                id: 4,
                label: '固定目标',
            },
            {
                id: 5,
                label: '移动目标',
            }
        ]
    },
]);
const defaultProps = {
    children: 'children',
    label: 'label'
};

const tableData = ref([
    {
        date1: '拍摄韩机场',
        date2: '尖兵十三号04星',
        date3: '水原空军基地',
        date4: '机场',
        date5: 'SAR',
        date6: '0.3',
        date7: '2023-02-17 9:53:24',
    },
    {
        date1: '拍摄韩雷达',
        date2: '尖兵十三号04星',
        date3: '尊帝山雷达站',
        date4: '侦察预警',
        date5: 'SAR',
        date6: '0.3',
        date7: '2023-02-17 11:53:24',
    },
    {
        date1: '拍摄美空基地',
        date2: 'JL1GF03C01',
        date3: '阿尔特斯空军基地',
        date4: '侦察预警',
        date5: 'SAR',
        date6: '0.3',
        date7: '2023-02-17 10:54:24',
    },
    {
        date1: '拍摄美空基地',
        date2: '尖兵十三号04星',
        date3: '哈西马拉空军基地',
        date4: '侦察预警',
        date5: 'SAR',
        date6: '0.3',
        date7: '2023-02-17 10:53:24',
    }
])
// 生命周期

onMounted(() => {
    console.log(Cesium)
});
const nodeClick = (data) => {
    if (data.label == '移动目标') {
        tableData.value = [
            {
                date1: '拍摄美航母',
                date2: '尖兵十三号01星',
                date3: '尼米兹号',
                date4: '航母',
                date5: 'SAR',
                date6: '0.3',
                date7: '2023-02-17 10:53:24',
            },
            {
                date1: '拍摄驱逐舰',
                date2: '尖兵十三号02星',
                date3: '迪凯特号',
                date4: '驱逐舰',
                date5: 'SAR',
                date6: '0.3',
                date7: '2023-02-17 10:48:24',
            },
            {
                date1: '拍摄美航母',
                date2: '尖兵十三号03星',
                date3: '尼米兹号',
                date4: '航母',
                date5: 'SAR',
                date6: '0.3',
                date7: '2023-02-17 10:48:24',
            }
        ]
    } else {
        tableData.value = [
            {
                date1: '拍摄韩机场',
                date2: '尖兵十三号04星',
                date3: '水原空军基地',
                date4: '机场',
                date5: 'SAR',
                date6: '0.3',
                date7: '2023-02-17 9:53:24',
            },
            {
                date1: '拍摄韩雷达',
                date2: '尖兵十三号04星',
                date3: '尊帝山雷达站',
                date4: '侦察预警',
                date5: 'SAR',
                date6: '0.3',
                date7: '2023-02-17 11:53:24',
            },
            {
                date1: '拍摄美空基地',
                date2: 'JL1GF03C01',
                date3: '阿尔特斯空军基地',
                date4: '侦察预警',
                date5: 'SAR',
                date6: '0.3',
                date7: '2023-02-17 10:54:24',
            },
            {
                date1: '拍摄美空基地',
                date2: '尖兵十三号04星',
                date3: '哈西马拉空军基地',
                date4: '侦察预警',
                date5: 'SAR',
                date6: '0.3',
                date7: '2023-02-17 10:53:24',
            }
        ]
    }
}
</script>

<style lang="scss" scoped>
.xdBox {
    width: 100%;
    height: 98%;
    display: flex;
    justify-content: space-between;

    .left {
        /* 可以点击 */
        pointer-events: auto;
        width: 350px;
        height: 100%;
        box-sizing: border-box;
        user-select: none;

        .title {
            color: #9dbce6;
            font-weight: bold;
            text-align: center;
        }

        .el-tree {
            overflow: auto;
            height: 96% !important;
        }
    }

    .right {
        /* 可以点击 */
        pointer-events: auto;
        width: calc(100% - 370px);
        height: 100%;
        background: rgba(17, 38, 69, 0.7);
        border: 1px solid #1a7bf9;
        box-sizing: border-box;
        padding: 10px;

        .buttonBox,
        .search {
            // height: 15px;
        }

        .table {
            width: 100%;
            margin-top: 10px;
            // height: calc(100% - 35px);
        }
    }
}
</style>