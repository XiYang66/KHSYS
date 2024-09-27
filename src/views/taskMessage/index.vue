<template>
    <div class="xdBox">
        <div class="left">
            <div class="titleBox">
                <el-image :src="titleIcon" fit="cover" lazy />
                <span style="  font-family: PangMenZhengDao;
    margin-left: 10px;
    font-size: 20px;
    color: #FFFFFF;
    text-shadow: 0 0 10px #158EFF, 0 0 20px #158EFF, 0 0 30px #158EFF, 0 0 40px #158EFF;">训练任务列表</span>
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
                                <el-image :src="addone" @click="builtBut" style="height: 16px;margin: 0 5px;"
                                    fit="none" />
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
                            <el-option label="航母" value="航母" />
                            <el-option label="驱逐舰" value="驱逐舰" />
                        </el-select>
                    </el-form-item>

                    <!-- <el-form-item label="观测时间">
                        <el-date-picker v-model="state.searchForm.date" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                            date-format="MMM DD, YYYY" time-format="HH:mm" placeholder="请输入观测时间" clearable />
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">任务接入</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-table :data="newTable" height="100%" stripe :header-cell-style="{ 'text-align': 'center' }"
                    :cell-style="{ 'text-align': 'center' }">
                    <el-table-column prop="date1" label="任务名称" />
                    <el-table-column prop="date2" label="卫星名称" />
                    <el-table-column prop="date3" label="观测目标" />
                    <el-table-column prop="date4" label="目标类型" />
                    <el-table-column prop="date5" label="载荷类型" />
                    <el-table-column prop="date6" label="分辨率" />
                    <el-table-column prop="date7" label="观测时间" />
                    <el-table-column prop="date8" label="优先级" />
                    <el-table-column prop="date9" label="任务状态" />
                    <el-table-column prop="recover" label="操作" width='250px'>
                        <template #default="scope">
                            <router-link to="/taskDrill">
                                <el-button type="primary">任务下达</el-button>
                            </router-link>
                            <el-button type="primary" @click="setReportData(scope.row)">任务报告</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <taskReport class="task-report animate__animated animate__flipInX" :data="reportData"></taskReport>
        </div>
        <div v-if="state.isBuilt" class="builtBox">
            <div class="title">
                新建
            </div>
            <div class="builtInfo">
                <div class="linInfo">

                    <span class="builtTitle">
                        任务名称
                    </span>
                    <div class="builtValue">
                        <el-input v-model="state.pushData.date1" placeholder="请输入关键字" clearable />
                    </div>

                    <span class="builtTitle">
                        卫星名称
                    </span>
                    <div class="builtValue">
                        <el-select style="width: 190px !important;" v-model="state.pushData.date2" placeholder="请选择目标类型"
                            clearable>
                            <el-option label="尖刀十三号04星" value="尖刀十三号04星" />
                            <el-option label="JL1GF03C01" value="JL1GF03C01" />
                            <el-option label="吉林一号高分03805" value="吉林一号高分03805" />
                            <el-option label="吉林一号高分03806" value="吉林一号高分03806" />
                        </el-select>
                    </div>
                </div>
                <div class="linInfo">
                    <span class="builtTitle">
                        载荷类型
                    </span>
                    <div class="builtValue">
                        <el-select style="width: 190px !important;" v-model="state.pushData.date5" placeholder="请选择目标类型"
                            clearable>
                            <el-option label="可见光" value="可见光" />
                            <el-option label="SAR" value="SAR" />
                        </el-select>
                    </div>
                    <span class="builtTitle">
                        开始时间
                    </span>
                    <div class="builtValue">
                        <el-date-picker style="width: 190px !important;" v-model="state.pushData.date7" type="datetime"
                            format="YYYY-MM-DD HH:mm:ss" date-format="MMM DD, YYYY" time-format="HH:mm"
                            placeholder="请输入观测时间" clearable />
                    </div>
                </div>
                <div class="linInfo">
                    <span class="builtTitle">
                        幅宽
                    </span>
                    <div class="builtValue">
                        <el-input v-model="state.pushData.date13" placeholder="请输入关键字" clearable />
                    </div>
                    <span class="builtTitle">
                        结束时间
                    </span>
                    <div class="builtValue">
                        <el-date-picker style="width: 190px !important;" v-model="state.pushData.date9" type="datetime"
                            format="YYYY-MM-DD HH:mm:ss" date-format="MMM DD, YYYY" time-format="HH:mm"
                            placeholder="请输入观测时间" clearable />
                    </div>
                </div>
                <div class="linInfo">
                    <span class="builtTitle">
                        空间分辨率
                    </span>
                    <div class="builtValue">
                        <el-input v-model="state.pushData.date6" placeholder="请输入关键字" clearable />
                    </div>
                    <span class="builtTitle">
                        观测目标
                    </span>
                    <div class="builtValue">
                        <el-select style="width: 190px !important;" v-model="state.pushData.date3" placeholder="请选择目标类型"
                            clearable>
                            <el-option label="水原空军基地" value="水原空军基地" />
                            <el-option label="尊帝山雷达站" value="尊帝山雷达站" />
                            <el-option label="阿尔特斯空军基地" value="阿尔特斯空军基地" />
                            <el-option label="哈西马拉空军基地" value="哈西马拉空军基地" />
                        </el-select>
                    </div>
                </div>
                <div class="linInfo">
                    <span class="builtTitle">
                        时间分辨率
                    </span>
                    <div class="builtValue">
                        <el-input v-model="state.pushData.date10" placeholder="请输入关键字" clearable />
                    </div>
                    <span class="builtTitle">
                        任务优先级
                    </span>
                    <div class="builtValue">
                        <el-select style="width: 190px !important;"  v-model="state.pushData.date8" placeholder="请选择目标类型" clearable>
                            <el-option label="高" value="高" />
                            <el-option label="中" value="中" />
                            <el-option label="低" value="低" />
                        </el-select>
                    </div>
                </div>
                <div class="linInfo">
                   <span class="builtTitle">
                        添加场景
                    </span>
                    <div class="builtValue">
                        <el-select style="width: 190px !important;"  v-model="state.pushData.date14" placeholder="请选择目标类型" clearable>
                            <el-option label="海上目标搜索" value="海上目标搜索" />
                        </el-select>
                    </div>
                   
                </div>
                <div class="linInfo builtBut"> 
                    <el-button type="primary" @click="() => {
                        state.pushData = {
        date4:'空军基地',date9:'未开始'
    }}">重置</el-button>
                    <el-button style="margin-right: 100px;" type="primary">筛选</el-button>
                    <el-button @click="state.isBuilt=false" type="primary">取消</el-button>
                    <el-button @click="sureCLick" type="primary">确定</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
