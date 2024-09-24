/*
 * @Author: XC
 * @Date: 2024-08-09 15:08:45
 * @LastEditors: XC
 * @LastEditTime: 2024-08-12 09:23:33
 * @Description: file information
 * @Company: kan-tian
 */
class HawkEyeMap {
  constructor(viewer) {
    this._viewer = viewer;
    this._hawkEyeMap = null;
    this._init(); // 在构造函数中直接调用 _init() 方法
  }

  // 初始化函数
  _init() {
    this._hawkEyeMap = new Cesium.Viewer("hawkEyeMapContainer", {
      animation: false, //是否创建动画小器件，左下角仪表
      baseLayerPicker: false, //是否显示图层选择控件
      fullscreenButton: false, //是否显示全屏按钮
      vrButton: false, // vr部件
      geocoder: false, // 位置搜索部件
      homeButton: false, //是否显示Home按钮
      infoBox: false, //是否显示点击要素之后显示的信息
      sceneModePicker: false, // 二三维切换部件
      timeline: false, //是否显示时间线控件
      navigationHelpButton: false, //是否显示帮助信息控件
      navigationInstructionsInitiallyVisible: false, // 导航说明显示
      scene3DOnly: true, //每个几何实例将只能以3D渲染以节省GPU内存
      shouldAnimate: false,
      skyBox: false, // 配置天空盒子或不显示天空盒子
      skyAtmosphere: false, // 配置大气或不显示大气
      useDefaultRenderLoop: true, // 控制是否继续渲染
      maximumScreenSpaceError: 64, //屏幕空间最大误差
      showRenderLoopErrors: false, // 报错是否弹出错误
      useBrowserRecommendedResolution: false, // 设置为false使用window.devicePixelRatio属性
      automaticallyTrackDataSourceClocks: false, // 设置成true，使用公共clock对象，设置false，所有功能使用独立clock对象
      sceneMode: 3, //初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
      shadows: false, // 是否打开阴影
      terrainShadows: Cesium.ShadowMode.DISABLED, // 是否打开地形阴影
      resolutionScale: 1, //清晰度 0-1
      requestRenderMode: true, //启用请求渲染模式
      maximumRenderTimeChange: Infinity,
      fullscreenElement: false,
    });
    this._hawkEyeMap.cesiumWidget.creditContainer.style.display = "none";
    this._hawkEyeMap.scene.backgroundColor = Cesium.Color.TRANSPARENT;
    this._hawkEyeMap.imageryLayers.removeAll();
    this._hawkEyeMap.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: "./zxy/{z}/{x}/{y}.jpg", //服务地址
      })
    );
    // 引起事件监听的相机变化幅度
    this._viewer.camera.percentageChanged = 0.01;
    this._bindEvent();
  }

  // 绑定事件
  _bindEvent() {
    // 监听主图相机变化
    this._viewer.camera.changed.addEventListener(this._syncMap.bind(this));
    this._viewer.scene.preRender.addEventListener(this._syncEyeMap.bind(this));
  }
  _syncMap() {
    // 直接设置相机位置和姿态，而不是使用 flyTo 方法
    this._hawkEyeMap.camera.setView({
      destination: this._viewer.camera.positionWC,
      orientation: {
        heading: this._viewer.camera.heading,
        pitch: this._viewer.camera.pitch,
        roll: this._viewer.camera.roll,
      },
    });
  }
  // 同步鹰眼地图
  _syncEyeMap() {
    this._hawkEyeMap.scene.requestRender();
  }
}
export default HawkEyeMap;
