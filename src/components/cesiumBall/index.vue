<template>
    <div class="cesiumBox">
        <div id="cesiumContainer" ref="cesiumContainer"></div>
    </div>
    <!-- 滑块工具 -->
    <!-- <DatGui /> -->
</template>
<script setup>
// 引入vue3的api
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue';
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
    viewer.clock.shouldAnimate = true
    await CesiumStoreInit.SET_VIEWER(viewer);
    const model = loadShip(viewer, '/models/fightWarship.glb')

    await sleep(5000)

    await loadCzml(viewer, '/models/simpleCZML.czml')
    // console.log(viewer.dataSources)


})

let handler;
let entity;//picked
let scale;
const names = [
    '尖兵十三号01星',
    '尖兵十三号02星',
    '尖兵十三号03星',
    '尖兵十三号04星',
    '光学十三号01星',
    '光学十三号02星',
    '光学十三号03星',
    '尖兵八号改01组A星',
    '尖兵八号改01组B星',
    '尖兵八号改01组C星',
    '尖兵八号改01组D星',
    '尖兵十三号01星',
    '尖兵十三号02星',
    '尖兵十三号03星',
    '尖兵十三号04星',
    '光学十三号01星',
    '光学十三号02星',
    '光学十三号03星',
    '尖兵八号改01组A星',
    '尖兵八号改01组B星',
    '尖兵八号改01组C星',
    '尖兵八号改01组D星',
    '尖兵十三号01星',
    '尖兵十三号02星',
    '尖兵十三号03星',
    '尖兵十三号04星',
    '光学十三号01星',
    '光学十三号02星',
    '光学十三号03星',
    '尖兵八号改01组A星',
    '尖兵八号改01组B星',
    '尖兵八号改01组C星',
    '尖兵八号改01组D星',
    '尖兵十三号01星',
    '尖兵十三号02星',
    '尖兵十三号03星',
    '尖兵十三号04星',
    '光学十三号01星',
    '光学十三号02星',
    '光学十三号03星',
    '尖兵八号改01组A星',
    '尖兵八号改01组B星',
    '尖兵八号改01组C星',
    '尖兵八号改01组D星',
]
async function loadCzml(viewer, czml) {
    Cesium.CzmlDataSource.load(czml).then(
        async (czmlDataSource) => {
            viewer.clock.shouldAnimate = true;
            viewer.dataSources.add(czmlDataSource);
            const allEntities = czmlDataSource.entities.values
            let index = 0
            allEntities.forEach(entity => {
                const text = entity.label.text
                text._value = names[index++]

            })
            handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction((movement) => {
                const pickedObject = viewer.scene.pick(movement.position);
                if (Cesium.defined(pickedObject) && pickedObject.id) {
                    entity = pickedObject.id;
                    viewer.flyTo(entity, {
                        duration: 2.0,
                        offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 500)
                    })
                    // console.log('Picked Entity:', entity)
                    scale = entity.billboard.scale
                    entity.billboard.scale = 20
                    viewer.trackedEntity = entity;
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            handler.setInputAction((movement) => {
                entity.billboard.scale = scale
                viewer.camera.flyHome(2.0);
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
            viewer.camera.flyHome(2.0);
        }).catch((error) => {
            console.error('Error loading CZML or model:', error);
        });
}
let positions_ship = []
const loadShip = (viewer, uri) => {
    fetch('尼米兹号.json').then(res => {
        let json = res.json()
        json.then(data => {
            positions_ship = convertToCartesian3(data.RECORDS);
            // console.log(positions_ship);
            loadShipDynamic2(viewer, uri, positions_ship)
            // 
            viewer.entities.add({
                polyline: {
                    positions: positions_ship,
                    width: 1,
                    material: Cesium.Color.YELLOW
                }
            })
        })
    })

}
function convertToCartesian3(records) {
    let positions = [];
    for (let record of records) {
        let longitude = parseFloat(record["JD"]);
        let latitude = parseFloat(record["WD"]);
        let position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0); // Assuming height 0
        positions.push(position);
    }
    return positions;
}

const loadShipDynamic2 = (viewer, uri, cartesianPositions) => {
    let customDataSource = new Cesium.CustomDataSource('customModels');
    viewer.dataSources.add(customDataSource);
    viewer.clock.shouldAnimate = true;
    let positionProperty = new Cesium.SampledPositionProperty();
    let startTime = Cesium.JulianDate.now();
    let timeInterval = 10;
    for (let i = 0; i < cartesianPositions.length; i++) {
        let time = Cesium.JulianDate.addSeconds(startTime, i * timeInterval, new Cesium.JulianDate());
        positionProperty.addSample(time, cartesianPositions[i]);
    }
    let stopTime = Cesium.JulianDate.addSeconds(startTime, cartesianPositions.length * timeInterval, new Cesium.JulianDate());
    viewer.clock.startTime = startTime.clone();
    viewer.clock.stopTime = stopTime.clone();
    viewer.clock.currentTime = startTime.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.multiplier = 200;
    let modelEntity = customDataSource.entities.add({
        position: positionProperty,
        model: {
            uri,
            scale: 30000,
        },
        path: {
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.5,
                color: Cesium.Color.YELLOW
            }),
            width: 10
        }
    });
    viewer.flyTo(modelEntity, {
        duration: 2.0,
        offset: new Cesium.HeadingPitchRange(
            Cesium.Math.toRadians(0),
            Cesium.Math.toRadians(-45),
            50000000
        )
    });
    // viewer.trackedEntity = modelEntity;

    return modelEntity;
}
onBeforeUnmount(() => {
    handler && handler.destroy()
})




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