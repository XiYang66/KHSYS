/*
 * 创建攻击箭头
 */

import CreateRemindertip from "../thirdPart/ReminderTip";
import { newSessionid, getAttackArrowPoints } from "../thirdPart/plotCommon";
import { getCatesian3FromPX } from "../thirdPart/Coordinate";

const CreateAttackArrow = (viewer, handler, resultList, options, callback) => {
  const id = options.id || newSessionid();
  if (viewer.entities.getById(id))
    throw new Error("the id parameter is an unique value");
  let color = options.color
    ? Cesium.Color.fromCssColorString(options.color)
    : Cesium.Color.RED;
  const onground = options.onground || true;
  let anchorpoints = [];
  let attackArrow = undefined;
  window.toolTip = "左键点击开始绘制";
  //左键点击事件
  handler.setInputAction((event) => {
    window.toolTip = "左键添加点，右键撤销，左键双击结束绘制";
    let cartesian = getCatesian3FromPX(viewer, event.position);
    if (!cartesian) return;
    anchorpoints.push(cartesian);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  //鼠标移动事件
  handler.setInputAction((move) => {
    let endPos = move.endPosition;
    CreateRemindertip(window.toolTip, endPos, true);
    let cartesian = getCatesian3FromPX(viewer, endPos);
    if (!cartesian) return;
    if (anchorpoints.length >= 2) {
      let dynamicPositions = new Cesium.CallbackProperty(function () {
        let pointlist = getAttackArrowPoints(anchorpoints);
        return new Cesium.PolygonHierarchy(pointlist);
      }, false);
      if (!Cesium.defined(attackArrow)) {
        anchorpoints.push(cartesian);
        attackArrow = viewer.entities.add({
          id: id,
          name: "AttackArrow",
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
        attackArrow.GeoType = "AttackArrow"; //记录对象的类型，用户后续编辑等操作
        attackArrow.Editable = true; //代表当前对象可编辑,false状态下不可编辑
      } else {
        anchorpoints.pop();
        anchorpoints.push(cartesian);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  //左键双击事件
  handler.setInputAction((event) => {
    anchorpoints.pop();
    anchorpoints.pop(); //因为是双击结束，所以要pop两次，一次是move的结果，一次是单击结果
    attackArrow.PottingPoint = Cesium.clone(anchorpoints, true); //记录对象的节点数据，用户后续编辑等操作
    attackArrow.EditingPoint = Cesium.clone(anchorpoints, true); //记录复杂对象的编辑的节点数据，用户后续编辑等操作
    let pointlist = getAttackArrowPoints(anchorpoints);
    attackArrow.polygon.hierarchy = new Cesium.PolygonHierarchy(pointlist);
    resultList.push(attackArrow);
    handler.destroy();
    CreateRemindertip(window.toolTip, event.position, false);
    if (typeof callback == "function") callback(attackArrow);
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  // 右键摁下事件
  handler.setInputAction(() => {
    anchorpoints.pop();
  }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
};

export default CreateAttackArrow;
