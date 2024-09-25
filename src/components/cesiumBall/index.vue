<template>
    <div class="cesiumBox">
        <div id="cesiumContainer" ref="cesiumContainer"></div>
    </div>
    <!-- 滑块工具 -->
    <!-- <DatGui /> -->
</template>

<script lang="ts" setup>
// 引入vue3的api
import { ref, reactive, onMounted, computed } from 'vue';
import { init } from "@/utils/cesium/init.js";
// 滑块工具
import * as dat from 'dat.gui';
// store 仓库
import CesiumStore from "@/store/cesium";
const CesiumStoreInit = CesiumStore()
// import { addImageryProvider } from '@/utils/cesium/layers/imagery.js'
import DatGui from '@/components/datGui/index.vue'

// 生命周期
onMounted(async () => {
    let viewer = init({
        container: 'cesiumContainer',
    });
    await CesiumStoreInit.SET_VIEWER(viewer);

});

</script>

<style lang="scss" scoped>
.cesiumBox {
    width: 100%;
    height: 100%;
    position: fixed;
    #cesiumContainer {
        width: 100%;
        height: 100%;
        // background-color: pink;
    }
}
</style>