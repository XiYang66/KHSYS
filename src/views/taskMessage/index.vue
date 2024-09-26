<template>
    <div class="xdBox">
        <div class="left">
            <div class="titleBox">
                <el-image :src="titleIcon" fit="cover" lazy />
                <span>训练任务列表</span>
            </div>
            <div ref="cjgk" class="contentBox">
                <el-tree default-expand-all :data="data" node-key="id" :props="defaultProps" @node-click='nodeClick' />
            </div>

        </div>
        <div class="right">
            <div class="button">
                <el-button type="primary">任务标准化下达</el-button>
                <el-button type="primary">任务信息同步</el-button>
                <el-button type="primary">任务查询管理</el-button>
                <el-button type="primary">任务评估报告显示</el-button>
                <el-button type="primary">任务优先级制定</el-button>
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

                </el-table>
            </div>
        </div>
    </div>

</template>

<script setup>
// 引入vue3的api
import { ref, reactive, onMounted } from 'vue';
import titleIcon from '@/assets/image/titleIcon.png'
// 定义变量
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

        .buttonBox {
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