// 引入vue3的api
import { ref, reactive, onMounted } from 'vue';
import titleIcon from '@/assets/image/titleIcon.png'
import search from '@/assets/image/search.png'
import taskReport from '@/components/taskReport/index.vue'
import $bus from '@/utils/mitter'

import addone from '@/assets/image/add-one.png';
import Delete from '@/assets/image/delete.png';
// 定义变量
const state = reactive({
    searchForm: {
        name: ''
    },
    pushData: {
        date4: '空军基地',
        date9:'未开始'
    },
    isBuilt:false // 是否新增
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
        date8: '高',
        date9:'已完成'
    },
    {
        date1: '拍摄韩雷达',
        date2: '尖兵十三号04星',
        date3: '尊帝山雷达站',
        date4: '雷达站',
        date5: 'SAR',
        date6: '0.3',
        date7: '2023-02-17 11:53:24',
        date8: '高',
        date9:'已完成'
    },
    {
        date1: '拍摄美空基地',
        date2: 'JL1GF03C01',
        date3: '阿尔特斯空军基地',
        date4: '空军基地',
        date5: 'SAR',
        date6: '0.3',
        date7: '2023-02-17 10:54:24',
        date8: '中',
        date9:'已完成'
    },
    {
        date1: '拍摄美空基地',
        date2: '尖兵十三号04星',
        date3: '哈西马拉空军基地',
        date4: '空军基地',
        date5: 'SAR',
        date6: '0.3',
        date7: '2023-02-17 10:53:24',
        date8: '低',
        date9:'已完成'
    }
])
// 生命周期

const reportData = ref([])
function getRandom() {
    return Math.floor(Math.random() * (4 - 0)) + 0
}
const stations = ['三亚站', '青岛站', '佳木斯站', '太原站', '渭南站']
const setReportData = (data) => {
    $bus.emit('taskReport/openPopup')
    // console.log(data)
    reportData.value = {
        task: data.date1,
        name: data.date2,
        target: data.date3,
        targetType: data.date4,
        payloadType: data.date5,
        resolution: data.date6,
        time: data.date7,
        priority: data.date8,
        station: stations[getRandom() || 0]//模拟数据 - 接收站
    }
    // console.log(reportData.value)
}

