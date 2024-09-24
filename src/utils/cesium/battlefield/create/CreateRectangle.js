/*
 * 矩形标绘功能
 */
import DrawLabel from "../draw/label";
import DrawRectangle from "../draw/rectangle";
import CreateRemindertip from "@/ktUtils/cesium/plottings/thirdPart/ReminderTip";
import { calculateRectanglePoints } from "@/ktUtils/cesium/plottings/thirdPart/plotCommon";
import { getCatesian3FromPX } from "@/ktUtils/cesium/plottings/thirdPart/Coordinate";

const CreateRectangle = (
  viewer,
  handler,
  resultList,
  labelList,
  options,
  callback
) => {
  if (!options.id) {
    throw new Error("the id parameter is an required value");
  }
  if (viewer.entities.getById(options.id)) {
    throw new Error("the id parameter is an unique value");
  }
  options.isDrawing = true;
  window.toolTip = "左键点击开始绘制";
  let anchorpoints = []; //记录矩形的左上和右下两个点
  let rectangle = undefined;
  let label = undefined;
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
    rectangle = DrawRectangle(viewer, {
      ...options,
      coordinates: dynamicRectangle,
    });
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
    let labelCartesian3 = new Cesium.Cartesian3();
    Cesium.Cartesian3.midpoint(
      anchorpoints[0],
      anchorpoints[1],
      labelCartesian3
    );
    label = DrawLabel(viewer, {
      ...options,
      position: labelCartesian3,
    });
    labelList.push(label);
    resultList.push(rectangle);
    handler.destroy();
    CreateRemindertip(window.toolTip, null, false);
    if (typeof callback == "function")
      callback({
        type: "rectangle",
        center: labelCartesian3,
        coordinates: anchorpoints,
      });
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
};

export default CreateRectangle;
