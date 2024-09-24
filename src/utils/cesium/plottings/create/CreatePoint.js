/*
 * 点标绘功能
 */
import CreateRemindertip from "../thirdPart/ReminderTip";
import { newSessionid } from "../thirdPart/plotCommon";
import { getCatesian3FromPX } from "../thirdPart/Coordinate";

const CreatePoint = (viewer, handler, resultList, options, callback) => {
  const id = options.id || newSessionid();
  const onground = options.onground || true;
  const color = options.color
    ? Cesium.Color.fromCssColorString(options.color)
    : Cesium.Color.GREEN;
  if (viewer.entities.getById(id))
    throw new Error("the id parameter is an unique value");
  window.toolTip = "左键点击选择点位";
  handler.setInputAction((event) => {
    let pixPos = event.position;
    let cartesian = getCatesian3FromPX(viewer, pixPos);
    if (!cartesian) return;
    const point = viewer.entities.add({
      id: id,
      name: "Point",
      position: cartesian,
      point: {
        show: true,
        color: color,
        pixelSize: 20,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 3,
        heightReference: onground
          ? Cesium.HeightReference.CLAMP_TO_GROUND
          : Cesium.HeightReference.NONE,
        disableDepthTestDistance: 1500, //解决遮挡显示一半的问题
      },
    });
    point.GeoType = "Point"; //记录对象的类型，用户后续编辑等操作
    point.PottingPoint = cartesian; //记录对象的节点数据，用户后续编辑等操作
    point.EditingPoint = cartesian; //记录对象的节点数据，用户后续编辑等操作
    point.Editable = true; //代表当前对象可编辑,false状态下不可编辑
    resultList.push(point);
    handler.destroy();
    CreateRemindertip(window.toolTip, event.position, false);
    if (callback && typeof callback == "function") callback(point);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction((movement) => {
    let endPos = movement.endPosition;
    CreateRemindertip(window.toolTip, endPos, true);
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
};
export default CreatePoint;
