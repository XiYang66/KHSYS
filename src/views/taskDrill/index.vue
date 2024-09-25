<template>
    <div class="taskDrill">
        <LeftTree/>
        <RightBox/>
        <Message/>
    </div>
</template>

<script lang="ts" setup>
// 引入vue3的api
import { ref, reactive, onMounted, defineExpose } from "vue"
import LeftTree from '@/views/taskDrill/leftTree/index.vue'
import RightBox from '@/views/taskDrill/rightBox/index.vue'
import Message from '@/views/taskDrill/message/index.vue'
// 定义变量
let data = ref(0);

// 生命周期
onMounted(() => {

})
// 定义方法
const fun1 = () => {

}
//暴露方法
defineExpose({})
</script>

<style lang="scss" scoped>
.taskDrill{
    height: 100%;
    position: relative;
}
</style>