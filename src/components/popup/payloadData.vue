<template>
    <div class="payloadData">
        <el-row class="title row0">
            <el-col :span="24">任务</el-col>
        </el-row>
        <el-row class="name row1">
            <el-col class="label col" :span="24">
                <div class="chart">
                    <div class="innerChart" id="viewer2" style="background-color: rgb(91, 91, 169);">
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row class="title row2">
            <el-col :span="24">遥感影像帧</el-col>
        </el-row>
        <el-row class="row3">
            <el-col :span="6" v-for="url in urls">
                <el-image style="width: 113px; height: 126px" :src="url" fit="fill" />
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue';
import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
} from '@element-plus/icons-vue'
import { init } from '@/utils/cesium/init'
const urls = ['遥感影像帧/a.png','遥感影像帧/b.tif','遥感影像帧/c.tif','遥感影像帧/d.tif']


onMounted(async () => {
    let viewer2 = await init({
        container: 'viewer2',
    });

    viewer2.scene.mode = Cesium.SceneMode.SCENE2D
    viewer2.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000)
    });
    loadGlb(viewer2)
})

// const position = Cesium.Cartesian3.fromDegrees(0, 0, 100);
// const loadGlb = (viewer) => {// 加载 GLB 模型
//     const model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
//         url: 'models/fightWarship.glb',
//         modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
//             position,
//             new Cesium.HeadingPitchRoll(0, 0, 0)
//         ),
//         scale: 10.0
//     }));
   
//     viewer.camera.flyTo({
//         destination: position,
//         orientation: {
//             heading: Cesium.Math.toRadians(90),
//             pitch: Cesium.Math.toRadians(-30),
//             roll: 0.0
//         }
//     });
// }

</script>


<style lang="scss" scoped>
@import '@/assets/css/_var.scss';
@import '@/assets/css/mixin.scss';
@import '@/assets/css/element.scss';

.payloadData {
    // width: $popupWidth;
    height: $popupHeight;
    background-color: $color1;

    .title {
        margin-top: 5%;
        text-align: center;
        font-size: $fontSize*1.3;
        color: $color3;
        text-shadow: 0 0 5px $active-color, 0 0 5px $active-color,
    }

    .row1 {
        width: 100%;
        height: 50%;
        margin-bottom: 10%;
    }

    .row2 {
        margin-bottom: 2%;
    }
}

.chart {
    height: 100%;
    width: 100%;
    margin: 0 auto;
    margin-top: 2%;

    .innerChart {
        margin: 0 auto;
        height: 300px;
        width: $popupWidth;
    }
}
</style>

