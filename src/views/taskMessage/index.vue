<template>
    <div class="xdBox">
        <div class="left">
            <div class="titleBox">
                <el-image :src="titleIcon" fit="cover" lazy />
                <span>场景概括</span>
            </div>
            <div ref="cjgk" class="contentBox">
                <el-tree default-expand-all :data="data" show-checkbox node-key="id" :props="defaultProps" />
            </div>

        </div>
        <div class="right">
            <div class="button">
                <el-button type="primary">按钮1</el-button>
                <el-button type="primary">按钮2</el-button>
                <el-button type="primary">按钮3</el-button>
            </div>
            <div class="table">
                <el-table :data="tableData" height="100%" stripe :header-cell-style="{ 'text-align': 'center' }"
                    :cell-style="{ 'text-align': 'center' }">
                    <el-table-column prop="date" label="Date" />
                    <el-table-column prop="name" label="Name" />
                    <el-table-column prop="address" label="Address" />
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
        label: 'Level one 1',
        children: [
            {
                id: 4,
                label: 'Level two 1-1',
                children: [
                    {
                        id: 9,
                        label: 'Level three 1-1-1'
                    },
                    {
                        id: 10,
                        label: 'Level three 1-1-2'
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        label: 'Level one 2',
        children: [
            {
                id: 5,
                label: 'Level two 2-1'
            },
            {
                id: 6,
                label: 'Level two 2-2'
            }
        ]
    },
    {
        id: 3,
        label: 'Level one 3',
        children: [
            {
                id: 7,
                label: 'Level two 3-1'
            },
            {
                id: 8,
                label: 'Level two 3-2'
            }
        ]
    }
]);
const defaultProps = {
    children: 'children',
    label: 'label'
};
const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
]
// 生命周期

onMounted(() => {
    console.log(Cesium)
});

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