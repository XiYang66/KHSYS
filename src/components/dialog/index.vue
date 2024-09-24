<!-- 
变量：
obj: {
        dialogVisible: false,//图层开关
        title: '新增',//表头内容
        width: '30%',// 宽度
        isFooter: true // 是否显示按钮
    },

引用配置：
<Dialog class='XXDialog' :dialog-object="obj" @dialogClose="" @dialogSuccess=""></Dialog>
 -->

<template>
    <div class="lz-dialog">
        <el-dialog v-model="props.dialogObject.dialogVisible" :title="props.dialogObject.title"
            :width="props.dialogObject.width" :before-close="close" draggable>
            <slot> </slot>
            <template #footer>
                <span v-if="props.dialogObject.isFooter" class="dialog-footer">
                    <el-button class="btn-mixins-clear-default" @click="close">取消</el-button>
                    <el-button class="btn-mixins dia-suc" @click="success">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { computed, defineEmits, defineProps, defineExpose } from 'vue'
// 引入的props 参数
const props = defineProps({
    dialogObject: {
        default() {
            return {}
        },
        type: Object
    },
});
// 父组件事件 
const emits = defineEmits(['dialogClose', 'dialogSuccess'])

const close = () => {
    emits('dialogClose', false, 'close')
}
const success = () => {
    emits('dialogSuccess', false, 'success')
}
</script>
<style lang="scss" scope>
.lz-dialog {
    .dia-suc {
        margin-left: 16px !important;
    }
}
</style>