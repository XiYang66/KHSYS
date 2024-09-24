/*
 * 自由线标绘功能
 */
import CreateRemindertip from "../thirdPart/ReminderTip";
import { newSessionid } from "../thirdPart/plotCommon";
import { getCatesian3FromPX } from "../thirdPart/Coordinate";

const CreateFreeLine = (viewer, handler, resultList, options, callback) => {
  const id = options.id || newSessionid();
  const color = options.color
    ? Cesium.Color.fromCssColorString(options.color)
    : Cesium.Color.BLUE.withAlpha(0.9);
  const onground = options.onground || true;
  if (viewer.entities.getById(id))
    throw new Error("the id parameter is an unique value");
  window.toolTip = "左键点击开始绘制";
  let anchorpoints = [];
  let polyline = undefined;
  // 左键点击事件
  handler.setInputAction((event) => {
    window.toolTip = "鼠标移动绘制，左键双击结束绘制";
    let pixPos = event.position;
    let cartesian = getCatesian3FromPX(viewer, pixPos);
    if (!cartesian) {
      return;
    }
    if (anchorpoints.length == 0) {
      anchorpoints.push(cartesian);
      polyline = viewer.entities.add({
        name: "FreeLine",
        id: id,
        polyline: {
          show: true,
          positions: new Cesium.CallbackProperty(function () {
            return anchorpoints;
          }, false),
          width: 15,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.3,
            color: color,
          }),
          clampToGround: onground,
        },
      });
      polyline.GeoType = "FreeLine"; //记录对象的类型，用户后续编辑等操作
      polyline.Editable = false; //代表当前对象可编辑,false状态下不可编辑
    }
    anchorpoints.push(cartesian);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  // 鼠标移动事件
  handler.setInputAction((movement) => {
    let endPos = movement.endPosition;
    CreateRemindertip(window.toolTip, endPos, true);
    if (anchorpoints.length > 1) {
      let cartesian = getCatesian3FromPX(viewer, endPos);
      if (!cartesian) {
        return;
      }
      anchorpoints.push(cartesian);
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  // 左键双击事件
  handler.setInputAction((event) => {
    polyline.PottingPoint = anchorpoints;
    resultList.push(polyline);
    handler.destroy();
    CreateRemindertip(window.toolTip, event.position, false);
    if (callback && typeof callback == "function") callback(polyline);
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
};
export default CreateFreeLine;
