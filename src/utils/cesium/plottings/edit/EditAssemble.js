/*
 * 编辑集结地方法
 */
import { getCatesian3FromPX } from "../thirdPart/Coordinate";
import {
  lockingMap,
  newSessionid,
  calculateRectanglePoints,
  computeAssemblePoints,
} from "../thirdPart/plotCommon";
const EditAssemble = (viewer, entity, handler, collection) => {
  let editItem = collection.find((ele) => {
    return ele.id === entity.id;
  });
  let editEntity;
  let sourcePos = entity.EditingPoint;
  let updatePos = Cesium.clone(sourcePos, true);

  entity.show = false;
  let dynamicPositions = new Cesium.CallbackProperty(function () {
    let points = computeAssemblePoints(updatePos);
    return new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArrayHeights(points)
    );
  }, false);
  if (editItem) {
    editEntity = editItem.target;
    editEntity.show = true;
    editEntity.polygon.hierarchy = dynamicPositions;
    editItem.processEntities = initVertexEntities();
  } else {
    const newAssemble = Cesium.clone(entity.polygon);
    newAssemble.material = Cesium.Color.RED.withAlpha(0.4);
    newAssemble.hierarchy = dynamicPositions;
    editEntity = viewer.entities.add({
      GeoType: "EditAssemble",
      Editable: true,
      id: "edit_" + entity.id + new Date().getTime(),
      polygon: newAssemble,
    });
    const vertexs = initVertexEntities();
    collection.push({
      id: entity.id,
      source: entity,
      target: editEntity,
      geoType: "remix_assemble",
      processEntities: vertexs,
    });
  }
  let boolDown = false; //鼠标左键是否处于摁下状态
  let currentPickVertex = undefined; //当前选择的要编辑的节点
  let currentPickPolygon = undefined; //当前选择的要移动的集结地
  // 左键摁下事件
  handler.setInputAction((event) => {
    boolDown = true;
    let pick = viewer.scene.pick(event.position);
    if (Cesium.defined(pick) && pick.id) {
      const pickEntity = pick.id;
      if (!pickEntity.GeoType || !pickEntity.Editable) {
        return;
      }
      if (pickEntity.GeoType === "AssembleEditPoint") {
        lockingMap(viewer, false);
        currentPickVertex = pickEntity;
      } else if (pickEntity.GeoType === "EditAssemble") {
        lockingMap(viewer, false);
        currentPickPolygon = pickEntity;
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
  // 鼠标移动事件
  handler.setInputAction((event) => {
    if (boolDown && currentPickVertex) {
      let pos = getCatesian3FromPX(viewer, event.endPosition);
      if (pos) {
        updatePos[currentPickVertex.description] = pos;
      }
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
    entity.polygon.hierarchy = editEntity.polygon.hierarchy;
    boolDown = false;
    currentPickVertex = undefined;
    currentPickPolygon = undefined;
    lockingMap(viewer, true);
    entity.EditingPoint = updatePos;
  }, Cesium.ScreenSpaceEventType.LEFT_UP);

  function initVertexEntities() {
    let processEntities = [];
    for (let index = 0; index < updatePos.length; index++) {
      let verEntity = viewer.entities.add({
        id: "edit_" + newSessionid(),
        position: new Cesium.CallbackProperty(() => {
          return updatePos[index];
        }, false),
        point: {
          pixelSize: 20,
          color: Cesium.Color.YELLOW.withAlpha(0.6),
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          outlineColor: Cesium.Color.DARKRED.withAlpha(1),
        },
        show: true,
        description: index, //记录节点索引
      });
      verEntity.GeoType = "AssembleEditPoint";
      verEntity.Editable = true;
      processEntities.push(verEntity);
    }
    return processEntities;
  }
};
export default EditAssemble;
