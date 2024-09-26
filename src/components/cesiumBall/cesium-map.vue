<template>
  <div id="cesiumContainer" class="cesium-container"></div>
</template>

<script>
import { mapData, drawSimpleLine } from "./cesiumUtil";
import data from "./test1.czml";
import { EventBus } from "@/assets/event-bus.js"; // 引入事件中心
import PositionInfoStatusBar from "../../common/PositionInfoStatusBar";
let viewer = "";
export default {
  name: "",
  data() {
    return {
      start: "",
      viewer: null,
      Dsq: false,
      lineArr1: [],
      lineArr2: [],
    };
  },
  created() {
    // Cesium.Ion.defaultAccessToken =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwYmY3ZmI0MC1jYTM4LTQyYjQtYjAyMS1iYjYxYjYwNTA0OWQiLCJpZCI6ODAyNjUsImlhdCI6MTY0MjcyNjM4OX0.qb0mnLfd6MKK_bTUkCFXJAHtFj_iTLfQIKktlkS5BZc";
  },
  mounted() {
    this.init();
    // 卫星模拟
    // this.satellite();
    // // 舰船航行
    this.Initflto();
    // this.Initflto1();
    // 加载czml模型
    this.satellCzml();
    // 绘制航迹
    this.addLine1();
    this.addLine2();
  },
  methods: {
    init() {
      let thin = this;
      viewer = new Cesium.Viewer("cesiumContainer", {
        baseLayerPicker: false, // 影像切换
        animation: true, //是否显示动画控件
        infoBox: false, //是否显示点击要素之后显示的信息
        geocoder: false, //是否显示地名查找控件
        timeline: true, //是否显示时间线控件
        fullscreenButton: false,
        shouldAnimate: true,
        navigationHelpButton: false, //是否显示帮助信息控件
        // terrainProvider: new Cesium.createWorldTerrain({
        //   requestWaterMask: true,
        //   requestVertexNormals: true,
        // }),
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: "/zxy/{z}/{x}/{y}.jpg", // url为文件夹地址
        })
      });
      this.viewer = viewer;
      mapData.viewer = viewer;
      window.viewer = viewer;
      viewer._cesiumWidget._creditContainer.style.display = "none";
      // viewer.terrainProvider = Cesium.createWorldTerrain();
      viewer.scene.screenSpaceCameraController.tiltEventTypes =
        Cesium.CameraEventType.RIGHT_DRAG;
      viewer.scene.screenSpaceCameraController.zoomEventTypes =
        Cesium.CameraEventType.WHEEL;
      new PositionInfoStatusBar(viewer);
      // 定义要暂停的时间
      var targetTime = Cesium.JulianDate.fromIso8601("2024-06-04T05:38:00Z");

      // 添加一个监听器以检查每一帧的时间
      viewer.clock.onTick.addEventListener(function (clock) {
        var currentTime = viewer.clock.currentTime;
        // 如果当前时间等于或超过目标时间，则暂停时钟
        if (
          Cesium.JulianDate.compare(currentTime, targetTime) >= 1 &&
          !thin.Dsq
        ) {
          thin.Dsq = true;
          console.log("时间轴停止");
          viewer.clock.shouldAnimate = false;
          thin.$emit("sendData", true);
        }
      });
      // 添加点击事件监听器
      viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
        movement
      ) {
        const pickedObject = viewer.scene.pick(movement.position);

        if (Cesium.defined(pickedObject)) {
          // 触发你的函数
          onModelClick(pickedObject);
        }
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 定义点击模型时触发的函数
      function onModelClick(pickedObject) {
        console.log("Model clicked!", pickedObject);
        console.log(pickedObject.id.id);
        var params = {
          id: pickedObject.id.id,
          HX: true,
        };
        thin.$emit("sendDataModel", params);
        // 这里添加你想要触发的逻辑
      }
    },
    satellCzml() {
      const satelliteNames = ["Satellite/xpg2.0"];
      const satelliteAll = [];
      viewer.dataSources.removeAll();
      viewer.dataSources
        .add(Cesium.CzmlDataSource.load("./models/simpleCZML.czml"))
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
            var cylinderEntity = viewer.entities.add({
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
    },
    Initflto() {
      let thin = this;
      var now = new Date();
      var yesterdayMidnight = new Date(2024, 5, 4);

      // 将日期转换为 Cesium 的 JulianDate 格式
      var start = Cesium.JulianDate.fromDate(yesterdayMidnight);
      start = Cesium.JulianDate.addHours(start, 8, new Cesium.JulianDate()); // 北京时间为 GMT+8

      // 设置结束时间为开始时间往后退6小时
      var stop = Cesium.JulianDate.addHours(start, 6, new Cesium.JulianDate());

      // 设置时钟开始时间
      viewer.clock.startTime = start.clone();
      // 设置时钟当前时间
      viewer.clock.currentTime = start.clone();
      // 设置时钟结束时间
      viewer.clock.stopTime = stop.clone();
      // 时间速率，数字越大时间过的越快，设置1好像是和实际时间一样
      viewer.clock.multiplier = 5;
      // 时间轴绑定到viewer上去
      viewer.timeline.zoomTo(start, stop);
      // 循环执行，到达终止时间，重新从起点时间开始
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

      var data1 = [
        { long: 121.399999, lat: 32.66277, height: 0, time: 0 },
        { long: 122.507572, lat: 31.570649, height: 0, time: 18000 },
        { long: 122.158023, lat: 30.493342, height: 0, time: 40000 },
      ];

      var data2 = [
        { long: 120.399999, lat: 33.66277, height: 0, time: 0 },
        { long: 121.507572, lat: 32.570649, height: 0, time: 18000 },
        { long: 121.158023, lat: 31.493342, height: 0, time: 40000 },
      ];

      let property1 = computeFlight(data1, start, 1);
      let property2 = computeFlight(data2, start, 2);

      function computeFlight(source, start, type) {
        let property = new Cesium.SampledPositionProperty();
        for (let i = 0; i < source.length; i++) {
          let time = Cesium.JulianDate.addSeconds(
            start,
            source[i].time,
            new Cesium.JulianDate()
          );
          let position = Cesium.Cartesian3.fromDegrees(
            source[i].long,
            source[i].lat,
            source[i].height
          );
          // // 绘制点位
          // thin.addPoint({
          //   lon: source[i].long,
          //   lat: source[i].lat,
          //   height:source[i].height
          // });

          // 存储点位绘制航迹
          if (type == 1) {
            thin.lineArr1.push(source[i].long, source[i].lat, source[i].height);
          } else {
            thin.lineArr2.push(source[i].long, source[i].lat, source[i].height);
          }

          // 添加位置，和时间对应
          property.addSample(time, position);
        }
        return property;
      }
      var entity1 = viewer.entities.add({
        id: "舰船1",
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop,
          }),
        ]),
        position: property1,
        orientation: new Cesium.VelocityOrientationProperty(property1),
        model: {
          uri: "./models/fightWarship.glb",
          minimumPixelSize: 80, //模型最小像素大小
          maximumScale: 100, //模型最大像素大小
          scale: 80.05,
          silhouetteColor:
            Cesium.Color.fromCssColorString("rgba(0, 255, 0, 1)"),
          silhouetteSize: 1,
        },
        // path: {
        //   resolution: 1,
        //   material: new Cesium.PolylineGlowMaterialProperty({
        //     glowPower: 0.2,
        //     color: Cesium.Color.BLUE,
        //   }),
        //   width: 2,
        // },
      });

      var entity2 = viewer.entities.add({
        id: "舰船2",
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop,
          }),
        ]),
        position: property2,
        orientation: new Cesium.VelocityOrientationProperty(property2),
        model: {
          uri: "./models/fightWarship.glb",
          scale: 80.05,
          minimumPixelSize: 80, //模型最小像素大小
          maximumScale: 100, //模型最大像素大小
          silhouetteColor:
            Cesium.Color.fromCssColorString("rgba(255, 0, 0, 1)"),
          silhouetteSize: 1,
        },
        // path: {
        //   resolution: 1,
        //   material: new Cesium.PolylineGlowMaterialProperty({
        //     glowPower: 0.2,
        //     color: Cesium.Color.BLUE,
        //   }),
        //   width: 2,
        // },
      });
    },
    Initflto1() {
      // 假设指定的时间字符串为 "2022-08-18 08:00:00"
      var specifiedTime = new Date("2024-06-04T05:36:00");
      var start = Cesium.JulianDate.fromDate(specifiedTime); // 设置时间轴当前时间为开始时间
      start = Cesium.JulianDate.addHours(start, 8, new Cesium.JulianDate()); // 开始时间加8小时改为北京时间
      var stop = Cesium.JulianDate.addSeconds(
        start,
        40000000,
        new Cesium.JulianDate()
      ); // 设置结束时间为开始时间加400秒
      // 设置时钟开始时间
      viewer.clock.startTime = start.clone();
      // 设置时钟当前时间
      viewer.clock.currentTime = start.clone();
      // 设置时钟结束时间
      viewer.clock.stopTime = stop.clone();
      // 时间速率，数字越大时间过的越快，设置1好像是和实际时间一样
      viewer.clock.multiplier = 5;
      // 时间轴绑定到viewer上去
      //   viewer.timeline.zoomTo(start, stop);
      // 循环执行，到达终止时间，重新从起点时间开始
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      // 监听每个帧渲染后的事件
      viewer.scene.postRender.addEventListener(function () {
        // 检查模型是否至少部分在相机视野中可见
        var model = viewer.entities.getById("yourModelId"); // 'yourModelId'是你加载的模型的ID
        if (Cesium.defined(model) && Cesium.defined(model.boundingSphere)) {
          var boundingSphere = model.boundingSphere;
          if (viewer.camera.frustum.intersectsBoundingSphere(boundingSphere)) {
            // 模型至少部分在相机视野中可见
            // 在这里编写你想要触发的事件逻辑
            console.log("模型被扫描到！");
          }
        }
      });
      //   ======================================================
      var data = [
        { long: 121.399999, lat: 32.66277, height: 0, time: 0 },
        { long: 122.507572, lat: 31.570649, height: 0, time: 18000 },
        { long: 122.158023, lat: 30.493342, height: 0, time: 40000 },
      ];
      var data1 = [
        { long: 122.399999, lat: 32.66277, height: 0, time: 0 },
        { long: 123.507572, lat: 31.570649, height: 0, time: 18000 },
        { long: 124.158023, lat: 30.493342, height: 0, time: 40000 },
      ];
      let property = computeFlight(data); // 这是通过一个方法把时间轴和船的位置信息绑定了
      let property1 = computeFlight(data1); // 这是通过一个方法把时间轴和船的位置信息绑定了
      let models = [];
      //   时间轴和船的位置信息绑定了
      function computeFlight(source) {
        let property = new Cesium.SampledPositionProperty();
        for (let i = 0; i < source.length; i++) {
          let time = Cesium.JulianDate.addSeconds(
            start,
            source[i].time,
            new Cesium.JulianDate()
          );
          let position = Cesium.Cartesian3.fromDegrees(
            source[i].long,
            source[i].lat,
            source[i].height
          );
          // 添加位置，和时间对应
          property.addSample(time, position);
        }
        return property;
      }
      //   添加并移动船
      var entity = viewer.entities.add({
        id: "yourModelId",
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop,
          }),
        ]),
        position: property,
        // 基于位置计算方向角
        orientation: new Cesium.VelocityOrientationProperty(property),
        model: {
          uri: "./models/fightWarship.glb", //gltf文件的URL
          scale: 30,
          minimumPixelSize: 32,
          maximumScale: 20000,
          //color: Cesium.Color.fromCssColorString("rgba(0, 253, 239, 0.6)"), // 船模型颜色
          silhouetteColor:
            Cesium.Color.fromCssColorString("rgba(0, 255, 0, 1)"), // 船模型边框颜色
          silhouetteSize: 1, // 船模型边框宽度
        },
      });
      var entity1 = viewer.entities.add({
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop,
          }),
        ]),
        position: property1,
        // 基于位置计算方向角
        orientation: new Cesium.VelocityOrientationProperty(property),
        model: {
          uri: "./models/fightWarship.glb", //gltf文件的URL
          scale: 30,
          minimumPixelSize: 32,
          maximumScale: 20000,
          //color: Cesium.Color.fromCssColorString("rgba(0, 253, 239, 0.6)"), // 船模型颜色
          silhouetteColor:
            Cesium.Color.fromCssColorString("rgba(0, 255, 0, 1)"), // 船模型边框颜色
          silhouetteSize: 1, // 船模型边框宽度
        },
        // path: {
        //   // 船路径
        //   resolution: 1, //
        //   material: new Cesium.PolylineGlowMaterialProperty({
        //     glowPower: 0.1, // 颜色透明度
        //     color: Cesium.Color.fromCssColorString("rgba(0, 253, 239, 0.5)"), // 路线颜色
        //   }),
        //   width: 2, // 路线的显示宽度
        // },
      });
      // viewer.trackedEntity = entity; // 视角跟随模型
      models = [entity, entity1];
      for (var i = 0; i < models.length; i++) {
        viewMOdel(models[i]);
      }
      function viewMOdel(entity) {
        // 创建一个例子系统
        // let particleSystem = viewer.scene.primitives.add(
        //   new Cesium.ParticleSystem({
        //     image: "./smoke.png", // 波浪图片
        //     startColor: Cesium.Color.fromCssColorString(
        //       "rgba(75, 125, 172, 0.6)"
        //     ), //粒子在其生命初期的颜色
        //     endColor: Cesium.Color.WHITE.withAlpha(0.0), //粒子在其生命结束的颜色
        //     startScale: 10.0, //粒子图像的初始比例
        //     endScale: 150.0, //粒子图像的结束比例
        //     minimumParticleLife: 1, //粒子生命的可能持续时间的最小范围
        //     maximumParticleLife: 6, //粒子生命的可能持续时间的最大范围
        //     speed: 20.0,
        //     emissionRate: 50.0, //每秒要发射的粒子数
        //     emitter: new Cesium.CircleEmitter(2), //粒子发射器样式圆形
        //     //imageSize: new Cesium.Cartesian2(2, 2),//粒子图像尺寸（以像素为单位）的minimumImageSize和maximumImageSize
        //     minimumImageSize: new Cesium.Cartesian2(0, 0),
        //     maximumImageSize: new Cesium.Cartesian2(2, 2),
        //     //主模型参数(位置)
        //     modelMatrix: computeModelMatrix(entity, Cesium.JulianDate.now()), //从模型转换为世界坐标的4x4转换矩阵
        //     emitterModelMatrix: computeEmitterModelMatrix(), // 粒子发射器模型矩阵，粒子发射器位置
        //   })
        // );
        // 在粒子系统局部坐标系内转换粒子系统发射器的4x4转换矩阵。
        function computeEmitterModelMatrix() {
          //方向
          let hpr = Cesium.HeadingPitchRoll.fromDegrees(
            80,
            80,
            80,
            new Cesium.HeadingPitchRoll()
          );
          var trs = new Cesium.TranslationRotationScale();
          //以modelMatrix(船)中心为原点的坐标系的xyz轴位置偏移
          trs.translation = Cesium.Cartesian3.fromElements(
            1700,
            0,
            0,
            new Cesium.Cartesian3()
          );
          trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(
            hpr,
            new Cesium.Quaternion()
          );
          return Cesium.Matrix4.fromTranslationRotationScale(
            trs,
            new Cesium.Matrix4()
          );
        }

        // 计算当前时间点船模型的位置矩阵 //从模型转换为世界坐标的4x4转换矩阵
        function computeModelMatrix(entity, time) {
          // //获取位置
          let position = Cesium.Property.getValueOrUndefined(
            entity.position,
            time,
            new Cesium.Cartesian3()
          );
          if (!Cesium.defined(position)) {
            return undefined;
          }
          //获取方向
          let modelMatrix;
          let orientation = Cesium.Property.getValueOrUndefined(
            entity.orientation,
            time,
            new Cesium.Quaternion()
          );
          if (!Cesium.defined(orientation)) {
            modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
              position,
              undefined,
              new Cesium.Matrix4()
            );
          } else {
            modelMatrix = Cesium.Matrix4.fromRotationTranslation(
              Cesium.Matrix3.fromQuaternion(orientation, new Cesium.Matrix3()),
              position,
              new Cesium.Matrix4()
            );
          }
          return modelMatrix;
        }
        // 粒子跟随模型
        // viewer.scene.preRender.addEventListener((scene, time) => {
        //   particleSystem.modelMatrix = computeModelMatrix(entity, time); // 粒子系统和模型绑定，让他跟着模型跑
        // });
      }
    },
    addPoint(ps) {
      // 添加点位
      viewer.entities.add({
        name: "point", // 所属的父级id
        position: Cesium.Cartesian3.fromDegrees(
          ps.lon,
          ps.lat,
          ps.height // 高度可以自己定义，也可以根据传进来的高度进行绘制
        ),
        point: {
          pixelSize: 5,
          // 点位颜色，fromCssColorString 可以直接使用CSS颜色
          color: Cesium.Color.fromCssColorString("tomato"),
          // 边框颜色
          outlineColor: Cesium.Color.fromCssColorString("#fff"),
          // 边框宽度(像素)
          outlineWidth: 2,
          // 显示在距相机的距离处的属性，多少区间内是可以显示的
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            15000000
          ),

          // 是否开启深度监测
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
    },
    addLine1() {
      if (this.lineArr1.length == 0) {
        return;
      }

      // 航迹线id
      let id = `line1`;

      viewer.entities.add({
        id, //  模型id
        name: "line1", // 所属的父级id
        // polyline 折线
        polyline: {
          // 参数依次为[经度1, 纬度1, 高度1, 经度2, 纬度2, 高度2]
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.lineArr1),
          // 注：线条起止，可以获取鼠标点击位置的经纬度进行线条绘制

          // 宽度
          width: 2,

          // 线的颜色
          material: Cesium.Color.fromCssColorString("tomato"), //  "tomato"

          clampToGround: false, // 不紧贴地面

          // 线的顺序,仅当`clampToGround`为true并且支持地形上的折线时才有效。
          zIndex: 999,

          // 显示在距相机的距离处的属性，多少区间内是可以显示的
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            15000000
          ),

          // 是否显示
          show: true,
        },
      });
    },
    addLine2() {
      if (this.lineArr2.length == 0) {
        return;
      }

      // 航迹线id
      let id = `line2`;

      viewer.entities.add({
        id, //  模型id
        name: "line2", // 所属的父级id
        // polyline 折线
        polyline: {
          // 参数依次为[经度1, 纬度1, 高度1, 经度2, 纬度2, 高度2]
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.lineArr2),
          // 注：线条起止，可以获取鼠标点击位置的经纬度进行线条绘制

          // 宽度
          width: 2,

          // 线的颜色
          material: Cesium.Color.fromCssColorString("#409EFF"), //  "tomato"

          clampToGround: false, // 不紧贴地面

          // 线的顺序,仅当`clampToGround`为true并且支持地形上的折线时才有效。
          zIndex: 999,

          // 显示在距相机的距离处的属性，多少区间内是可以显示的
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0,
            15000000
          ),

          // 是否显示
          show: true,
        },
      });
    },
    satellite() {
      this.start = new Cesium.JulianDate.fromDate(new Date()); // 获取当前时间 这不是国内的时间
      this.start = Cesium.JulianDate.addHours(
        this.start,
        8,
        new Cesium.JulianDate()
      ); // 添加八小时，得到我们东八区的北京时间
      this.stop = Cesium.JulianDate.addSeconds(
        this.start,
        1000,
        new Cesium.JulianDate()
      ); // 设置一个结束时间，意思是360秒之后时间结束
      this.viewer.clock.startTime = this.start.clone(); // 给cesium时间轴设置开始的时间，也就是上边的东八区时间
      this.viewer.clock.stopTime = this.stop.clone(); // 设置cesium时间轴设置结束的时间
      this.viewer.clock.currentTime = this.start.clone(); // 设置cesium时间轴设置当前的时间
      this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 时间结束了，再继续重复来一遍
      //时间变化来控制速度 // 时间速率，数字越大时间过的越快
      this.viewer.clock.multiplier = 2;
      //给时间线设置边界
      this.viewer.timeline.zoomTo(this.start, this.stop);

      this.arrStates = [];
      this.getRandState(this.arrStates, 20);
      this.startFunc();
    },

    computeCirclularFlight(source, panduan) {
      var property = new Cesium.SampledPositionProperty();
      if (panduan == 1) {
        //卫星位置
        for (var i = 0; i < source.length; i++) {
          var time = Cesium.JulianDate.addSeconds(
            this.start,
            source[i].time,
            new Cesium.JulianDate()
          );
          var position = Cesium.Cartesian3.fromDegrees(
            source[i].lon,
            source[i].lat,
            source[i].hei
          );
          // 添加位置，和时间对应
          property.addSample(time, position);
        }
      } else if (panduan == 2) {
        //轨道位置
        for (var i = 0; i < source.length; i++) {
          var time = Cesium.JulianDate.addSeconds(
            this.start,
            source[i].time,
            new Cesium.JulianDate()
          );
          var position = Cesium.Cartesian3.fromDegrees(
            source[i].lon,
            source[i].lat,
            source[i].phei
          );
          // 添加位置，和时间对应
          property.addSample(time, position);
        }
      }
      return property;
    },
    getRandState(brr, count) {
      let random = "";
      for (let i = 0; i < 50; i++) {
        let min = i * 100 + 1;
        let max = (i + 1) * 100;
        random = Math.floor(Math.random() * (max - min + 1) + min);
      }
      for (var m = 0; m < count; m++) {
        var arr = [];
        var t1 = Math.floor(Math.random() * 360);
        var t2 = Math.floor(Math.random() * 360);
        for (var i = t1; i <= 360 + t1; i += 30) {
          var aaa = {
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
    },
    getStatePath(aaa) {
      let that = this;
      var entity_ty1p = this.computeCirclularFlight(aaa, 2);
      var entity_ty1 = this.viewer.entities.add({
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: that.start,
            stop: that.stop,
          }),
        ]),
        position: entity_ty1p, //轨道高度
        orientation: new Cesium.VelocityOrientationProperty(entity_ty1p),
        cylinder: {
          HeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          length: 700000,
          topRadius: 0,
          bottomRadius: 900000 / 2,
          // material: Cesium.Color.RED.withAlpha(.4),
          // outline: !0,
          numberOfVerticalLines: 0,
          // outlineColor: Cesium.Color.RED.withAlpha(.8),
          material: Cesium.Color.fromBytes(35, 170, 242, 80),
        },
      });
      entity_ty1.position.setInterpolationOptions({
        interpolationDegree: 5,
        interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
      });
      var entity1p = this.computeCirclularFlight(aaa, 1);
      //创建实体
      var entity1 = this.viewer.entities.add({
        // 将实体availability设置为与模拟时间相同的时间间隔。
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: that.start,
            stop: that.stop,
          }),
        ]),
        position: entity1p, //计算实体位置属性
        //基于位置移动自动计算方向.
        orientation: new Cesium.VelocityOrientationProperty(entity1p),
        //加载飞机模型
        model: {
          uri: "./models/J-15.glb", //引入3D模型 -- 后面解释如何下载引入
          scale: 10000,
        },
        //路径
        path: {
          resolution: 1,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.1,
            color: Cesium.Color.PINK,
          }),
          width: 5,
        },
      });
      //差值器
      entity1.position.setInterpolationOptions({
        interpolationDegree: 5,
        interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
      });
      // var entity2 = this.viewer.entities.add({
      //   // 将实体availability设置为与模拟时间相同的时间间隔。
      //   availability: new Cesium.TimeIntervalCollection([
      //     new Cesium.TimeInterval({
      //       start: that.start,
      //       stop: that.stop,
      //     }),
      //   ]),
      //   position: entity1p, //计算实体位置属性
      //   //基于位置移动自动计算方向.
      //   orientation: new Cesium.VelocityOrientationProperty(entity1p),
      //   //加载飞机模型
      //   model: {
      //     uri: "./models/J-15.glb", //引入3D模型 -- 后面解释如何下载引入
      //     scale: 10000,
      //   },
      //   //路径
      //   path: {
      //     resolution: 1,
      //     material: new Cesium.PolylineGlowMaterialProperty({
      //       glowPower: 0.1,
      //       color: Cesium.Color.PINK,
      //     }),
      //     width: 5,
      //   },
      // });
      // //差值器
      // entity2.position.setInterpolationOptions({
      //   interpolationDegree: 5,
      //   interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
      // });
    },
    startFunc() {
      let that = this;
      for (var i = 0; i < that.arrStates.length; i++) {
        that.getStatePath(that.arrStates[i]);
      }
    },
  },
};
</script>
<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
