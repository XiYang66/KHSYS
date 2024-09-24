import toolPositioningStore from "@/ktStore/cesium/tools/positioning";
let ellipsoid = {};

export function positioning(viewer) {
  const toolPositioning = toolPositioningStore();
  let globeEllipsoid = viewer.scene.globe.ellipsoid;
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((movement) => {
    //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
    let cartesian = viewer.camera.pickEllipsoid(
      movement.endPosition,
      globeEllipsoid
    );
    if (cartesian) {
      //将笛卡尔三维坐标转为地图坐标（弧度）
      let cartographic = globeEllipsoid.cartesianToCartographic(cartesian);
      //将地图坐标（弧度）转为十进制的度数
      let latitude = Cesium.Math.toDegrees(cartographic.latitude);
      let longitude = Cesium.Math.toDegrees(cartographic.longitude);
      // 获取相机的海拔高度作为视角高度/km
      let altitude = viewer.camera.positionCartographic.height;
      // 海拔
      let elevation = viewer.scene.globe.getHeight(cartographic);
      // 视角方向
      let angle = Cesium.Math.toDegrees(viewer.camera.heading);
      // 俯仰角
      let pitch = Cesium.Math.toDegrees(viewer.camera.pitch);
      ellipsoid = {
        longitude: longitude.toFixed(5),
        latitude: latitude.toFixed(5),
        elevation: -(-elevation).toFixed(2),
        altitude: altitude.toFixed(2),
        angle: angle.toFixed(0),
        pitch: pitch.toFixed(0),
      };
      toolPositioning.SET_ELLIPSOID(ellipsoid);
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.setInputAction((movement) => {
    // 获取相机的海拔高度作为视角高度/km
    let altitude = viewer.camera.positionCartographic.height;
    ellipsoid.altitude = altitude.toFixed(2);
    toolPositioning.SET_ELLIPSOID(ellipsoid);
  }, Cesium.ScreenSpaceEventType.WHEEL);
}
