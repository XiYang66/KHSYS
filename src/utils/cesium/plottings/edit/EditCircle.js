/*
 * 编辑圆方法
 */
import { getCatesian3FromPX } from "../thirdPart/Coordinate";
import {
  lockingMap,
  newSessionid,
  getSemiAxis,
  getEllipticAngle,
} from "../thirdPart/plotCommon";

const EditCircle = (viewer, entity, handler, collection) => {
  let editItem = collection.find((ele) => {
    return ele.id === entity.id;
  });
  let editEntity;
  let sourcePos = entity.EditingPoint;
  let updatePos = Cesium.clone(sourcePos, true);

  entity.show = false;
  let dynamicPos = new Cesium.CallbackProperty(() => {
    return updatePos[0];
  }, false);
  let radius = new Cesium.CallbackProperty(function () {
    return getSemiAxis(updatePos);
  }, false);
  if (editItem) {
    editEntity = editItem.target;
    editEntity.show = true;
    editEntity.position = dynamicPos;
    editEntity.ellipse.semiMinorAxis = editEntity.ellipse.semiMajorAxis =
      radius;
    editItem.processEntities = initVertexEntities();
  } else {
    const newCircle = Cesium.clone(entity.ellipse);
    newCircle.material = Cesium.Color.RED.withAlpha(0.4);
    newCircle.semiMinorAxis = newCircle.semiMajorAxis = radius;
    editEntity = viewer.entities.add({
      position: dynamicPos,
      GeoType: "EditCircle",
      Editable: true,
      id: "edit_" + entity.id + new Date().getTime(),
      ellipse: newCircle,
    });
    const vertexs = initVertexEntities();
    collection.push({
      id: entity.id,
      source: entity,
      target: editEntity,
      geoType: "remix_circle",
      processEntities: vertexs,
    });
  }
  let boolDown = false; //鼠标左键是否处于摁下状态
  let currentPickVertex = undefined; //当前选择的要编辑的节点
  let currentPickPolygon = undefined; //当前选择的要移动的圆
  // 左键摁下事件
  handler.setInputAction((event) => {
    boolDown = true;
    let pick = viewer.scene.pick(event.position);
    if (Cesium.defined(pick) && pick.id) {
      const pickEntity = pick.id;
      if (!pickEntity.GeoType || !pickEntity.Editable) {
        return;
      }
      if (pickEntity.GeoType === "CircleEditEnd") {
        lockingMap(viewer, false);
        currentPickVertex = pickEntity;
      } else if (
        pickEntity.GeoType === "EditCircle" ||
        pickEntity.GeoType === "CircleEditCenter"
      ) {
        lockingMap(viewer, false);
        currentPickPolygon = pickEntity;
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
  // 鼠标移动事件
  handler.setInputAction((event) => {
    if (boolDown && currentPickVertex) {
      let pos = getCatesian3FromPX(viewer, event.endPosition);
      updatePos[1] = pos;
    }
    if (boolDown && currentPickPolygon) {
      let startPosition = viewer.scene.pickPosition(event.startPosition);
      let endPosition = viewer.scene.pickPosition(event.endPosition);
      let changed_x = endPosition.x - startPosition.x;
      let changed_y = endPosition.y - startPosition.y;
      let changed_z = endPosition.z - startPosition.z;
      updatePos[0] = new Cesium.Cartesian3(
        updatePos[0].x + changed_x,
        updatePos[0].y + changed_y,
        updatePos[0].z + changed_z
      );
      updatePos[1] = new Cesium.Cartesian3(
        updatePos[1].x + changed_x,
        updatePos[1].y + changed_y,
        updatePos[1].z + changed_z
      );
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  // 左键抬起事件
  handler.setInputAction(() => {
    entity.position = editEntity.position;
    entity.ellipse.semiMinorAxis = editEntity.ellipse.semiMinorAxis;
    entity.ellipse.semiMajorAxis = editEntity.ellipse.semiMajorAxis;
    boolDown = false;
    currentPickVertex = undefined;
    currentPickPolygon = undefined;
    lockingMap(viewer, true);
    entity.EditingPoint = updatePos;
  }, Cesium.ScreenSpaceEventType.LEFT_UP);

  function initVertexEntities() {
    let centerEntity = viewer.entities.add({
      id: "edit_" + newSessionid(),
      position: new Cesium.CallbackProperty(() => {
        return updatePos[0];
      }, false),
      point: {
        pixelSize: 20,
        color: Cesium.Color.YELLOW.withAlpha(0.6),
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        outlineColor: Cesium.Color.DARKRED.withAlpha(1),
      },
      show: true,
    });
    centerEntity.GeoType = "CircleEditCenter";
    centerEntity.Editable = true;
    let endEntity = viewer.entities.add({
      id: "edit_" + newSessionid(),
      position: new Cesium.CallbackProperty(() => {
        return updatePos[1];
      }, false),
      point: {
        pixelSize: 20,
        color: Cesium.Color.GREEN.withAlpha(1),
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        outlineColor: Cesium.Color.YELLOW.withAlpha(0.6),
      },
      show: true,
    });

    endEntity.GeoType = "CircleEditEnd";
    endEntity.Editable = true;
    let processEntities = [centerEntity, endEntity];
    return processEntities;
  }
};
export default EditCircle;
