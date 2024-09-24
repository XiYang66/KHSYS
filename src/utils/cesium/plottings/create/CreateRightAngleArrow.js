/*
 * 创建直角箭头
 */

import CreateRemindertip from "../thirdPart/ReminderTip";
import {
  newSessionid,
  getRightAngleArrowPoints,
} from "../thirdPart/plotCommon";
import { getCatesian3FromPX } from "../thirdPart/Coordinate";

const CreateRightAngleArrow = (
  viewer,
  handler,
  resultList,
  options,
  callback
) => {
  const id = options.id || newSessionid();
  if (viewer.entities.getById(id))
    throw new Error("the id parameter is an unique value");
  let color = options.color
    ? Cesium.Color.fromCssColorString(options.color)
    : Cesium.Color.RED;
  const onground = options.onground || true;
  let anchorpoints = [];
  let rightAngleArrow = undefined;
  window.toolTip = "左键点击开始绘制";
  let timer = undefined;
  //左键点击事件
  handler.setInputAction((event) => {
    if (anchorpoints.length > 0) {
      return;
    }
    window.toolTip = "左键双击结束绘制";
    let cartesian = getCatesian3FromPX(viewer, event.position);
    if (!cartesian) return;
    anchorpoints.push(cartesian);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  //鼠标移动事件
  handler.setInputAction((move) => {
    let endPos = move.endPosition;
    CreateRemindertip(window.toolTip, endPos, true);
    if (anchorpoints.length === 0) {
      return;
    }
    let cartesian = getCatesian3FromPX(viewer, endPos);
    if (!cartesian) return;
    anchorpoints.push(cartesian);
    if (anchorpoints.length > 2) {
      anchorpoints.splice(1, 1);
    }
    if (!Cesium.defined(rightAngleArrow)) {
      let dynamicPositions = new Cesium.CallbackProperty(function () {
        let pointlist = getRightAngleArrowPoints(anchorpoints);
        return new Cesium.PolygonHierarchy(pointlist);
      }, false);
      rightAngleArrow = viewer.entities.add({
        id: id,
        name: "RightAngleArrow",
        polygon: new Cesium.PolygonGraphics({
          hierarchy: dynamicPositions,
          show: true,
          fill: true,
          material: color,
          heightReference: onground
            ? Cesium.HeightReference.CLAMP_TO_GROUND
            : Cesium.HeightReference.NONE,
        }),
      });
      rightAngleArrow.GeoType = "RightAngleArrow"; //记录对象的类型，用户后续编辑等操作
      rightAngleArrow.Editable = true; //代表当前对象可编辑,false状态下不可编辑
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  //左键双击事件
  handler.setInputAction((event) => {
    rightAngleArrow.PottingPoint = Cesium.clone(anchorpoints, true); //记录对象的节点数据，用户后续编辑等操作
    rightAngleArrow.EditingPoint = Cesium.clone(anchorpoints, true); //记录复杂对象的编辑的节点数据，用户后续编辑等操作
    let pointlist = getRightAngleArrowPoints(anchorpoints);
    rightAngleArrow.polygon.hierarchy = new Cesium.PolygonHierarchy(pointlist);
    resultList.push(rightAngleArrow);
    handler.destroy();
    CreateRemindertip(window.toolTip, event.position, false);
    if (typeof callback == "function") callback(rightAngleArrow);
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
};

export default CreateRightAngleArrow;
