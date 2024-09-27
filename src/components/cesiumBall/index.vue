<template>
    <div class="cesiumBox">
        <div id="cesiumContainer" ref="cesiumContainer"></div>
    </div>
    <!-- 滑块工具 -->
    <!-- <DatGui /> -->
</template>
<script setup>
// 引入vue3的api
import { ref, reactive, onMounted, computed } from 'vue';
import { init } from "@/utils/cesium/init.js";
// import { satellite, loadSatelliteCzml } from "@/utils/cesium/tools/satellite.js";
// 滑块工具
import * as dat from 'dat.gui';
// store 仓库
import CesiumStore from "@/store/cesium";
const CesiumStoreInit = CesiumStore()
// import { addImageryProvider } from '@/utils/cesium/layers/imagery.js'
import DatGui from '@/components/datGui/index.vue'

onMounted(async () => {
    let viewer = await init({
        container: 'cesiumContainer',
        timeline: true,
    });
    await CesiumStoreInit.SET_VIEWER(viewer);
    loadCzml(viewer, 'models/simpleCZML.czml')

})
const loadCzml = (viewer, url) => {
    // 加载 CZML 数据并设置 clock
    Cesium.CzmlDataSource.load(url).then((czmlDataSource) => {
        // 将数据源添加到 Viewer
        viewer.dataSources.add(czmlDataSource);

        // 获取CZML中的时钟设置
        const czmlClock = czmlDataSource.clock;

        // 将 CZML 的时钟设置同步到 Viewer 的时钟
        viewer.clock.startTime = czmlClock.startTime;
        viewer.clock.stopTime = czmlClock.stopTime;
        viewer.clock.currentTime = czmlClock.currentTime;
        viewer.clock.clockRange = czmlClock.clockRange; // LOOP_STOP or other types
        viewer.clock.clockStep = czmlClock.clockStep;   // SYSTEM_CLOCK_MULTIPLIER or other
        viewer.clock.multiplier = czmlClock.multiplier; // 速度倍率
        viewer.clock.shouldAnimate = true
        // 设置时间轴的显示范围
        viewer.timeline.zoomTo(czmlClock.startTime, czmlClock.stopTime);
    });
}




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

<style>
.cesium-timeline-main {
    opacity: 0;
    pointer-events: none;
}
</style>