/*
 * 编辑直角箭头方法
 */
import {
  lockingMap,
  newSessionid,
  getRightAngleArrowPoints,
} from "../thirdPart/plotCommon";

const EditRightAngleArrow = (viewer, entity, handler, collectio) => {
  let editItem = collection.find((ele) => {
    return ele.id === entity.id;
  });
  let editEntity;
  let sourcePos = entity.EditingPoint;
  let updatePos = Cesium.clone(sourcePos, true);
  entity.show = false;
  let dynamicHierarchy = new Cesium.CallbackProperty(() => {
    let updatePositions = getRightAngleArrowPoints(updatePos);
    return new Cesium.PolygonHierarchy(updatePositions);
  }, false);
  if (editItem) {
    editEntity = editItem.target;
    editEntity.show = true;
    editEntity.polygon.hierarchy = dynamicHierarchy;
    editItem.processEntities = initVertexEntities();
  } else {
    const newPolygon = Cesium.clone(entity.polygon);
    newPolygon.material = Cesium.Color.RED.withAlpha(0.4);
    newPolygon.hierarchy = dynamicHierarchy;
    editEntity = viewer.entities.add({
      GeoType: "EditRightAngleArrow",
      Editable: true,
      id: "edit_" + entity.id + new Date().getTime(),
      polygon: newPolygon,
    });
    const vertexs = initVertexEntities();
    collection.push({
      id: entity.id,
      source: entity,
      target: editEntity,
      geoType: "remix_rightanglearrow",
      processEntities: vertexs,
    });
  }
  let boolDown = false; //鼠标左键是否处于摁下状态
  let currentPickVertex = undefined; //当前选择的要编辑的节点
  let currentPickPolygon = undefined; //当前选择的要移动的多边形
  // 左键摁下事件
  handler.setInputAction((event) => {
    boolDown = true;
    let pick = viewer.scene.pick(event.position);
    if (Cesium.defined(pick) && pick.id) {
      const pickEntity = pick.id;
      if (!pickEntity.GeoType || !pickEntity.Editable) {
        return;
      }
      if (pickEntity.GeoType === "RightAngleArrowEditPoints") {
        lockingMap(viewer, false);
        currentPickVertex = pickEntity;
      } else if (
        pickEntity.GeoType === "EditRightAngleArrow" ||
        pickEntity.GeoType === "RightAngleArrowEditCenterPoints"
      ) {
        lockingMap(viewer, false);
        currentPickPolygon = pickEntity;
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
  // 鼠标移动事件
  handler.setInputAction((event) => {
    if (boolDown && currentPickVertex) {
      let pos = viewer.scene.pickPosition(event.endPosition);
      updatePos[currentPickVertex.description.getValue()] = pos;
    }
    if (boolDown && currentPickPolygon) {
      let startPosition = viewer.scene.pickPosition(event.startPosition);
      let endPosition = viewer.scene.pickPosition(event.endPosition);
      let changed_x = endPosition.x - startPosition.x;
      let changed_y = endPosition.y - startPosition.y;
      let changed_z = endPosition.z - startPosition.z;
      updatePos.forEach((element) => {
        element.x = element.x + changed_x;
        element.y = element.y + changed_y;
        element.z = element.z + changed_z;
      });
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
    let vertexPointsEntity = []; //中途创建的Point对象
    let centerPointsEntity = []; //中途创建的中心点对象
    for (let index = 0; index < updatePos.length; index++) {
      let point = viewer.entities.add({
        id: "edit_" + newSessionid(),
        position: new Cesium.CallbackProperty(function () {
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
      point.GeoType = "RightAngleArrowEditPoints";
      point.Editable = true;
      vertexPointsEntity.push(point);
      if (index > 0) {
        let centerPoint = viewer.entities.add({
          id: "edit_" + newSessionid(),
          position: new Cesium.CallbackProperty(() => {
            let startPos = updatePos[index - 1];
            return Cesium.Cartesian3.midpoint(
              startPos,
              updatePos[index],
              new Cesium.Cartesian3()
            );
          }, false),
          point: {
            pixelSize: 15,
            color: Cesium.Color.GREEN.withAlpha(1),
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            outlineColor: Cesium.Color.YELLOW.withAlpha(0.6),
          },
          show: true,
          description: index, //记录节点索引
        });
        centerPoint.GeoType = "RightAngleArrowEditCenterPoints";
        centerPoint.Editable = true;
        centerPointsEntity.push(centerPoint);
      }
    }
    let processEntities = vertexPointsEntity.concat(centerPointsEntity);
    return processEntities;
  }
};
export default EditRightAngleArrow;
