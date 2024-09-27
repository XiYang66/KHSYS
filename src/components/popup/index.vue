<template>
    <el-dialog v-model="isTabsPopup" :title="curLabel+'('+target+')'" draggable :z-index="100" width='500'>
        <div class="popup">
            <div class="main popup-tabs" v-if="isTabsPopup">
                <el-tabs v-model="activeTab" @tab-click="handleTabClick" type="card">
                    <el-tab-pane label="卫星属性" name="properties">
                        <satelliteProp :target="target"></satelliteProp>
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
        </div>
    </el-dialog>
</template>

<script setup>
import satelliteProp from './satelliteProp.vue'
import payloadProp from './payloadProp.vue'
import breakdown from './breakdown.vue'
import taskManage from './taskManage.vue'
import payloadData from './payloadData.vue'
import $bus from '@/utils/mitter'
import { ref } from 'vue'
const activeTab = ref('properties');
const curLabel = ref('卫星属性')
const isTabsPopup = ref(true)
const isHoverClose = ref(false)
const handleTabClick = (tab) => {
    // console.log(tab.props.label)
    curLabel.value = tab.props.label
}

const closePopup = () => {
    // console.log('close')
    isTabsPopup.value = false
}
const openPopup = () => {
    isTabsPopup.value = true
}

let target = ref('')
$bus.on('contextmenu/openPopup', ({ type, nodeLabelClicked }) => {
    target.value = nodeLabelClicked
    type == 'prop' && openPopup()
})
$bus.on('contextmenu/closePopup', () => {
    closePopup()
})


</script>

<style lang="scss" scoped>
@import '@/assets/css/mixin.scss';
@import '@/assets/css/popup.scss';
@import '@/assets/css/_var.scss';

::v-deep .el-tab-pane {
    height: auto;
}

.popup {
    // @include popupBasic;
    pointer-events: auto;

    .head {
        background: $bg1;
        height: $popupHeadHeight;
        position: relative;

        .main {
            width: 100%;
            height: 100%;
        }

        .title {
            @include popupTitle;
            width: auto;
        }

        .close-btn {
            @include popupCloseBtn;
            left: 460px;

            .close-btn-tag {
                color: wheat;
                background-color: gray;
                height: 14px;

                &:hover {
                    color: wheat;
                    background-color: red;
                    cursor: pointer;
                    // border: ;
                }
            }

            .close-btn-tag-icon {
                color: $active-color;
                width: 20px;
                height: 20px;
            }
        }
    }
}
</style>