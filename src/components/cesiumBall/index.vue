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

import { loadCzml, loadGlb, loadModelWithPath } from '@/utils/cesium/tools/loadModel.js'

const testPosition = new Cesium.Cartesian3(2789310.3296809793, -4804819.234050206, 3122241.557783857)

// 生命周期
onMounted(async () => {
    let viewer = init({
        container: 'cesiumContainer',
    });
    position(viewer)

    await CesiumStoreInit.SET_VIEWER(viewer);
    // loadCzml(viewer);
    loadGlb(viewer, '/models/fightWarship.glb',testPosition);
    // loadModelWithPath(viewer, '/models/fightWarship.glb');


});

let cart3 = testPosition;
const position = (viewer) => {
    let globeEllipsoid = viewer.scene.globe.ellipsoid;
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((movement) => {
        let cartesian = viewer.camera.pickEllipsoid(
            movement.endPosition,
            globeEllipsoid
        );
        if (cartesian) {
            cart3 = cartesian;
            // console.log(cart3);
        }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
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