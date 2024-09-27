<template>
    <div class="taskDrill">
        <!-- 左侧树 -->
        <LeftTree />
        
        <!-- 详情 -->
        <Message v-show="state.MessageFlag" />

        <!-- 右侧信息 -->
        <Transition enter-active-class="animate__animated animate__backInRight"
            leave-active-class="animate__animated animate__backOutRight">
            <RightBox v-show='state.RightBoxFlag' />
        </Transition>

    </div>
</template>

<script setup>
// 引入vue3的api
import { ref, reactive, onMounted, defineExpose } from "vue"
import LeftTree from '@/views/taskDrill/leftTree/index.vue'
import RightBox from '@/views/taskDrill/rightBox/index.vue'
import Message from '@/views/taskDrill/message/index.vue'

import $bus from '@/utils/mitter'
// 定义变量
let state = reactive({
    MessageFlag: false,
    RightBoxFlag: true,
});

// 生命周期
onMounted(() => {

});
// 注册事件
$bus.on('MessageFlag', (flag) => {
    state.MessageFlag = flag
    $bus.emit('initEcharts')
})
$bus.on('RightBoxFlag', (flag) => {
    state.RightBoxFlag = flag
})
// 定义方法
const fun1 = () => {

}
//暴露方法
defineExpose({})
</script>

<style lang="scss" scoped>
.taskDrill {
    height: 100%;
    position: relative;

    // .v-enter-active,
    // .v-leave-active {
    //     transition: opacity 0.5s ease;
    // }

    // .v-enter-from,
    // .v-leave-to {
    //     opacity: 0;
    // }
}
</style>