onMounted(() => {
    console.log(Cesium)
    $bus.emit('taskReport/closePopup')
});
const setTime = (data) => {
    if (!!data) {
        
        const date = new Date(data);
        
        // 获取年份、月份和日期
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需加1
        const day = String(date.getDate()).padStart(2, '0');
        // 获取小时、分钟和秒
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        // 格式化成所需的字符串
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate
    } else {
        return ''
    }

}
// 确认按钮
const sureCLick = () => {
    state.pushData.date7 = setTime(state.pushData.date7)
    newTable.value.push(state.pushData)
    state.pushData = {
        date4: '空军基地',
        date9:'未开始'
    }
    state.isBuilt =false
}
// 树形结构的添加
const builtBut = () => {
    state.isBuilt =true
}
let newTable = ref(JSON.parse(JSON.stringify(tableData.value)))
// 查询按钮
const onSubmit = () => {
    if (
        !state.searchForm.name &&
        !state.searchForm.region
    ) {
        newTable.value = tableData.value;
    }
    newTable.value = tableData.value.filter((item) => {
        // 如果 type 不为空，进行 type 筛选
        const typeMatch =
            !state.searchForm.region || item.date4 === state.searchForm.region;
        const nameMatch =
            !state.searchForm.name ||
            (item.date1 && item.date1.includes(state.searchForm.name));

        // 只有当 type 和 name 都匹配时才返回
        return typeMatch && nameMatch
    });
}
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
                date8:'中',
                date9:'已完成'
            },
            {
                date1: '拍摄驱逐舰',
                date2: '尖兵十三号02星',
                date3: '迪凯特号',
                date4: '驱逐舰',
                date5: 'SAR',
                date6: '0.3',
                date7: '2023-02-17 10:48:24',
                date8:'高',
                date9:'已完成'
            },
            {
                date1: '拍摄美航母',
                date2: '尖兵十三号03星',
                date3: '尼米兹号',
                date4: '航母',
                date5: 'SAR',
                date6: '0.3',
                date7: '2023-02-17 10:48:24',
                date8:'低',
                date9:'已完成'
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
                date8:'高',
                date9:'已完成'
            },
            {
                date1: '拍摄韩雷达',
                date2: '尖兵十三号04星',
                date3: '尊帝山雷达站',
                date4: '侦察预警',
                date5: 'SAR',
                date6: '0.3',
                date7: '2023-02-17 11:53:24',
                date8:'低',
                date9:'已完成'
            },
            {
                date1: '拍摄美空基地',
                date2: 'JL1GF03C01',
                date3: '阿尔特斯空军基地',
                date4: '侦察预警',
                date5: 'SAR',
                date6: '0.3',
                date7: '2023-02-17 10:54:24',
                date8:'中',
                date9:'已完成'
            },
            {
                date1: '拍摄美空基地',
                date2: '尖兵十三号04星',
                date3: '哈西马拉空军基地',
                date4: '侦察预警',
                date5: 'SAR',
                date6: '0.3',
                date7: '2023-02-17 10:53:24',
                date8:'低',
                date9:'已完成'
            }
        ]
    }
    newTable.value = tableData.value
}
// 添加
const add = () => {
    tableData.value.push({
        date1: 'XXXXX',
        date2: 'XXXXX',
        date3: 'XXXXX',
        date4: 'XXXXX',
        date5: 'SAR',
        date6: '0.3',
        date7: '2023-02-17 9:53:24'
    })
}
// 删除
const del = () => {
    tableData.value.pop()
}
</script>

<style lang="scss" scoped>
.xdBox {
    width: 100%;
    height: 98%;
    display: flex;
    justify-content: space-between;
.builtBox{
     pointer-events: auto;
    width: 800px;
    height: 400px;
    background-color: #072243;
    border: #1a7bf9 1px solid;
    position: fixed;
    top: 20%;
    left: 30%;
    z-index: 2;
    .title{
    font-size: 20px;
    color: #fff;
    margin: 12px;
    }
    .builtInfo{
        width: 100%;
        height: 90%;
        .linInfo{
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            .builtTitle{
                color: #fff;
            font-size: 15px;
                width: 20%;
                text-align: end;
                margin-right: 5px;
            }
        }
        .builtBut{
            justify-content: center;
            margin-top: 50px;
        }
    }
}
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

.task-report {
    position: fixed;
    width: 30%;
    height: 40%;
    top: 20%;
    left: 40%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    background-color: #0f86cb;
    box-shadow: 0px 0px 30px 0px #c1ccd6;
    // border-radius: 5%;
}
</style>