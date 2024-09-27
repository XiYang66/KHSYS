// 不生效
// let handler;
// const bindevent = (viewer, czmlDataSource) => {
//     handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
//     handler.setInputAction((movement) => {
//         const pickedObject = viewer.scene.pick(movement.position);
//         if (Cesium.defined(pickedObject) && pickedObject.id) {
//             const entity = pickedObject.id; 
//             viewer.flyTo(entity, {
//                 duration: 2.0,
//                 offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 500)
//             })
//             viewer.trackedEntity = entity;
//         }
//     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
// }
// async function loadCzml(viewer, czml) {
//     const res = await Cesium.CzmlDataSource.load(czml)
//     viewer.clock.shouldAnimate = true;
//     viewer.dataSources.add(res);
//     bindevent(viewer, res)
//     return res
// }


// 生效
// let handler;
// async function loadCzml(viewer, czml) {
//     Cesium.CzmlDataSource.load(czml).then(
//         (czmlDataSource) => {
//             viewer.clock.shouldAnimate = true;
//             viewer.dataSources.add(czmlDataSource);
//             viewer.flyTo(czmlDataSource)
//             handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
//             handler.setInputAction((movement) => {
//                 const pickedObject = viewer.scene.pick(movement.position);
//                 if (Cesium.defined(pickedObject) && pickedObject.id) {
//                     const entity = pickedObject.id;
//                     viewer.flyTo(entity, {
//                         duration: 2.0,
//                         offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 500)
//                     })
//                     viewer.trackedEntity = entity;
//                 }
//             }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//             return czmlDataSource;
//         }).catch((error) => {
//             console.error('Error loading CZML or model:', error);
//         });
// }
