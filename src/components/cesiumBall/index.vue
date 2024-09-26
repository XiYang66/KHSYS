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
    let viewer = await init({
        container: 'cesiumContainer',
    });
    await CesiumStoreInit.SET_VIEWER(viewer);
    loadCzml(viewer);
    loadGlb(viewer);
});


const loadCzml = (viewer) => {
    const simpleCZML = '/models/simpleCZML.czml';
    let dataSource = Cesium.CzmlDataSource.load(simpleCZML);
    viewer.dataSources.add(dataSource);
 
}

const newyork = Cesium.Cartesian3.fromDegrees(-74.012984, 40.705327, 100);

const loadGlb = (viewer) => {// 加载 GLB 模型
    const model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
        url: 'models/fightWarship.glb',
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
            newyork,
            new Cesium.HeadingPitchRoll(0, 0, 0)
        ),
        scale: 10.0
    }));
    viewer.camera.flyTo({
        destination: newyork,
        orientation: {
            heading: Cesium.Math.toRadians(90),
            pitch: Cesium.Math.toRadians(-30),
            roll: 0.0
        }
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