/*
 * 矩形标绘功能
 */
import CreateRemindertip from "../thirdPart/ReminderTip";
import {
  newSessionid,
  calculateRectanglePoints,
} from "../thirdPart/plotCommon";
import { getCatesian3FromPX } from "../thirdPart/Coordinate";

const CreateRectangle = (viewer, handler, resultList, options, callback) => {
  const id = options.id || newSessionid();
  const color = options.color
    ? Cesium.Color.fromCssColorString(options.color)
    : Cesium.Color.BLUE.withAlpha(0.4);
  const onground = options.onground || true;
  if (viewer.entities.getById(id))
    throw new Error("the id parameter is an unique value");
  window.toolTip = "左键点击开始绘制";
  let anchorpoints = []; //记录矩形的左上和右下两个点
  let rectangle = undefined;
  // 左键点击事件
  handler.setInputAction((event) => {
    window.toolTip = "左键双击键结束绘制";
    let pos = getCatesian3FromPX(viewer, event.position);
    if (!pos || Cesium.defined(rectangle)) return;
    anchorpoints.push(pos);
    let dynamicRectangle = new Cesium.CallbackProperty(function () {
      return Cesium.Rectangle.fromCartesianArray(
        calculateRectanglePoints(anchorpoints)
      );
    }, false);
    rectangle = viewer.entities.add({
      name: "Rectangle",
      id: id,
      rectangle: {
        coordinates: dynamicRectangle,
        material: color,
        heightReference: onground
          ? Cesium.HeightReference.CLAMP_TO_GROUND
          : Cesium.HeightReference.NONE,
      },
    });
    rectangle.GeoType = "Rectangle"; //记录对象的类型，用户后续编辑等操作
    rectangle.Editable = true; //代表当前对象可编辑,false状态下不可编辑
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  // 鼠标移动事件
  handler.setInputAction((movement) => {
    let endPos = movement.endPosition;
    CreateRemindertip(window.toolTip, endPos, true);
    if (!Cesium.defined(rectangle)) return;
    const endCartesian = getCatesian3FromPX(viewer, endPos);
    if (!endCartesian) return;
    if (anchorpoints.length > 1) {
      anchorpoints.pop();
    }
    anchorpoints.push(endCartesian);
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  // 左键双击事件
  handler.setInputAction(() => {
    rectangle.PottingPoint = Cesium.clone(anchorpoints, true);
    rectangle.EditingPoint = Cesium.clone(anchorpoints, true);
    resultList.push(rectangle);
    handler.destroy();
    CreateRemindertip(window.toolTip, null, false);
    if (typeof callback == "function") callback(rectangle);
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
};

export default CreateRectangle;
