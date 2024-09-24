/*
 * 态势标绘编辑主类
 */
import { showToolTip, removeToolTip } from "../thirdPart/Tooltip";
import { createBezierPoints, getRegularPoints } from "../thirdPart/plotCommon";
import EditAssemble from "./EditAssemble";
import EditAttackArrow from "./EditAttackArrow";
import EditBillboard from "./EditBillboard";
import EditBow from "./EditBow";
import EditCircle from "./EditCircle";
import EditCurve from "./EditCurve";
import EditElliptic from "./EditElliptic";
import EditFlag from "./EditFlag";
import EditFormation from "./EditFormation";
// import EditFreeLine from './EditFreeLine';
// import EditFreePolygon from "./EditFreePolygon";
import EditLabel from "./EditLabel";
import EditLineArrow from "./EditLineArrow";
import EditPincerArrow from "./EditPincerArrow";
import EditPoint from "./EditPoint";
import EditPolygon from "./EditPolygon";
import EditPolyline from "./EditPolyline";
import EditRectangle from "./EditRectangle";
import EditRegularPolygon from "./EditRegularPolygon";
import EditRightAngleArrow from "./EditRightAngleArrow";
import EditRoundRectangle from "./EditRoundRectangle";
import EditSector from "./EditSector";
import EditStraightArrow from "./EditStraightArrow";
import EditSwallowtailArrow from "./EditSwallowtailArrow";
import EditGltf from "./EditGltf";

