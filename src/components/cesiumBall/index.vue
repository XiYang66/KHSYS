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
    // 清除影像
    // viewer.imageryLayers.removeAll();
    // // 加载影像

    // const ImageryProvider0_13 = new Cesium.UrlTemplateImageryProvider({
    //     url: '/15wp/{z}/{x}/{reverseY}.png',//0-13层影像
    //     tilingScheme: new Cesium.GeographicTilingScheme({}),
    // });
    // viewer.imageryLayers.addImageryProvider(ImageryProvider0_13);

    // const ImageryProvider14 = new Cesium.UrlTemplateImageryProvider({
    //     url: '/14wp/{z}/{x}/{reverseY}.png',//14层影像
    //     tilingScheme: new Cesium.GeographicTilingScheme({}),
    // });
    // viewer.imageryLayers.addImageryProvider(ImageryProvider14);
});


const loadCzml = (viewer) => {
    const czmlUrl = 'models/simpleCZML.czml'; // 替换为你的 CZML 文件路径

    // 创建 CZML 数据源并加载数据
    const czmlDataSource = new Cesium.CzmlDataSource();
    czmlDataSource.load(czmlUrl).then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        viewer.clock.multiplier = 10; // 加快时间步进速度
        viewer.zoomTo(dataSource); // 自动缩放到 CZML 对象
    }).otherwise(function (error) {
        console.error('CZML 加载错误:', error);
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