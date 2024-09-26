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

// 生命周期
onMounted(async () => {
    let viewer = await init({
        container: 'cesiumContainer',
    });
    await CesiumStoreInit.SET_VIEWER(viewer);
    setupTimeline(viewer)
    loadSatelliteCzml(viewer)
});




// 加载卫星 CZML 数据，并让卫星在轨道上移动
const start = ref(null);
const stop = ref(null);
let simpleCZML = '/models/simpleCZML.czml'
const loadSatelliteCzml = (viewer) => {
    viewer.shouldAnimate = true
    const satelliteNames = ["Satellite/xpg2.0"];
    const satelliteAll = [];
    viewer.dataSources.removeAll(); // 清除所有现有数据源
    viewer.dataSources
        .add(Cesium.CzmlDataSource.load(simpleCZML))
        .then((dataSource) => {
            for (let i = 0; i < satelliteNames.length; i++) {
                satelliteAll.push(dataSource.entities.getById(satelliteNames[i]));
            }
            for (let i = 0; i < satelliteAll.length; i++) {
                // 更新卫星位置
                const updatePosition = () => {
                    const positions = satelliteAll[i].position.getValue(
                        viewer.clock.currentTime
                    );
                    if (positions) {
                        const cartographic =
                            viewer.scene.globe.ellipsoid.cartesianToCartographic(
                                positions
                            );
                        const lat = Cesium.Math.toDegrees(cartographic.latitude);
                        const lng = Cesium.Math.toDegrees(cartographic.longitude);
                        const hei = parseFloat(cartographic.height / 2.1);
                        return Cesium.Cartesian3.fromDegrees(lng, lat, hei);
                    }
                };

                // 更新卫星高度
                const updateHeight = () => {
                    const positions = satelliteAll[i].position.getValue(
                        viewer.clock.currentTime
                    );
                    if (positions) {
                        const cartographic =
                            viewer.scene.globe.ellipsoid.cartesianToCartographic(
                                positions
                            );
                        return parseFloat(cartographic.height);
                    }
                };

                // 添加实体，显示卫星的可视化模型
                viewer.entities.add({
                    id: "Satellitegreen",
                    position: new Cesium.CallbackProperty(updatePosition, false),
                    cylinder: {
                        HeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        length: new Cesium.CallbackProperty(updateHeight, false),
                        topRadius: 0.0,
                        bottomRadius:
                            new Cesium.CallbackProperty(updateHeight, false).getValue() /
                            6,
                        material: Cesium.Color.GREEN.withAlpha(0.8),
                        outline: true,
                        numberOfVerticalLines: 0,
                        outlineColor: Cesium.Color.GREEN.withAlpha(0.8),
                    },
                });
            }
        });
};
const setupTimeline = (viewer) => {
    start.value = Cesium.JulianDate.addHours(
        Cesium.JulianDate.fromDate(new Date()),
        8, // 东八区时间
        new Cesium.JulianDate()
    );
    stop.value = Cesium.JulianDate.addSeconds(
        start.value,
        1000, // 持续时间 1000 秒
        new Cesium.JulianDate()
    );

    viewer.clock.startTime = start.value.clone();
    viewer.clock.stopTime = stop.value.clone();
    viewer.clock.currentTime = start.value.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 停止后不循环
    viewer.clock.multiplier = 2; // 时间倍速
    // viewer.timeline.zoomTo(start.value, stop.value); // 缩放时间线范围
};



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