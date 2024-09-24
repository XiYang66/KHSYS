/*
 * 创建燕尾箭头
 */

import CreateRemindertip from "../thirdPart/ReminderTip";
import { newSessionid, calculateSwallowPoints } from "../thirdPart/plotCommon";
import { getCatesian3FromPX } from "../thirdPart/Coordinate";

const CreateSwallowtailArrow = (
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
  const type = options.type || 1;
  let anchorpoints = [];
  let swallowtailArrow = undefined;
  window.toolTip = "左键点击开始绘制";
  //左键点击事件
  handler.setInputAction((event) => {
    window.toolTip = "左键双击结束绘制";
    let cartesian = getCatesian3FromPX(viewer, event.position);
    if (!cartesian || Cesium.defined(swallowtailArrow)) return;
    anchorpoints.push(cartesian);
    let dynamicPositions = new Cesium.CallbackProperty(function () {
      let points = calculateSwallowPoints(anchorpoints, type);
      return new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArrayHeights(points)
      );
    }, false);
    swallowtailArrow = viewer.entities.add({
      id: id,
      name: "SwallowtailArrow",
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
    swallowtailArrow.GeoType = "SwallowtailArrow"; //记录对象的类型，用户后续编辑等操作
    swallowtailArrow.Editable = true; //代表当前对象可编辑,false状态下不可编辑
    swallowtailArrow.GeoNum = type; //记录对象类型标签
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  //鼠标移动事件
  handler.setInputAction((move) => {
    let endPos = move.endPosition;
    CreateRemindertip(window.toolTip, endPos, true);
    let cartesian = getCatesian3FromPX(viewer, endPos);
    if (!cartesian || !Cesium.defined(swallowtailArrow)) return;
    if (anchorpoints.length === 2) {
      anchorpoints.pop();
    }
    anchorpoints.push(cartesian);
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  //左键双击事件
  handler.setInputAction((event) => {
    swallowtailArrow.PottingPoint = Cesium.clone(anchorpoints, true); //记录对象的节点数据，用户后续编辑等操作
    swallowtailArrow.EditingPoint = Cesium.clone(anchorpoints, true); //记录复杂对象的编辑的节点数据，用户后续编辑等操作
    let points = calculateSwallowPoints(anchorpoints, type);
    swallowtailArrow.polygon.hierarchy = new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArrayHeights(points)
    );
    resultList.push(swallowtailArrow);
    handler.destroy();
    CreateRemindertip(window.toolTip, event.position, false);
    if (typeof callback == "function") callback(swallowtailArrow);
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
};

export default CreateSwallowtailArrow;
