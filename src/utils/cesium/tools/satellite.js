
export function satellite(viewer, Cesium) {
    let start, stop

    // 获取当前的 UTC 时间，并将其转换为 Cesium 的 JulianDate 时间格式
    start = new Cesium.JulianDate.fromDate(new Date());

    // 中国标准时间是 UTC+8，所以我们将当前时间加上 8 小时，得到东八区的北京时间
    start = Cesium.JulianDate.addHours(start, 8, new Cesium.JulianDate());

    // 设置结束时间：从开始时间起增加 1000 秒作为结束时间
    stop = Cesium.JulianDate.addSeconds(start, 1000, new Cesium.JulianDate());

    // 设置 Cesium 时间轴的开始时间
    viewer.clock.startTime = start.clone();

    // 设置 Cesium 时间轴的结束时间
    viewer.clock.stopTime = stop.clone();

    // 将当前时间设置为开始时间
    viewer.clock.currentTime = start.clone();

    // 设置时间循环模式为 `LOOP_STOP`，即时间轴走完一次后停止，不循环
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

    // 设置时间变化的速率，这里设为 2，表示时间以 2 倍速流动
    viewer.clock.multiplier = 2;

    // 缩放时间轴的可视范围，使其正好显示从 `start` 到 `stop` 的时间段
    viewer.timeline.zoomTo(start, stop);

    // 初始化存储状态的数组，准备生成随机状态
    arrStates = [];

    // 调用 `getRandState` 方法生成随机状态，并存储在 `arrStates` 中，假设生成 20 个状态
    getRandState(arrStates, 20);

    // 开始执行任务或模拟（假设 `startFunc` 是执行的主要逻辑）
    // startFunc();
}


function getRandState(brr, count) {
    let random = "";
    for (let i = 0; i < 50; i++) {
        let min = i * 100 + 1;
        let max = (i + 1) * 100;
        random = Math.floor(Math.random() * (max - min + 1) + min);
    }
    for (let m = 0; m < count; m++) {
        let arr = [];
        let t1 = Math.floor(Math.random() * 360);
        let t2 = Math.floor(Math.random() * 360);
        for (let i = t1; i <= 360 + t1; i += 30) {
            let aaa = {
                lon: 0,
                lat: 0,
                hei: 700000 - parseFloat(random),
                phei: 700000 / 2,
                time: 0,
            };
            aaa.lon = t2;
            aaa.lat = i;
            aaa.time = i - t1;
            arr.push(aaa);
        }
        brr.push(arr);
    }
}



export function loadSatelliteCzml(viewer, url = 'models/simpleCZML.czml') {
    const satelliteNames = ["Satellite/xpg2.0"];
    const satelliteAll = [];
    viewer.dataSources.removeAll();
    viewer.dataSources
        .add(Cesium.CzmlDataSource.load(url))
        .then((dataSource) => {
            for (let i = 0; i < satelliteNames.length; i++) {
                satelliteAll.push(dataSource.entities.getById(satelliteNames[i]));
            }
            for (let i = 0; i < satelliteAll.length; i++) {
                let _update = function () {
                    let positions1 = satelliteAll[i].position.getValue(
                        viewer.clock.currentTime
                    );
                    if (positions1) {
                        let cartographic =
                            viewer.scene.globe.ellipsoid.cartesianToCartographic(
                                positions1
                            );
                        let lat = Cesium.Math.toDegrees(cartographic.latitude);
                        let lng = Cesium.Math.toDegrees(cartographic.longitude);
                        let hei = parseFloat(cartographic.height / 2.1);
                        return Cesium.Cartesian3.fromDegrees(lng, lat, hei);
                    }
                };
                let _updates = function () {
                    let positions1s = satelliteAll[i].position.getValue(
                        viewer.clock.currentTime
                    );
                    if (positions1s) {
                        let cartographics =
                            viewer.scene.globe.ellipsoid.cartesianToCartographic(
                                positions1s
                            );
                        let heis = parseFloat(cartographics.height);
                        return heis;
                    }
                };
                let cylinderEntity = viewer.entities.add({
                    id: "Satellitegreen",
                    position: new Cesium.CallbackProperty(_update, false),
                    cylinder: {
                        HeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        length: new Cesium.CallbackProperty(_updates, false),
                        topRadius: 0.0,
                        bottomRadius:
                            new Cesium.CallbackProperty(_updates, false).getValue() / 6,
                        material: Cesium.Color.GREEN.withAlpha(0.8),
                        outline: !0,
                        numberOfVerticalLines: 0,
                        outlineColor: Cesium.Color.GREEN.withAlpha(0.8),
                    },
                });
            }
        });
}
