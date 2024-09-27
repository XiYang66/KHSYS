<template>
    <div class="datGui">

    </div>
</template>

<script setup>
// 引入vue3的api
import { ref, reactive, onMounted, defineExpose } from "vue"
// 滑块工具
import * as dat from 'dat.gui';
// store 仓库
import CesiumStore from "@/store/cesium";
const CesiumStoreInit = CesiumStore()

// 定义变量
var options = reactive({
    lon: 0,
    lat: 0,
    cameraHeight: 20000000,
    heading: 0,
    pitch: -90,
    roll: 0,
});
// 生命周期
onMounted(() => {
    guiInit()
})
// 初始化
const guiInit = () => {
    const gui = new dat.GUI({ locale: 'zh' });
    gui.domElement.style = 'position:absolute;top:65px;left:10px;'
    gui.add(options, "lon", -180, 180).name('经度').step(0.00001).onChange((value) => {
        options.lon = value
        setAngleViewer(CesiumStoreInit.viewer, options)
    });
    gui.add(options, "lat", -90, 90).name('纬度').step(0.00001).onChange((value) => {
        options.lat = value
        setAngleViewer(CesiumStoreInit.viewer, options)
    });
    gui.add(options, "cameraHeight", 10, 100000000).name('相机高度').step(0.00001).onChange((value) => {
        options.cameraHeight = value
        setAngleViewer(CesiumStoreInit.viewer, options)
    });
    gui.add(options, "heading", 0, 360).name('偏航角').step(0.00001).onChange((value) => {
        options.heading = value
        setAngleViewer(CesiumStoreInit.viewer, options)
    });
    gui.add(options, "pitch", -90, -60).name('俯仰角').step(0.00001).onChange((value) => {
        options.pitch = value
        setAngleViewer(CesiumStoreInit.viewer, options)
    });
    gui.add(options, "roll", -180, 180).name('滚转角').step(0.00001).onChange((value) => {
        options.roll = value
        setAngleViewer(CesiumStoreInit.viewer, options)
    });
    gui.domElement.onmousedown = function (Event) {
        Event = Event || window.Event;
        var left = Event.clientX - gui.domElement.offsetLeft;
        var top = Event.clientY - gui.domElement.offsetTop;
        if (Event.target.closest('input')) {
            return; // 如果点击的是输入框，直接返回
        }
        if (Event.target.className === 'property-name') {
            document.onmousemove = function (event) {
                event = event || window.event;
                gui.domElement.style.left = event.clientX - left + 'px';
                gui.domElement.style.top = event.clientY - top + 'px';
            };
        }

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };

        Event.preventDefault();
    }
};
// 设置viewer 位置 角度
const setAngleViewer = (viewer, options) => {
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(options.lon, options.lat, options.cameraHeight),
        orientation: {
            heading: Cesium.Math.toRadians(options.heading),//偏航角
            pitch: Cesium.Math.toRadians(options.pitch),//俯仰角
            roll: Cesium.Math.toRadians(options.roll),//滚转角
        }
    });
}
//暴露方法
defineExpose({})
</script>

<style lang="scss" scoped></style>