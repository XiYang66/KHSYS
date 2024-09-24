<template>
    <div class="xdBox">
        <div class="left">
            <el-tree :data="data" show-checkbox node-key="id" :props="defaultProps" />
        </div>
        <div class="right">
            <div class="button">
                <el-button type="primary">按钮1</el-button>
                <el-button type="primary">按钮2</el-button>
                <el-button type="primary">按钮3</el-button>
            </div>
            <div class="table">
                <el-table :data="tableData" height="100%" :header-cell-style="{ 'text-align': 'center' }"
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
    height: 100%;
    display: flex;
    justify-content: space-around;
    .left {
        pointer-events: auto;
        width: 350px;
        height: 98%;
        box-sizing: border-box;
        padding: 10px;
        // background-image: url('/src/assets/image/一级.png');
        // background-size: 100% 100%;
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
        pointer-events: auto;
        width: calc(100% - 370px);
        height: 98%;
        .buttonBox {
            height: 5px;
        }
        .table {
            height: 95%;
        }
    }
}
</style>