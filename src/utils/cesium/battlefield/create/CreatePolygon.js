/*
 * 多边形标绘功能
 */
import DrawLabel from "../draw/label";
import DrawPolygon from "../draw/polygon";
import CreateRemindertip from "@/ktUtils/cesium/plottings/thirdPart/ReminderTip";
import { getCatesian3FromPX } from "@/ktUtils/cesium/plottings/thirdPart/Coordinate";

const CreatePolygon = (
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
  let anchorpoints = [];
  let polygon = undefined;
  let label = undefined;
  // 左键点击事件
  handler.setInputAction((event) => {
    let pixPos = event.position;
    let cartesian = getCatesian3FromPX(viewer, pixPos);
    if (anchorpoints.length == 0) {
      window.toolTip = "左键添加第二个顶点";
      anchorpoints.push(cartesian);
      let dynamicPositions = new Cesium.CallbackProperty(function () {
        return new Cesium.PolygonHierarchy(anchorpoints);
      }, false);
      polygon = DrawPolygon(viewer, {
        ...options,
        hierarchy: dynamicPositions,
      });
    } else {
      window.toolTip = "左键添加点，右键撤销，左键双击完成绘制";
    }
    anchorpoints.push(cartesian);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  // 鼠标移动事件
  handler.setInputAction((movement) => {
    let endPos = movement.endPosition;
    CreateRemindertip(window.toolTip, endPos, true);
    if (Cesium.defined(polygon)) {
      anchorpoints.pop();
      let cartesian = getCatesian3FromPX(viewer, endPos);
      if (!cartesian) {
        return;
      }
      anchorpoints.push(cartesian);
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  // 左键双击事件
  handler.setInputAction((event) => {
    anchorpoints.pop();
    anchorpoints.pop(); //因为是双击结束，所以要pop两次，一次是move的结果，一次是单击结果

    // 获取多边形坐标点
    let positions = polygon.polygon.hierarchy.getValue(
      Cesium.JulianDate.now()
    ).positions;
    // 得到多边形的外包围球
    let boundingSphere = Cesium.BoundingSphere.fromPoints(positions);
    // 得到多边形中心点位置
    let center = boundingSphere.center;
    // 求多边形中心贴地表的位置，（非必须，贴上来只当作记笔记了）
    // let surfacePosition = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(center);
    label = DrawLabel(viewer, {
      ...options,
      position: center,
    });
    labelList.push(label);
    resultList.push(polygon);
    handler.destroy();
    CreateRemindertip(window.toolTip, event.position, false);
    if (typeof callback == "function")
      callback({
        type: "polygon",
        center,
        hierarchy: anchorpoints,
      });
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  // 右键摁下事件
  handler.setInputAction(() => {
    anchorpoints.pop();
  }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
};
export default CreatePolygon;
