export const loadModelWithPath = (viewer, uri) => {
    viewer.shouldAnimate = true
    let position = new Cesium.SampledPositionProperty();
    let startTime = Cesium.JulianDate.now();
    let stopTime = Cesium.JulianDate.addSeconds(startTime, 60, new Cesium.JulianDate());
    let point1 = Cesium.Cartesian3.fromDegrees(114.0, 30.0, 1000); // 起点
    let point2 = Cesium.Cartesian3.fromDegrees(114.1, 30.1, 1000); // 中间点
    let point3 = Cesium.Cartesian3.fromDegrees(114.2, 30.2, 1000); // 终点
    position.addSample(startTime, point1);
    position.addSample(Cesium.JulianDate.addSeconds(startTime, 20, new Cesium.JulianDate()), point2);
    position.addSample(Cesium.JulianDate.addSeconds(startTime, 40, new Cesium.JulianDate()), point3);
    viewer.clock.startTime = startTime.clone();
    viewer.clock.stopTime = stopTime.clone();
    viewer.clock.currentTime = startTime.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 循环播放
    viewer.clock.multiplier = 10;
    let model = viewer.entities.add({
        position: position,
        model: {
            uri: uri,
            minimumPixelSize: 128,
            maximumScale: 20000
        },
        path: {
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                color: Cesium.Color.YELLOW
            }),
            width: 100
        }
    });
    viewer.trackedEntity = model;
}

export const loadCzml = (viewer, url) => {
    viewer.shouldAnimate = true
    viewer.camera.flyHome(0);
    const czmlDataSource = new Cesium.CzmlDataSource('czml-test');
    const promise = czmlDataSource.load(url).then(
        (datasource) => {
            viewer.dataSources.add(datasource);
            viewer.clock.multiplier = 1;
            if (czmlDataSource.entities.values.length > 0) {
                viewer.zoomTo(datasource);
                console.log(datasource.entities.values);
            } else {
                console.error('CZML 数据中没有可用的实体');
            }
        }).catch(function (error) {
            window.alert('czml加载error:', error);
        });
}


export const loadGlb = (viewer, url, position) => {// 加载 GLB 模型
    const model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
        url,
        modelMatrix: new Cesium.CallbackProperty(() => {
            return Cesium.Transforms.headingPitchRollToFixedFrame(
                position(),
                new Cesium.HeadingPitchRoll(0, 0, 0)
            )
        }),
        scale: 10.0
    }));
    viewer.camera.flyTo({
        destination: position,
        orientation: {
            heading: Cesium.Math.toRadians(90),
            pitch: Cesium.Math.toRadians(-30),
            roll: 0.0
        }
    });
}
