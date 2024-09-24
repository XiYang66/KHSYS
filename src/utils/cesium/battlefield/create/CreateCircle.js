/*
 * 圆形标绘功能
 */
import DrawLabel from "../draw/label";
import DrawCircle from "../draw/circle";
import CreateRemindertip from "@/ktUtils/cesium/plottings/thirdPart/ReminderTip";
import { getCatesian3FromPX } from "@/ktUtils/cesium/plottings/thirdPart/Coordinate";

const CreateCircle = (
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
  let anchorpoints = []; //两个点，一个中心点，一个端点
  let circle = undefined;
  let label = undefined;
  let radius = new Cesium.CallbackProperty(function () {
    return getSemiAxis(anchorpoints);
  }, false);
  // 左键点击事件
  handler.setInputAction((event) => {
    window.toolTip = "左键双击键结束绘制";
    let pos = getCatesian3FromPX(viewer, event.position);
    if (!pos) return;
    if (anchorpoints.length === 0) {
      anchorpoints.push(pos);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  // 鼠标移动事件
  handler.setInputAction((movement) => {
    let endPos = movement.endPosition;
    CreateRemindertip(window.toolTip, endPos, true);
    if (anchorpoints.length === 0) return;
    const endCartesian = getCatesian3FromPX(viewer, endPos);
    if (Cesium.defined(circle)) {
      anchorpoints.pop();
      anchorpoints.push(endCartesian);
    } else {
      anchorpoints.push(endCartesian);
      circle = DrawCircle(viewer, {
        ...options,
        radius,
        position: anchorpoints[0],
      });
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  // 左键双击事件
  handler.setInputAction(() => {
    label = DrawLabel(viewer, {
      ...options,
      position: anchorpoints[0],
    });
    labelList.push(label);
    resultList.push(circle);
    handler.destroy();
    CreateRemindertip(window.toolTip, null, false);
    if (typeof callback == "function")
      callback({
        type: "circle",
        center: anchorpoints[0],
        radius: radius.getValue(),
      });
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
};
function getSemiAxis(points) {
  return points.length === 2
    ? Cesium.Cartesian3.distance(points[0], points[1])
    : 0;
}

export default CreateCircle;
