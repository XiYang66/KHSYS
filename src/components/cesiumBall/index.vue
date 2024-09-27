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
let simpleCZML = '/models/simpleCZML.czml'
let glb = '/models/fightWarship.glb'
// 生命周期
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}
onMounted(async () => {
    let viewer = await init({
        container: 'cesiumContainer',
        timeline: true,
    });
    await CesiumStoreInit.SET_VIEWER(viewer);
    await loadCzml(viewer, '/models/simpleCZML.czml')
    const model = loadModelWithPath(viewer, '/models/fightWarship.glb')
    // viewer.dataSources.removeAll()
    // console.log(model.name)
    await sleep(3000)
    viewer.flyTo(model)
    await sleep(1000)
    viewer.trackedEntity = model;
})

function loadCzml(viewer, czml) {
    Cesium.CzmlDataSource.load(czml).then((czmlDataSource) => {
        viewer.clock.shouldAnimate = true;
        viewer.dataSources.add(czmlDataSource);
        viewer.flyTo(czmlDataSource)
        return czmlDataSource;
    }).catch((error) => {
        console.error('Error loading CZML or model:', error);
    });
}

const loadModelWithPath = (viewer, uri) => {
    viewer.clock.shouldAnimate = true
    let position = new Cesium.SampledPositionProperty();
    let startTime = Cesium.JulianDate.now();
    let stopTime = Cesium.JulianDate.addSeconds(startTime, 60, new Cesium.JulianDate());
    let point1 = Cesium.Cartesian3.fromDegrees(0, 0, 100); // 起点
    let point2 = Cesium.Cartesian3.fromDegrees(-100, -100, 100); // 中间点
    let point3 = Cesium.Cartesian3.fromDegrees(0, 0, 100); // 终点
    position.addSample(startTime, point1);
    position.addSample(Cesium.JulianDate.addSeconds(startTime, 20, new Cesium.JulianDate()), point2);
    position.addSample(Cesium.JulianDate.addSeconds(startTime, 40, new Cesium.JulianDate()), point3);
    viewer.clock.startTime = startTime.clone();
    viewer.clock.stopTime = stopTime.clone();
    viewer.clock.currentTime = startTime.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 循环播放
    viewer.clock.multiplier = 1;

    const pos = Cesium.Cartesian3.fromDegrees(0, 0, 0)
    let model = viewer.entities.add({
        name: 'ship',
        position: new Cesium.CallbackProperty(() => {
            return pos
        }, false),
        // position: position,
        model: {
            uri: uri,
            minimumPixelSize: 128,
            maximumScale: 20000,
            scale: 20000,
        },
        path: {
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 1,
                color: Cesium.Color.YELLOW
            }),
            width: 100
        }
    });
    return model;
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
    /* opacity: 0;
    pointer-events: none; */
}
</style>