class ObjectEdit {
  _viewer;
  _moveHandler;
  _editHandler;
  _toolTip;
  _enable;
  _editCollection;
  _preEntity;
  _gltfEditObj;
  constructor(viewer) {
    if (!viewer) throw new Error("no viewer object!");
    this._viewer = viewer;
    this._toolTip = "";
    this._enable = false;
    this._editCollection = [];
    this._preEntity = undefined;
    this._gltfEditObj = null;
  }
  /**
   * 获取编辑状态
   */
  get enable() {
    return this._enable;
  }
  /**
   * 修改编辑状态
   */
  set enable(v) {
    v ? this.initStatus() : this.destroy();
    this._enable = v;
  }
  /**
   * 初始化编辑状态
   */
  initStatus() {
    const $this = this;
    const viewer = this._viewer;
    this._moveHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    this._moveHandler.setInputAction(function (movement) {
      const endPos = movement.endPosition;
      let pick = viewer.scene.pick(endPos);
      if (Cesium.defined(pick) && pick.id) {
        const pickEntity = pick.id;
        // GeoType和Editable字段结合态势标绘理解
        if (pickEntity.GeoType && pickEntity.Editable) {
          viewer.container.style.cursor = "pointer";
          showToolTip(pickEntity.GeoType, $this._toolTip, endPos, true);
        } else {
          viewer.container.style.cursor = "default";
          removeToolTip($this._toolTip);
        }
      } else {
        viewer.container.style.cursor = "default";
        removeToolTip($this._toolTip);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this._moveHandler.setInputAction(function (event) {
      const pos = event.position;
      let pick = viewer.scene.pick(pos);
      if (Cesium.defined(pick) && pick.id) {
        const pickEntity = pick.id;
        if (
          pickEntity.GeoType &&
          pickEntity.Editable &&
          pickEntity.id.indexOf("edit_") < 0
        ) {
          $this.resetPick();
          $this.storageEntity(pickEntity);
        }
      } else {
        $this.destroyEditHandler();
        $this.resetPick();
        if (this._gltfEditObj) {
          this._gltfEditObj.destroy();
        }
        $this._preEntity = undefined;
        $this._editCollection = [];
        removeToolTip($this._toolTip);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  /**
   * 重置点选状态
   */
  resetPick() {
    const item = this._editCollection.find((ele) => {
      return ele.id === this._preEntity?.id;
    });
    if (item) {
      item.source.show = true;
      item.target.show = false;
      this.removeProcessObj(item.processEntities);
    }
  }
  /**
   * 存储编辑对象，并开始编辑
   * @param entity
   */
  storageEntity(entity) {
    this.destroyEditHandler();
    this._preEntity = entity;
    this._editHandler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas);
    switch (entity.GeoType) {
      case "Point":
        this.startEditPoint(entity);
        break;
      case "Billboard":
        this.startEditBillboard(entity);
        break;
      case "Polyline":
        this.startEditPolyline(entity);
        break;
      case "Curve":
        this.startEditCurve(entity);
        break;
      case "Polygon":
        this.startEditPolygon(entity);
        break;
      case "RegularPolygon":
        this.startEditRegularPolygon(entity);
        break;
      case "LineArrow":
        this.startEditLineArrow(entity);
        break;
      case "SwallowtailArrow":
        this.startEditSwallowtailArrow(entity);
        break;
      case "StraightArrow":
        this.startEditStraightArrow(entity);
        break;
      case "RightAngleArrow":
        this.startEditRightAngleArrow(entity);
        break;
      case "Rectangle":
        this.startEditRectangle(entity);
        break;
      case "RoundRectangle":
        this.startEditRoundRectangle(entity);
        break;
      case "Sector":
        this.startEditSector(entity);
        break;
      case "Elliptic":
        this.startEditElliptic(entity);
        break;
      case "Circle":
        this.startEditCircle(entity);
        break;
      case "Bow":
        this.startEditBow(entity);
        break;
      case "PincerArrow":
        this.startEditPincerArrow(entity);
        break;
      case "AttackArrow":
        this.startEditAttackArrow(entity);
        break;
      case "AssemblePolygon":
        this.startEditAssemble(entity);
        break;
      case "CurveFlag":
        this.startEditFlag(entity);
        break;
      case "TriangleFlag":
        this.startEditFlag(entity);
        break;
      case "RegularTriangleFlag":
        this.startEditFlag(entity);
        break;
      case "InvertedTriangleFlag":
        this.startEditFlag(entity);
        break;
      case "RectangleFlag":
        this.startEditFlag(entity);
        break;
      case "FreeLine":
        this.startEditFreeLine(entity);
        break;
      case "FreePolygon":
        this.startEditFreePolygon(entity);
        break;
      case "Formation":
        this.startEditFormation(entity);
        break;
      case "Label":
        this.startEditLabel(entity);
        break;
      case "Gltf":
        this.startEditGltf(entity);
        break;
      default:
        break;
    }
  }
  /**
   * 开始编辑点
   * @param entity
   */
  startEditPoint(entity) {
    EditPoint(this._viewer, entity, this._editHandler, this._editCollection);
  }
  /**
   * 开始编辑折线
   * @param entity
   */
  startEditPolyline(entity) {
    EditPolyline(this._viewer, entity, this._editHandler, this._editCollection);
  }
  /**
   * 开始编辑多边形
   * @param entity
   */
  startEditPolygon(entity) {
    EditPolygon(this._viewer, entity, this._editHandler, this._editCollection);
  }
  /**
   * 开始编辑广告牌
   * @param entity
   */
  startEditBillboard(entity) {
    EditBillboard(
      this._viewer,
      entity,
      this._editHandler,
      this._editCollection
    );
  }
  /**
   * 开始编辑广告牌
   * @param entity
   */
  startEditCurve(entity) {
    EditCurve(this._viewer, entity, this._editHandler, this._editCollection);
  }
  /**
   * 开始编辑正多边形
   * @param entity
   */
  startEditRegularPolygon(entity) {
    EditRegularPolygon(
      this._viewer,
      entity,
      this._editHandler,
      this._editCollection
    );
  }
  /**
   * 开始编辑简单箭头Entity集合
   * @param entity
   */
  startEditLineArrow(entity) {
    EditLineArrow(
      this._viewer,
      entity,
      this._editHandler,
      this._editCollection
    );
  }
  /**
   * 开始编辑燕尾箭头Entity集合
   * @param entity
   */
  startEditSwallowtailArrow(entity) {
    EditSwallowtailArrow(
      this._viewer,
      entity,
      this._editHandler,
      this._editCollection
    );
  }
  /**
   * 开始编辑直线箭头Entity集合
   * @param entity
   */
  startEditStraightArrow(entity) {
    EditStraightArrow(
      this._viewer,
      entity,
      this._editHandler,
      this._editCollection
    );
  }
  /**
   * 开始编辑直角箭头Entity集合
   * @param entity
   */
  startEditRightAngleArrow(entity) {
    EditRightAngleArrow(
      this._viewer,
      entity,
      this._editHandler,
      this._editCollection
    );
  }
  /**
   * 开始编辑矩形Entity集合
   * @param entity
   */
  startEditRectangle(entity) {
    EditRectangle(
      this._viewer,
      entity,
      this._editHandler,
      this._editCollection
    );
  }
  /**
   * 开始编辑圆角矩形Entity集合
   * @param entity
   */
  startEditRoundRectangle(entity) {
    EditRoundRectangle(
      this._viewer,
      entity,
      this._editHandler,
      this._editCollection
    );
  }
  /**
   * 开始编辑扇形Entity集合
   * @param entity
   */
  startEditSector(entity) {
    EditSector(this._viewer, entity, this._editHandler, this._editCollection);
  }
  /**
   * 开始编辑椭圆Entity集合
   * @param entity
   */
  startEditElliptic(entity) {
    EditElliptic(this._viewer, entity, this._editHandler, this._editCollection);
  }
  /**
   * 开始编辑圆Entity集合
   * @param entity
   */
  startEditCircle(entity) {
    EditCircle(this._viewer, entity, this._editHandler, this._editCollection);
  }
  /**
   * 开始编辑弓形Entity集合
   * @param entity
   */
  startEditBow(entity) {
    EditBow(this._viewer, entity, this._editHandler, this._editCollection);
  }
  /**
   * 开始编辑钳击箭头Entity集合
   * @param entity
   */
  startEditPincerArrow(entity) {
    EditPincerArrow(
      this._viewer,
      entity,
      this._editHandler,
      this._editCollection
    );
  }
  /**
   * 开始编辑进攻箭头Entity集合
   * @param entity
   */
  startEditAttackArrow(entity) {
    EditAttackArrow(
      this._viewer,
      entity,
      this._editHandler,
      this._editCollection
    );
  }
  /**
   * 开始编辑集结地Entity集合
   * @param entity
   */
  startEditAssemble(entity) {
    EditAssemble(this._viewer, entity, this._editHandler, this._editCollection);
  }
  /**
   * 开始编辑旗标Entity集合
   * @param entity
   */
  startEditFlag(entity) {
    EditFlag(this._viewer, entity, this._editHandler, this._editCollection);
  }
  /**
   * 开始编辑自由线Entity集合
   * @param entity
   */
  startEditFreeLine(entity) {
    EditFreeLine(this._viewer, entity, this._editHandler, this._editCollection);
  }
  /**
   * 开始编辑
   * @param entity自由面Entity集合
   */
  startEditFreePolygon(entity) {
    EditFreePolygon(
      this._viewer,
      entity,
      this._editHandler,
      this._editCollection
    );
  }
  /**
   * 开始编辑阵型Entity集合（防御和进攻阵型）
   * @param entity
   */
  startEditFormation(entity) {
    EditFormation(
      this._viewer,
      entity,
      this._editHandler,
      this._editCollection
    );
  }
  /**
   * 开始编辑文本Entity集合
   * @param entity
   */
  startEditLabel(entity) {
    EditLabel(this._viewer, entity, this._editHandler, this._editCollection);
  }
  /**
   * 开始编辑模型Entity集合
   * @param entity
   */
  startEditGltf(entity) {
    EditGltf(
      this._viewer,
      async (data) => {
        this._gltfEditObj = data;
      },
      entity,
      this._editHandler,
      this._editCollection
    );
  }

  /**
   * 保存编辑
   */
  saveAll() {
    this._editCollection.forEach((se) => {
      se.source.show = true;
      let resultPos;
      switch (se.geoType.toUpperCase()) {
        case "POINT":
          resultPos = se.source.position.getValue();
          break;
        case "POLYLINE":
          resultPos = se.source.polyline.positions.getValue();
          break;
        case "POLYGON":
          resultPos = se.source.polygon.hierarchy.getValue();
          break;
        default: //remix类型
          resultPos = se.source.EditingPoint;
          break;
      }
      se.source.PottingPoint = Cesium.clone(resultPos, true);
      this._viewer.entities.remove(se.target);
      this.removeProcessObj(se.processEntities);
    });
    this.destroy();
  }
  /**
   * 取消编辑
   */
  cancle() {
    this._editCollection.forEach((se) => {
      se.source.show = true;
      const type = se.geoType.toUpperCase();
      if (type.indexOf("REMIX") < 0) {
        switch (type) {
          case "POINT":
            se.source.position = Cesium.clone(se.source.PottingPoint, true);
            break;
          case "POLYLINE":
            se.source.polyline.positions = Cesium.clone(
              se.source.PottingPoint,
              true
            );
            break;
          case "POLYGON":
            se.source.polygon.hierarchy = Cesium.clone(
              se.source.PottingPoint,
              true
            );
            break;
          default:
            break;
        }
      } else {
        const pos = Cesium.clone(se.source.PottingPoint, true);
        se.source.EditingPoint = pos;
        switch (type) {
          case "REMIX_CURVE":
            se.source.polyline.positions = createBezierPoints(pos);
            break;
          case "REMIX_REGULARPOLYGON":
            se.source.polygon.hierarchy = new Cesium.PolygonHierarchy(
              getRegularPoints(pos.center, pos.end, pos.num)
            );
            break;
          default:
            break;
        }
      }

      this._viewer.entities.remove(se.target);
      this.removeProcessObj(se.processEntities);
    });
    this.destroy();
  }
  /**
   * 移除过程对象
   * @param items
   */
  removeProcessObj(items) {
    items?.forEach((ele) => {
      this._viewer.entities.remove(ele);
    });
    items = [];
  }
  destroyEditHandler() {
    if (this._editHandler) {
      this._editHandler.destroy();
    }
  }
  /**
   * 注销
   */
  destroy() {
    this._moveHandler.destroy();
    this.destroyEditHandler();
    this.resetPick();
    if (this._gltfEditObj) {
      this._gltfEditObj.destroy();
    }
    this._preEntity = undefined;
    this._editCollection = [];
    removeToolTip(this._toolTip);
  }
}
export default ObjectEdit;
