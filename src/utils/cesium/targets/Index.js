import CreateRemindertip from "@/ktUtils/cesium/plottings/thirdPart/ReminderTip";

const MODULE = "EXPERIMENTAL_SCENARIO";

class Targets {
  _viewer;
  _targets = [];
  _labelCollection;
  _billboardCollection;
  _gltfCollection = [];
  _pointDraged = null;
  _leftDownFlag = false;
  constructor(viewer) {
    this._viewer = viewer;
    this._labelCollection = this._viewer.scene.primitives.add(
      new Cesium.LabelCollection()
    );
    this._billboardCollection = this._viewer.scene.primitives.add(
      new Cesium.BillboardCollection()
    );
    this._gltfCollection = [];
  }
  setTargets(targets) {
    this._targets = targets;
  }
  renderTargets(showGltf) {
    this.clearLabels();
    this.clearBillboards();
    this.clearGltfModels();
    this._targets.forEach((target) => {
      this.createLabel(target);
      this.createBillboards(target);
      this.createGltfModel(target);
    });
    this.toggleBillboards(!showGltf);
    this.toggleGltfModels(showGltf);
  }
  createLabel({ longitude, latitude, altitude, id, name, color }) {
    const label = this._labelCollection.add({
      id: `label_${id}`,
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
      text: name,
      font: "12px serif",
      fillColor: Cesium.Color[color],
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      pixelOffset: new Cesium.Cartesian2(14, 0),
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
    });
    label.MODULE = MODULE;
  }
  clearLabels() {
    this._labelCollection.removeAll();
  }
  createBillboards({ longitude, latitude, altitude, id, iconUrl, color }) {
    const billboard = this._billboardCollection.add({
      id: `billboard_${id}`,
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
      image: iconUrl,
      color: Cesium.Color[color],
      width: 20,
      height: 20,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      scale: 1.0,
      rotation: 0.0,
      scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
    });
    billboard.MODULE = MODULE;
  }
  clearBillboards() {
    this._billboardCollection.removeAll();
  }
  toggleBillboards(show) {
    this._billboardCollection.show = show;
  }
  createGltfModel({ longitude, latitude, altitude, id, modelUrl, hpr }) {
    const position = Cesium.Cartesian3.fromDegrees(
      longitude,
      latitude,
      altitude
    );
    const heading = Cesium.Math.toRadians(hpr.heading);
    const pitch = Cesium.Math.toRadians(hpr.pitch);
    const roll = hpr.roll;
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      new Cesium.HeadingPitchRoll(heading, pitch, roll)
    );
    let gltfModel = this._viewer.entities.add({
      id: `gltf_${id}`,
      position,
      orientation,
      model: {
        uri: modelUrl,
        minimumPixelSize: 64,
        maximumScale: 20000,
      },
    });
    gltfModel.MODULE = MODULE;
    this._gltfCollection.push(gltfModel);
  }
  clearGltfModels() {
    this._gltfCollection.forEach((gltfModel) => {
      this._viewer.entities.remove(gltfModel);
    });
  }
  toggleGltfModels(show) {
    this._gltfCollection.forEach((gltfModel) => {
      gltfModel.show = show;
    });
  }
  fly2Target(target) {
    let index = this._targets.findIndex((_target) => _target.id === target.id);
    if (index > -1) {
      this._viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(
          Cesium.Cartesian3.fromDegrees(
            target.longitude,
            target.latitude,
            target.altitude
          ),
          50000
        )
      );
    }
  }
  getLabelById(targetId) {
    let index = this._targets.findIndex((_target) => _target.id === targetId);
    let label = this._labelCollection.get(index);
    return label;
  }
  getBillboardById(targetId) {
    let index = this._targets.findIndex((_target) => _target.id === targetId);
    let billboard = this._billboardCollection.get(index);
    return billboard;
  }
  getGltfModelById(targetId) {
    let model = this._viewer.entities.getById(`gltf_${targetId}`);
    return model;
  }
  createLeftClickHandler(callback) {
    window.toolTip = "";
    let handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
    handler.setInputAction((down) => {
      const pick = this._viewer.scene.pick(down.position);
      let targetId;
      let label;
      let billboard;
      let gltfModel;
      let colorBackup;
      if (!Cesium.defined(pick)) {
        return;
      }
      if (typeof pick.id === "string" && pick.primitive.MODULE === MODULE) {
        // 军标、标注
        targetId = pick.id.split("_")[1];
      } else if (pick.id.MODULE === MODULE) {
        // 模型
        targetId = pick.id._id.split("_")[1];
      }
      label = this.getLabelById(targetId);
      billboard = this.getBillboardById(targetId);
      gltfModel = this.getGltfModelById(targetId);
      colorBackup = label.fillColor.clone();
      label.fillColor = Cesium.Color.fromAlpha(Cesium.Color.GOLD, 1);
      billboard.color = Cesium.Color.fromAlpha(Cesium.Color.GOLD, 1);
      gltfModel.model.color = Cesium.Color.fromAlpha(Cesium.Color.GOLD, 1);
      this._viewer.scene.screenSpaceCameraController.enableRotate = false;
      this._viewer.screenSpaceEventHandler.setInputAction((move) => {
        const position = move.endPosition;
        const cartesian = this._viewer.scene.globe.pick(
          this._viewer.camera.getPickRay(position),
          this._viewer.scene
        );
        let lonLat = this.transformCartesianToWGS84(cartesian);
        window.toolTip = `经度：${lonLat.x.toFixed(6)}<br />纬度：${lonLat.y.toFixed(6)}<br />高度：${lonLat.z.toFixed(6)}`;
        CreateRemindertip(window.toolTip, position, true);
        label.position = cartesian;
        billboard.position = cartesian;
        gltfModel.position._value = cartesian;
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      this._viewer.screenSpaceEventHandler.setInputAction((up) => {
        this._viewer.scene.screenSpaceCameraController.enableRotate = true;
        label.fillColor = colorBackup;
        billboard.color = colorBackup;
        gltfModel.model.color = null;
        this._viewer.screenSpaceEventHandler.removeInputAction(
          Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );
        CreateRemindertip(window.toolTip, up.position, false);
      }, Cesium.ScreenSpaceEventType.LEFT_UP);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    /*  this._viewer.screenSpaceEventHandler.setInputAction((e) => {
      console.log("LEFT_DOWN");
      this._pointDraged = this._viewer.scene.pick(e.position);
      this._leftDownFlag = true;
      if (this._pointDraged) {
        this._viewer.scene.screenSpaceCameraController.enableRotate = false;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    this._viewer.screenSpaceEventHandler.setInputAction((e) => {
      console.log("LEFT_UP");
      this._leftDownFlag = false;
      this._pointDraged = null;
      this._viewer.scene.screenSpaceCameraController.enableRotate = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    this._viewer.screenSpaceEventHandler.setInputAction((e) => {
      console.log("MOUSE_MOVE");
      if (this._leftDownFlag === true && this._pointDraged != null) {
        let ray = this._viewer.camera.getPickRay(e.endPosition);
        let cartesian = this._viewer.scene.globe.pick(ray, this._viewer.scene);
        this._pointDraged.primitive._position = new Cesium.CallbackProperty(() => {
          return cartesian;
        }, false);
        // this._pointDraged.position = cartesian;
        this._viewer.scene.requestRender();
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE); */
    /* let handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
    handler.setInputAction((movement) => {
      let picked = this._viewer.scene.pick(movement.position);
      let pickedID;
      let position;
      if (Cesium.defined(picked)) {
        if (
          typeof picked.id === "string" &&
          picked.primitive.MODULE === MODULE
        ) {
          // 军标、标注
          pickedID = picked.id.split("_")[1];
          position = this.transformCartesianToWGS84(picked.primitive.position);
        } else if (picked.id.MODULE === MODULE) {
          // 模型
          pickedID = picked.id._id.split("_")[1];
          position = this.transformCartesianToWGS84(picked.id._position._value);
        }
        if (pickedID && position) {
          callback &&
            callback({
              id: pickedID,
              longitude: position.x,
              latitude: position.y,
              altitude: position.z,
            });
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK); */
  }
  /**
   * 经纬度转笛卡尔坐标
   * @param position - { x, y, z }
   * @returns {Object} Cartesian3
   */
  transformWGS84ToCartesian(position) {
    return position
      ? Cesium.Cartesian3.fromDegrees(
          position.x,
          position.y,
          position.z,
          Cesium.Ellipsoid.WGS84
        )
      : Cesium.Cartesian3.ZERO;
  }
  /**
   * 笛卡尔坐标转经纬度
   * @param cartesian Cartesian3
   * @returns {Object} { x, y, z }
   */
  transformCartesianToWGS84(cartesian) {
    let ellipsoid = Cesium.Ellipsoid.WGS84;
    let cartographic = ellipsoid.cartesianToCartographic(cartesian);
    const x = Cesium.Math.toDegrees(cartographic.longitude);
    const y = Cesium.Math.toDegrees(cartographic.latitude);
    const z = cartographic.height;
    return { x, y, z };
  }
}

export default Targets;
