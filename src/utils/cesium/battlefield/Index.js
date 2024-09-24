import DrawLabel from "./draw/label";
import DrawRectangle from "./draw/rectangle";
import DrawCircle from "./draw/circle";
import DrawPolygon from "./draw/polygon";
import CreateRectangle from "./create/CreateRectangle";
import CreateCricle from "./create/CreateCircle";
import CreatePolygon from "./create/CreatePolygon";
import CreateRemindertip from "@/ktUtils/cesium/plottings/thirdPart/ReminderTip";

class Battlefield {
  viewer; //三维场景
  resultObject; //标绘结果
  handler;
  constructor(viewer) {
    if (!viewer) throw new Error("no viewer object!");
    this.viewer = viewer;
    this.resultObject = {
      circle: [], // 圆形Entity集合
      label: [], //标签Entity集合
      rectangle: [], //矩形Entity集合
      polygon: [], //多边形Entity集合
    };
    this.handler = undefined;
    // 关闭Cesium默认双击实体会调用trackedEntity方法
    viewer.trackedEntity = undefined;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
  }
  /**
   * 绘制矩形
   * @param options - 参数，不传参为{}
   * @param callback  回调函数
   */
  initRectangleHandler(options, callback) {
    this.initHandler();
    CreateRectangle(
      this.viewer,
      this.handler,
      this.resultObject.rectangle,
      this.resultObject.label,
      options,
      callback
    );
  }
  /**
   * 绘制圆形
   * @param options - 参数，不传参为{}
   * @param callback  回调函数
   */
  initCircleHandler(options, callback) {
    this.initHandler();
    CreateCricle(
      this.viewer,
      this.handler,
      this.resultObject.circle,
      this.resultObject.label,
      options,
      callback
    );
  }
  /**
   * 绘制多边形
   * @param options - 参数，不传参为{}
   * @param callback  回调函数
   */
  initPolygonHandler(options, callback) {
    this.initHandler();
    CreatePolygon(
      this.viewer,
      this.handler,
      this.resultObject.polygon,
      this.resultObject.label,
      options,
      callback
    );
  }
  /**
   * 标签反显
   */
  drawLabel(options) {
    let label = DrawLabel(this.viewer, options);
    this.resultObject.label.push(label);
  }
  /**
   * 矩形反显
   */
  drawRectangle(options) {
    let rectangle = DrawRectangle(this.viewer, options);
    this.resultObject.rectangle.push(rectangle);
  }
  /**
   * 圆形反显
   */
  drawCircle(options) {
    let circle = DrawCircle(this.viewer, options);
    this.resultObject.circle.push(circle);
  }
  /**
   * 多边形反显
   */
  drawPolygon(options) {
    let polygon = DrawPolygon(this.viewer, options);
    this.resultObject.polygon.push(polygon);
  }
  /**
   * 初始化handler句柄
   */
  initHandler() {
    if (this.handler && !this.handler.isDestroyed()) {
      CreateRemindertip(window.toolTip, null, false);
      this.handler.destroy();
    }
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
  }
  /**
   * 飞行定位
   */
  fly2Entity(center) {
    this.viewer.camera.flyToBoundingSphere(
      new Cesium.BoundingSphere(
        new Cesium.Cartesian3(center.x, center.y, center.z),
        950000
      )
    );
  }
  /**
   * 清除所有创建的对象
   */
  clearAll() {
    for (const key in this.resultObject) {
      if (Object.hasOwnProperty.call(this.resultObject, key)) {
        const element = this.resultObject[key];
        for (let index = 0; index < element.length; index++) {
          const el = element[index];
          this.viewer.entities.remove(el);
          element.splice(index, 1);
          index -= 1;
        }
      }
    }
  }
  /**
   * 注销
   */
  destroy() {
    this.initHandler();
    this.handler.destroy();
    this.clearAll();
  }
  /**
   * 点击事件监听
   * @param {*} callback
   */
  createLeftClickHandler(callback) {
    let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    handler.setInputAction((movement) => {
      let picked = this.viewer.scene.pick(movement.position);
      if (picked && Cesium.defined(picked.id)) {
        let pickedId = picked.id._id;
        if (pickedId && pickedId.includes("battlefield_")) {
          if (!picked.id.isDrawing) {
            if (callback) {
              callback(picked.id.battlefield);
            }
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
}
export default Battlefield;
