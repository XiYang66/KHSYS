import $ from "jquery";
import turf from "./turf";
const url = "";
var _typeof =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function (obj) {
        return typeof obj;
      }
    : function (obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };

export function Measure(opts) {
  var viewer = opts.viewer;

  //显示测量结果文本的字体
  var _labelAttr = {
    color: "#ffffff",
    font_family: "楷体",
    font_size: 23,
    border: true,
    border_color: "#000000",
    border_width: 3,
    background: true,
    background_color: "#000000",
    background_opacity: 0.5,
    scaleByDistance: true,
    scaleByDistance_far: 800000,
    scaleByDistance_farValue: 0.3,
    scaleByDistance_near: 1000,
    scaleByDistance_nearValue: 1,
    pixelOffset: [0, -15],
  };
  if (opts.label) {
    for (var key in opts.label) {
      _labelAttr[key] = opts.label[key];
    }
  }
  var thisType = ""; //当前正在绘制的类别
  var drawControl = new Draw({
    viewer: viewer,
    hasEdit: false,
    onChangeDrawing: function onChangeDrawing(entity) {
      switch (thisType) {
        case "length":
        case "section":
          workLength.showAddPointLength(entity);
          break;
        case "area":
          workArea.showAddPointLength(entity);
          break;
        case "volume":
          workVolume.showAddPointLength(entity);
          break;
        case "height":
          workHeight.showAddPointLength(entity);
          break;
        case "super_height":
          workSuperHeight.showAddPointLength(entity);
          break;
        case "angle":
          workAngle.showAddPointLength(entity);
          break;
      }
    },
    onMoveDrawing: function onMoveDrawing(entity) {
      switch (thisType) {
        case "length":
        case "section":
          workLength.showMoveDrawing(entity);
          break;
        case "area":
          workArea.showMoveDrawing(entity);
          break;
        case "volume":
          workVolume.showMoveDrawing(entity);
          break;
        case "height":
          workHeight.showMoveDrawing(entity);
          break;
        case "super_height":
          workSuperHeight.showMoveDrawing(entity);
          break;
        case "angle":
          workAngle.showMoveDrawing(entity);
          break;
      }
    },
    onStopDrawing: function onStopDrawing(entity) {
      switch (thisType) {
        case "length":
          workLength.showDrawEnd(entity);
          break;
        case "section":
          workLength.showDrawEnd(entity);
          break;
        case "area":
          workArea.showDrawEnd(entity);
          break;
        case "volume":
          workVolume.showDrawEnd(entity);
          break;
        case "height":
          workHeight.showDrawEnd(entity);
          break;
        case "super_height":
          workSuperHeight.showDrawEnd(entity);
          break;
        case "angle":
          workAngle.showDrawEnd(entity);
          break;
      }
    },
  });

  var dataSource = drawControl.getDataSource();

  /*长度测量*/
  function measuerLength(options) {
    endLastDraw();
    thisType = "length";
    options = options || {};
    options.type = thisType;
    if (!options.hasOwnProperty("terrain")) options.terrain = true;

    workLength.start(options);
  }

  /*剖面分析*/
  function measureSection(options) {
    endLastDraw();

    thisType = "section";
    options = options || {};
    options.type = thisType;
    options.terrain = true;

    workLength.start(options);
  }

  /*面积测量*/
  function measureArea(options) {
    endLastDraw();

    thisType = "area";
    options = options || {};
    options.type = thisType;
    workArea.start(options);
  }

  /*体积测量*/
  function measureVolume(options) {
    endLastDraw();

    thisType = "volume";
    options = options || {};
    options.type = thisType;

    workVolume.start(options);
  }

  /*高度测量*/
  function measureHeight(options) {
    endLastDraw();

    options = options || {};

    if (options.hasOwnProperty("isSuper") && !options.isSuper) {
      thisType = "height";
      options.type = thisType;
      workHeight.start(options);
    } else {
      thisType = "super_height";
      options.type = thisType;
      workSuperHeight.start(options);
    }
  }

  /*角度测量*/
  function measureAngle(options) {
    endLastDraw();

    thisType = "angle";
    options = options || {};
    options.type = thisType;

    workAngle.start(options);
  }

  //如果上次未完成绘制就单击了新的，清除之前未完成的。
  function endLastDraw() {
    workLength.clearLastNoEnd();
    workArea.clearLastNoEnd();
    workVolume.clearLastNoEnd();
    workHeight.clearLastNoEnd();
    workSuperHeight.clearLastNoEnd();
    workAngle.clearLastNoEnd();

    drawControl.stopDraw();
  }

  /*清除测量*/
  function clearMeasure() {
    thisType = "";
    endLastDraw();

    //dataSource.entities.removeAll();
    drawControl.deleteAll();

    viewer.scene.requestRender();
  }

  /** 更新量测结果的单位  */
  function updateUnit(thisType, unit) {
    var arr = dataSource.entities.values;
    for (var i in arr) {
      var entity = arr[i];
      if (
        entity.label &&
        entity.isMarsMeasureLabel &&
        entity.attribute &&
        entity.attribute.value
      ) {
        if (entity.attribute.type != thisType) continue;
        if (thisType == "area") {
          entity.label.text._value =
            (entity.attribute.textEx || "") +
            formatArea(entity.attribute.value, unit);
          var a = document.getElementById("lenghtNum");
          a.innerHTML = formatArea(entity.attribute.value, unit);
        } else {
          entity.label.text._value =
            (entity.attribute.textEx || "") +
            formatLength(entity.attribute.value, unit);
          var a = document.getElementById("lenghtNum");
          a.innerHTML = formatLength(entity.attribute.value, unit);
        }
      }
    }
    viewer.scene.requestRender();
  }

  var workLength = {
    options: null,
    arrLables: [], //各线段label
    totalLable: null, //总长label
    //清除未完成的数据
    clearLastNoEnd: function clearLastNoEnd() {
      if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
      if (this.arrLables && this.arrLables.length > 0) {
        var arrLables = this.arrLables;
        if (arrLables && arrLables.length > 0) {
          for (var i in arrLables) {
            dataSource.entities.remove(arrLables[i]);
          }
        }
      }
      this.totalLable = null;
      this.arrLables = [];
    },
    //开始绘制
    start: function start(options) {
      this.options = options;

      //总长label
      var entityattr = LabelControl.attribute2Entity(
        { style: _labelAttr },
        {
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: true,
        }
      );
      console.log(entityattr);
      this.totalLable = dataSource.entities.add({
        label: entityattr,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });
      this.arrLables = [];

      drawControl.startDraw({
        type: "polyline",
        addHeight: options.addHeight,
        style: options.style || {
          lineType: "glow",
          color: "#ebe12c",
          width: 9,
          glowPower: 0.1,
          clampToGround: this.options.type == "section" || this.options.terrain, //是否贴地
        },
        success: options.success,
      });
    },
    //绘制增加一个点后，显示该分段的长度
    showAddPointLength: function showAddPointLength(entity) {
      var positions = drawControl.getPositions(entity);
      console.log(positions);
      var entityattr = LabelControl.attribute2Entity(
        { style: _labelAttr },
        {
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: true,
        }
      );

      var tempSingleLabel = dataSource.entities.add({
        position: positions[positions.length - 1],
        label: entityattr,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
        point: {
          pixelSize: 10, //点的大小
          color: Cesium.Color.RED, //点的颜色
        },
      });

      if (positions.length == 1) {
        tempSingleLabel.label.text = "起点";
        //tempSingleLabel.attribute.value = 0;
        // tempSingleLabel.label.font = '8px'
      } else {
        var distance = this.getLength(positions);
        var distancestr = formatLength(distance, this.options.unit);

        tempSingleLabel.label.text = distancestr;
        tempSingleLabel.attribute.value = distance;
        // tempSingleLabel.label.font = '8px'
        //屏蔽比较小的数值
        if (
          this.getLength([
            positions[positions.length - 2],
            positions[positions.length - 1],
          ]) < 5
        )
          tempSingleLabel.show = false;
      }
      this.arrLables.push(tempSingleLabel);
    },
    //绘制过程移动中，动态显示长度信息
    showMoveDrawing: function showMoveDrawing(entity) {
      var positions = drawControl.getPositions(entity);
      if (positions.length < 2) return;

      var distance = this.getLength(positions);
      var distancestr = formatLength(distance, this.options.unit);

      this.totalLable.position = positions[positions.length - 1];
      this.totalLable.label.text = "总长:" + distancestr;
      // console.log(this.totalLable.label)
      // this.totalLable.label.fillColor = Cesium.Color.GREEN
      // this.totalLable.label.font = '8px'
      this.totalLable.label.show = true;

      this.totalLable.attribute.value = distance;
      this.totalLable.attribute.textEx = "总长:";
      var a = document.getElementById("lenghtNum");
      a.innerHTML = distancestr;
      if (this.options.calback) this.options.calback(distancestr, distance);
    },
    //绘制完成后
    showDrawEnd: function showDrawEnd(entity) {
      var positions = drawControl.getPositions(entity);
      var count = this.arrLables.length - positions.length;
      if (count >= 0) {
        for (
          var i = this.arrLables.length - 1;
          i >= positions.length - 1;
          i--
        ) {
          dataSource.entities.remove(this.arrLables[i]);
        }
        this.arrLables.splice(positions.length - 1, count + 1);
      }
      entity._totalLable = this.totalLable;
      entity._arrLables = this.arrLables;

      this.totalLable = null;
      this.arrLables = [];

      if (entity.polyline == null) return;

      if (this.options.type == "section") this.updateSectionForTerrain(entity);
      else if (this.options.terrain) this.updateLengthForTerrain(entity);
    },
    //计算贴地线
    updateLengthForTerrain: function updateLengthForTerrain(entity) {
      var that = this;
      var positions = entity.polyline.positions.getValue();
      var arrLables = entity._arrLables;
      var totalLable = entity._totalLable;
      var unit = totalLable && totalLable.unit;

      var index = 0;
      var positionsNew = [];

      function getLineFD() {
        index++;

        var arr = [positions[index - 1], positions[index]];
        (0, terrainPolyline)({
          viewer: viewer,
          positions: arr,
          calback: function calback(raisedPositions, noHeight) {
            if (noHeight) {
              if (index == 1) positionsNew = positionsNew.concat(arr);
              else positionsNew = positionsNew.concat([positions[index]]);
            } else {
              positionsNew = positionsNew.concat(raisedPositions);
            }

            if (index >= positions.length - 1) {
              entity.polyline.positions.setValue(positionsNew);
              if (totalLable) {
                var distance = that.getLength(positionsNew);
                var distancestr = formatLength(distance, unit);

                totalLable.label.text = "总长:" + distancestr;
                totalLable.attribute.value = distance;

                if (that.options.calback)
                  that.options.calback(distancestr, distance);
              }
            } else {
              var distance = that.getLength(raisedPositions);
              var distancestr = formatLength(distance, unit);
              var thisLabel = arrLables[index];
              thisLabel.label.text = distancestr;
              thisLabel.attribute.value = distance;

              getLineFD();
            }
          },
        });
      }
      getLineFD();
    },

    //计算剖面
    updateSectionForTerrain: function updateSectionForTerrain(entity) {
      var positions = entity.polyline.positions.getValue();
      if (positions.length < 2) return;

      var arrLables = entity._arrLables;
      var totalLable = entity._totalLable;
      var unit = totalLable && totalLable.unit;

      var index = 0;
      var positionsNew = [];

      var alllen = 0;
      var arrLen = [];
      var arrHB = [];
      var arrLX = [];
      var arrPoint = [];

      var that = this;
      function getLineFD() {
        index++;

        var arr = [positions[index - 1], positions[index]];
        (0, terrainPolyline)({
          viewer: viewer,
          positions: arr,
          calback: function calback(raisedPositions, noHeight) {
            if (noHeight) {
              if (index == 1) positionsNew = positionsNew.concat(arr);
              else positionsNew = positionsNew.concat([positions[index]]);
            } else {
              positionsNew = positionsNew.concat(raisedPositions);
            }

            var h1 = Cesium.Cartographic.fromCartesian(
              positions[index - 1]
            ).height;
            var h2 = Cesium.Cartographic.fromCartesian(positions[index]).height;
            var hstep = (h2 - h1) / raisedPositions.length;

            for (var i = 0; i < raisedPositions.length; i++) {
              //长度
              if (i != 0) {
                alllen += Cesium.Cartesian3.distance(
                  raisedPositions[i],
                  raisedPositions[i - 1]
                );
              }
              arrLen.push(Number(alllen.toFixed(1)));

              //海拔高度
              var point = (0, formatPositon)(raisedPositions[i]);
              arrHB.push(point.z);
              arrPoint.push(point);

              //路线高度
              var fxgd = Number((h1 + hstep * i).toFixed(1));
              arrLX.push(fxgd);
            }

            if (index >= positions.length - 1) {
              if (totalLable) {
                var distance = that.getLength(positionsNew);
                var distancestr = formatLength(distance, unit);

                totalLable.label.text = "总长:" + distancestr;
                totalLable.attribute.value = distance;
              }
              if (that.options.calback)
                that.options.calback({
                  distancestr: distancestr,
                  distance: distance,
                  arrLen: arrLen,
                  arrLX: arrLX,
                  arrHB: arrHB,
                  arrPoint: arrPoint,
                });
            } else {
              var distance = that.getLength(raisedPositions);
              var distancestr = formatLength(distance, unit);

              var thisLabel = arrLables[index];
              thisLabel.label.text = distancestr;
              thisLabel.attribute.value = distance;

              getLineFD();
            }
          },
        });
      }
      getLineFD();
    },
    //计算长度，单位：米
    getLength: function getLength(positions) {
      var distance = 0;
      for (var i = 0, len = positions.length - 1; i < len; i++) {
        distance += Cesium.Cartesian3.distance(positions[i], positions[i + 1]);
      }
      return distance;
    },
  };

  var workArea = {
    options: null,
    totalLable: null, //面积label
    //清除未完成的数据
    clearLastNoEnd: function clearLastNoEnd() {
      if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
      this.totalLable = null;
    },
    //开始绘制
    start: function start(options) {
      this.options = options;

      var entityattr = LabelControl.attribute2Entity(
        { style: _labelAttr },
        {
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: false,
        }
      );
      this.totalLable = dataSource.entities.add({
        label: {
          text: "123",
          font: "18px sans-serif",
          color: Cesium.Color.GOLD,
        },
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });

      drawControl.startDraw({
        type: "polygon",
        style: options.style || {
          color: "#00fff2",
          outline: true,
          outlineColor: "#fafa5a",
          outlineWidth: 1,
          opacity: 0.4,
          clampToGround: true, //贴地
        },
        success: options.success,
      });
    },
    //绘制增加一个点后，显示该分段的长度
    showAddPointLength: function showAddPointLength(entity) {},
    //绘制过程移动中，动态显示长度信息
    showMoveDrawing: function showMoveDrawing(entity) {
      var positions = drawControl.getPositions(entity);
      if (positions.length < 3) return;

      var polygon = PolygonControl.toGeoJSON(entity);
      // var area = area(polygon);
      // return;
      var area = areas(polygon);
      // console.log(area);
      var areastr = formatArea(area, this.options.unit);

      //求中心点
      // console.log(polygon)
      var center = centerOfMass(polygon);
      var maxHeight = drawutils.getMaxHeightForPositions(positions);
      var ptcenter = Cesium.Cartesian3.fromDegrees(
        center.geometry.coordinates[0],
        center.geometry.coordinates[1],
        maxHeight + 1
      );

      this.totalLable.position = ptcenter;
      this.totalLable.label.text = "面积:" + areastr;
      this.totalLable.label.show = true;

      this.totalLable.attribute.value = area;
      this.totalLable.attribute.textEx = "面积:";

      if (this.options.calback) this.options.calback(areastr, area);
    },
    //绘制完成后
    showDrawEnd: function showDrawEnd(entity) {
      if (entity.polygon == null) return;
      var polyPositions = entity.polygon.hierarchy.getValue();
      //最后的高程加1，以确保端点显示在模型上面
      for (var i = 0, len = polyPositions.length; i < len; i++) {
        polyPositions[i].z = polyPositions[i].z + 1;
      }

      entity._totalLable = this.totalLable;
      this.totalLable = null;
    },
  };

  var workVolume = {
    options: null,
    totalLable: null, //体积label
    prevEntity: null, //立体边界
    //清除未完成的数据
    clearLastNoEnd: function clearLastNoEnd() {
      if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
      this.totalLable = null;

      if (this.prevEntity != null) dataSource.entities.remove(this.prevEntity);
      this.prevEntity = null;
    },
    //开始绘制
    start: function start(options) {
      this.options = options;

      var entityattr = LabelControl.attribute2Entity(
        { style: _labelAttr },
        {
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: false,
        }
      );

      this.totalLable = dataSource.entities.add({
        label: entityattr,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });

      drawControl.startDraw({
        type: "polygon",
        style: options.style || {
          color: "#00fff2",
          outline: true,
          outlineColor: "#fafa5a",
          outlineWidth: 1,
          opacity: 0.4,
          clampToGround: true, //贴地
        },
      });
    },
    //绘制增加一个点后，显示该分段的长度
    showAddPointLength: function showAddPointLength(entity) {},
    //绘制过程移动中，动态显示长度信息
    showMoveDrawing: function showMoveDrawing(entity) {},
    //绘制完成后
    showDrawEnd: function showDrawEnd(entity) {
      if (entity.polygon == null) return;

      var positions = entity.polygon.hierarchy.getValue();
      var result = this.computeCutVolume(positions.positions);
      var maxHeight = 0;
      var totalCutVolume = result.totalCutVolume;

      var totalCutVolumestr = totalCutVolume.toFixed(2) + "立方米"; ///formatArea(totalCutVolume, this.options.unit);

      //求中心点
      var centroid = this.computeCentroidOfPolygon(positions.positions);
      // console.log(centroid)
      var ptcenter = Cesium.Cartesian3.fromRadians(
        centroid.longitude,
        centroid.latitude,
        maxHeight + 10
      );
      // console.log(ptcenter)
      this.totalLable.position = ptcenter;
      this.totalLable.label.text = "挖方体积:" + totalCutVolumestr;
      this.totalLable.label.show = true;

      this.totalLable.attribute.value = totalCutVolume;
      this.totalLable.attribute.textEx = "挖方体积:";

      if (this.options.calback) this.options.calback(areastr, totalCutVolume);

      dataSource.entities.remove(entity);
      //显示立体边界
      entity = dataSource.entities.add({
        polygon: {
          hierarchy: {
            positions: positions.positions,
          },
          extrudedHeight: maxHeight,
          closeTop: false,
          closeBottom: false,
          material: new Cesium.Color.fromCssColorString("#00fff2").withAlpha(
            0.5
          ),
          outline: true,
          outlineColor: new Cesium.Color.fromCssColorString(
            "#fafa5a"
          ).withAlpha(0.4),
          outlineWidth: 1,
        },
      });

      entity._totalLable = this.totalLable;
      this.totalLable = null;
    },
    computeCutVolume: function computeCutVolume(positions) {
      var minHeight = 10000000;
      for (var i = 0; i < positions.length; i++) {
        var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
        var height = viewer.scene.globe.getHeight(cartographic);
        if (minHeight > height) minHeight = height;
      }

      var granularity = Math.PI / Math.pow(2, 11);
      granularity = granularity / 64;

      var polygonGeometry = new Cesium.PolygonGeometry.fromPositions({
        positions: positions,
        vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
        granularity: granularity,
      });
      //polygon subdivision
      var geom = new Cesium.PolygonGeometry.createGeometry(polygonGeometry);
      var totalCutVolume = 0;
      var maxHeight = 0;

      var i0, i1, i2;
      var height1, height2, height3;
      var p1, p2, p3;
      var cartesian;
      var cartographic;
      var bottomArea;

      for (var i = 0; i < geom.indices.length; i += 3) {
        i0 = geom.indices[i];
        i1 = geom.indices[i + 1];
        i2 = geom.indices[i + 2];

        cartesian = new Cesium.Cartesian3(
          geom.attributes.position.values[i0 * 3],
          geom.attributes.position.values[i0 * 3 + 1],
          geom.attributes.position.values[i0 * 3 + 2]
        );

        cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        height1 = viewer.scene.globe.getHeight(cartographic);
        p1 = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          0 /*height1 + 1000*/
        );

        if (maxHeight < height1) maxHeight = height1;

        cartesian = new Cesium.Cartesian3(
          geom.attributes.position.values[i1 * 3],
          geom.attributes.position.values[i1 * 3 + 1],
          geom.attributes.position.values[i1 * 3 + 2]
        );

        cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        height2 = viewer.scene.globe.getHeight(cartographic);

        var p2 = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          0 /*height2 + 1000*/
        );

        if (maxHeight < height2) maxHeight = height2;

        cartesian = new Cesium.Cartesian3(
          geom.attributes.position.values[i2 * 3],
          geom.attributes.position.values[i2 * 3 + 1],
          geom.attributes.position.values[i2 * 3 + 2]
        );

        cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        height3 = viewer.scene.globe.getHeight(cartographic);
        p3 = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          0 /*height3 + 1000*/
        );

        if (maxHeight < height3) maxHeight = height3;

        bottomArea = this.computeAreaOfTriangle(p1, p2, p3);
        totalCutVolume =
          totalCutVolume +
          (bottomArea *
            (height1 - minHeight + height2 - minHeight + height3 - minHeight)) /
            3;
      }

      return {
        maxHeight: maxHeight,
        totalCutVolume: totalCutVolume,
      };
    },
    computeAreaOfTriangle: function computeAreaOfTriangle(pos1, pos2, pos3) {
      var a = Cesium.Cartesian3.distance(pos1, pos2);
      var b = Cesium.Cartesian3.distance(pos2, pos3);
      var c = Cesium.Cartesian3.distance(pos3, pos1);
      var S = (a + b + c) / 2;
      return Math.sqrt(S * (S - a) * (S - b) * (S - c));
    },
    //求面的中心点
    computeCentroidOfPolygon: function computeCentroidOfPolygon(positions) {
      var x = [];
      var y = [];

      for (var i = 0; i < positions.length; i++) {
        var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);

        x.push(cartographic.longitude);
        y.push(cartographic.latitude);
      }

      var x0 = 0.0,
        y0 = 0.0,
        x1 = 0.0,
        y1 = 0.0;
      var signedArea = 0.0;
      var a = 0.0;
      var centroidx = 0.0,
        centroidy = 0.0;

      for (i = 0; i < positions.length; i++) {
        x0 = x[i];
        y0 = y[i];

        if (i == positions.length - 1) {
          x1 = x[0];
          y1 = y[0];
        } else {
          x1 = x[i + 1];
          y1 = y[i + 1];
        }

        a = x0 * y1 - x1 * y0;
        signedArea += a;
        centroidx += (x0 + x1) * a;
        centroidy += (y0 + y1) * a;
      }

      signedArea *= 0.5;
      centroidx /= 6.0 * signedArea;
      centroidy /= 6.0 * signedArea;
      return new Cesium.Cartographic(centroidx, centroidy);
    },
  };
  var workHeight = {
    options: null,
    totalLable: null, //高度label
    //清除未完成的数据
    clearLastNoEnd: function clearLastNoEnd() {
      if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
      this.totalLable = null;
    },
    //开始绘制
    start: function start(options) {
      this.options = options;

      var entityattr = LabelControl.attribute2Entity(
        { style: _labelAttr },
        {
          horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: false,
        }
      );

      this.totalLable = dataSource.entities.add({
        label: entityattr,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });

      drawControl.startDraw({
        type: "polyline",
        minMaxPoints: { min: 2, max: 2, isSuper: false },
        style: options.style || {
          lineType: "glow",
          color: "#ebe12c",
          width: 9,
          glowPower: 0.1,
        },
        success: options.success,
      });
    },
    //绘制增加一个点后，显示该分段的长度
    showAddPointLength: function showAddPointLength(entity) {},
    //绘制过程移动中，动态显示长度信息
    showMoveDrawing: function showMoveDrawing(entity) {
      var positions = drawControl.getPositions(entity);
      if (positions.length < 2) return;

      var cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
      var cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
      var height = Math.abs(cartographic1.height - cartographic.height);
      var heightstr = formatLength(height, this.options.unit);

      this.totalLable.position = drawutils.getMidPosition(
        positions[0],
        positions[1]
      );
      this.totalLable.label.text = "高度差:" + heightstr;
      this.totalLable.label.show = true;

      this.totalLable.attribute.value = height;
      this.totalLable.attribute.textEx = "高度差:";
      // var a = document.getElementById('lenghtNum');
      // a.innerHTML = height
      if (this.options.calback) this.options.calback(heightstr, height);
    },
    //绘制完成后
    showDrawEnd: function showDrawEnd(entity) {
      entity._totalLable = this.totalLable;
      this.totalLable = null;
    },
  };

  var workSuperHeight = {
    options: null,
    totalLable: null, //高度差label
    xLable: null, //水平距离label
    hLable: null, //水平距离label
    //清除未完成的数据
    clearLastNoEnd: function clearLastNoEnd() {
      if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
      if (this.xLable != null) dataSource.entities.remove(this.xLable);
      if (this.hLable != null) dataSource.entities.remove(this.hLable);

      this.totalLable = null;
      this.xLable = null;
      this.hLable = null;
    },
    //开始绘制
    start: function start(options) {
      this.options = options;

      var entityattr = LabelControl.attribute2Entity(
        { style: _labelAttr },
        {
          horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          show: false,
        }
      );
      this.totalLable = dataSource.entities.add({
        label: entityattr,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });

      var entityattr2 = LabelControl.attribute2Entity(
        { style: _labelAttr },
        {
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: false,
        }
      );
      entityattr2.pixelOffset = new Cesium.Cartesian2(0, 0);
      this.xLable = dataSource.entities.add({
        label: entityattr2,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });

      this.hLable = dataSource.entities.add({
        label: entityattr2,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });

      drawControl.startDraw({
        type: "polyline",
        minMaxPoints: { min: 2, max: 2, isSuper: true },
        style: options.style || {
          lineType: "glow",
          color: "#ebe12c",
          width: 9,
          glowPower: 0.1,
        },
        success: options.success,
      });
    },
    //绘制增加一个点后，显示该分段的长度
    showAddPointLength: function showAddPointLength(entity) {
      var lonlats = drawControl.getPositions(entity);
      if (lonlats.length == 4) {
        var mouseEndPosition = lonlats[3].clone();
        lonlats.pop();
        lonlats.pop();
        lonlats.pop();
        lonlats.push(mouseEndPosition);
      }

      if (lonlats.length == 2) {
        var zCartesian = drawutils.getZHeightPosition(lonlats[0], lonlats[1]);
        var hDistance = drawutils.getHDistance(lonlats[0], lonlats[1]);
        if (hDistance > 3.0) {
          lonlats.push(zCartesian);
          lonlats.push(lonlats[0]);
        }
      }

      this.showSuperHeight(lonlats);
    },
    //绘制过程移动中，动态显示长度信息
    showMoveDrawing: function showMoveDrawing(entity) {
      var lonlats = drawControl.getPositions(entity);
      if (lonlats.length == 4) {
        var mouseEndPosition = lonlats[3].clone();
        lonlats.pop();
        lonlats.pop();
        lonlats.pop();
        lonlats.push(mouseEndPosition);
      }

      if (lonlats.length == 2) {
        var zCartesian = drawutils.getZHeightPosition(lonlats[0], lonlats[1]);
        var hDistance = drawutils.getHDistance(lonlats[0], lonlats[1]);
        if (hDistance > 3.0) {
          lonlats.push(zCartesian);
          lonlats.push(lonlats[0]);
        }
      }
      this.showSuperHeight(lonlats);
    },
    //绘制完成后
    showDrawEnd: function showDrawEnd(entity) {
      entity._arrLables = [this.totalLable, this.hLable, this.xLable];

      this.totalLable = null;
      this.hLable = null;
      this.xLable = null;
    },

    /**
     * 超级 高程测量
     * 由4个点形成的三角形（首尾点相同），计算该三角形三条线段的长度
     * @param {Array} positions 4个点形成的点数组
     */
    showSuperHeight: function showSuperHeight(positions) {
      var vLength; //垂直距离
      var hLength; //水平距离
      var lLength; //长度
      var height;
      if (positions.length == 4) {
        var midLPoint = drawutils.getMidPosition(positions[0], positions[1]);
        var midXPoint, midHPoint;
        var cartographic0 = Cesium.Cartographic.fromCartesian(positions[0]);
        var cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
        var cartographic2 = Cesium.Cartographic.fromCartesian(positions[2]);
        var tempHeight = cartographic1.height - cartographic2.height;
        height = cartographic1.height - cartographic0.height;
        lLength = Cesium.Cartesian3.distance(positions[0], positions[1]);
        if (height > -1 && height < 1) {
          midHPoint = positions[1];
          this.updateSuperHeightLabel(
            this.totalLable,
            midHPoint,
            "高度差:",
            height
          );
          this.updateSuperHeightLabel(this.hLable, midLPoint, "", lLength);
        } else {
          if (tempHeight > -0.1 && tempHeight < 0.1) {
            midXPoint = drawutils.getMidPosition(positions[2], positions[1]);
            midHPoint = drawutils.getMidPosition(positions[2], positions[3]);
            hLength = Cesium.Cartesian3.distance(positions[1], positions[2]);
            vLength = Cesium.Cartesian3.distance(positions[3], positions[2]);
          } else {
            midHPoint = drawutils.getMidPosition(positions[2], positions[1]);
            midXPoint = drawutils.getMidPosition(positions[2], positions[3]);
            hLength = Cesium.Cartesian3.distance(positions[3], positions[2]);
            vLength = Cesium.Cartesian3.distance(positions[1], positions[2]);
          }
          this.updateSuperHeightLabel(
            this.totalLable,
            midHPoint,
            "高度差:",
            vLength
          );
          this.updateSuperHeightLabel(this.xLable, midXPoint, "", hLength);
          this.updateSuperHeightLabel(this.hLable, midLPoint, "", lLength);
        }
      } else if (positions.length == 2) {
        vLength = Cesium.Cartesian3.distance(positions[1], positions[0]);
        var midHPoint = drawutils.getMidPosition(positions[0], positions[1]);
        if (xLable.label.show) {
          xLable.label.show = false;
          hLable.label.show = false;
        }
        this.updateSuperHeightLabel(
          this.totalLable,
          midHPoint,
          "高度差:",
          vLength
        );
      }

      var heightstr = formatLength(vLength, this.options.unit);
      var a = document.getElementById("lenghtNum");

      a.innerHTML = formatLength(lLength, this.options.unit);
      if (this.options.calback) this.options.calback(heightstr, vLength);
    },
    /**
     * 超级 高程测量 显示标签
     * @param {Cesium.Label} currentLabel 显示标签
     * @param {Cesium.Cartesian3} postion 坐标位置
     * @param {String} type 类型("高度差"，"水平距离"，"长度")
     * @param {Object} value 值
     */
    updateSuperHeightLabel: function updateSuperHeightLabel(
      currentLabel,
      postion,
      type,
      value
    ) {
      if (currentLabel == null) return;

      currentLabel.position = postion;
      currentLabel.label.text = type + formatLength(value, this.options.unit);
      currentLabel.label.show = true;

      currentLabel.attribute.value = value;
      currentLabel.attribute.textEx = type;
    },
  };

  var workAngle = {
    options: null,
    totalLable: null, //角度label
    exLine: null, //辅助线
    //清除未完成的数据
    clearLastNoEnd: function clearLastNoEnd() {
      if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
      this.totalLable = null;

      if (this.exLine != null) dataSource.entities.remove(this.exLine);
      this.exLine = null;
    },
    //开始绘制
    start: function start(options) {
      this.options = options;

      var entityattr = LabelControl.attribute2Entity(
        { style: _labelAttr },
        {
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          show: false,
        }
      );

      this.totalLable = dataSource.entities.add({
        label: entityattr,
        isMarsMeasureLabel: true,
        attribute: {
          unit: this.options.unit,
          type: this.options.type,
        },
      });

      drawControl.startDraw({
        type: "polyline",
        minMaxPoints: { min: 2, max: 2 },
        style: options.style || {
          lineType: "arrow",
          color: "#ebe967",
          width: 9,
          clampToGround: true,
        },
        success: options.success,
      });
    },
    //绘制增加一个点后，显示该分段的长度
    showAddPointLength: function showAddPointLength(entity) {},
    //绘制过程移动中，动态显示长度信息
    showMoveDrawing: function showMoveDrawing(entity) {
      var positions = drawControl.getPositions(entity);
      if (positions.length < 2) return;

      var len = Cesium.Cartesian3.distance(positions[0], positions[1]);

      //求方位角
      var point1 = (0, formatPositon)(positions[0]);
      var point2 = (0, formatPositon)(positions[1]);

      var pt1 = point([point1.x, point1.y, point1.z]);
      var pt2 = point([point2.x, point2.y, point2.z]);
      var bearing = Math.round(rhumbBearing(pt1, pt2));

      //求参考点
      var newpoint = destination(pt1, len / 3000, 0, { units: "kilometers" }); //1/3
      newpoint = {
        x: newpoint.geometry.coordinates[0],
        y: newpoint.geometry.coordinates[1],
        z: point1.z,
      };
      var new_position = Cesium.Cartesian3.fromDegrees(
        newpoint.x,
        newpoint.y,
        newpoint.z
      );

      this.updateExLine([positions[0], new_position]); //参考线

      this.totalLable.position = positions[1];
      this.totalLable.label.text =
        "角度:" + bearing + "°\n距离:" + formatLength(len);
      this.totalLable.label.show = true;

      this.totalLable.attribute.value = bearing;
      this.totalLable.attribute.textEx = "角度:";
      var a = document.getElementById("lenghtNum");
      a.innerHTML = bearing;
      if (this.options.calback) this.options.calback(bearing + "°", bearing);
    },
    updateExLine: function updateExLine(positions) {
      if (this.exLine) {
        this.exLine.polyline.positions.setValue(positions);
      } else {
        this.exLine = dataSource.entities.add({
          polyline: {
            positions: positions,
            width: 3,
            clampToGround: true,
            material: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.RED,
            }),
          },
        });
      }
    },
    //绘制完成后
    showDrawEnd: function showDrawEnd(entity) {
      entity._totalLable = this.totalLable;
      this.totalLable = null;
      this.exLine = null;
    },
  };

  /**  进行单位换算，格式化显示面积    */
  function formatArea(val, unit) {
    if (val == null) return "";

    if (unit == null || unit == "auto") {
      if (val < 1000000) unit = "m";
      else unit = "km";
    }

    var valstr = "";
    switch (unit) {
      default:
      case "m":
        valstr = val.toFixed(2) + "平方米";
        break;
      case "km":
        valstr = (val / 1000000).toFixed(2) + "平方公里";
        break;
      case "mu":
        valstr = (val * 0.0015).toFixed(2) + "亩";
        break;
      case "ha":
        valstr = (val * 0.0001).toFixed(2) + "公顷";
        break;
    }

    return valstr;
  }

  /**  单位换算，格式化显示长度     */
  function formatLength(val, unit) {
    if (val == null) return "";

    if (unit == null || unit == "auto") {
      if (val < 1000) unit = "m";
      else unit = "km";
    }

    var valstr = "";
    switch (unit) {
      default:
      case "m":
        valstr = val.toFixed(2) + "米";
        break;
      case "km":
        valstr = (val * 0.001).toFixed(2) + "公里";
        break;
      case "mile":
        valstr = (val * 0.00054).toFixed(2) + "海里";
        break;
      case "zhang":
        valstr = (val * 0.3).toFixed(2) + "丈";
        break;
    }
    return valstr;
  }

  return {
    measuerLength: measuerLength,
    measureHeight: measureHeight,
    measureArea: measureArea,
    measureVolume: measureVolume,
    measureSection: measureSection,
    measureAngle: measureAngle,
    updateUnit: updateUnit,
    clearMeasure: clearMeasure,

    formatArea: formatArea,
    formatLength: formatLength,
  };
} //提供测量长度、面积等 [绘制基于draw]
//标绘控制器，总入口

export function Draw(options) {
  //各实体的控制类 type:类名
  var control = {
    billboard: BillboardControl,
    label: LabelControl,
    ellipse: EllipseControl,
    polyline: PolylineControl,
    polylineVolume: PolylineVolumeControl,
    polygon: PolygonControl,

    ellipsoid: EllipsoidControl,
    wall: WallControl,
    point: PointControl,
    rectangle: RectangleControl,
    model: ModelControl,
  };
  let viewer = options.viewer;
  // var scene = viewer.scene;
  var dragIcon = options.dragIcon;
  if (Cesium.defaultValue(options.removeScreenSpaceEvent, true)) {
    viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
  }

  var dataSource = new Cesium.CustomDataSource();
  viewer.dataSources.add(dataSource);

  var currentEntity = null;
  var arrEntity = [];

  var eventCortol = new EventControl(viewer);

  //是否可以编辑
  var _hasEdit;

  function hasEdit(val) {
    if (_hasEdit != null && _hasEdit == val) return;

    _hasEdit = val;
    if (val) {
      //初始化编辑相关事件
      eventCortol.createEditSelectHandler(function (pickedEntity) {
        if (currentEntity && currentEntity.inProgress)
          //正在绘制中entity跳出
          return;

        if (pickedEntity == null) {
          stopDraw();
          if (
            options.onStopEditing &&
            typeof options.onStopEditing == "function"
          ) {
            options.onStopEditing(null);
          }
          return;
        }

        if (pickedEntity === currentEntity)
          //单击了当前entity跳出
          return;

        if (currentEntity && currentEntity.stopEditing) {
          currentEntity.stopEditing();
          currentEntity = null;
        }
        currentEntity = pickedEntity;
        if (currentEntity && currentEntity.startEditing) {
          currentEntity.startEditing();
        }
      });
      eventCortol.createEditDraggerHandler();
    } else {
      stopDraw();
      eventCortol.destroyEditHandler();
    }
  }
  hasEdit(options.hasEdit);

  //开始绘制
  function startDraw(attribute) {
    // console.log(attribute,'开始绘制')
    stopDraw();
    if (attribute == null || attribute.type == null) {
      throw "请传入需要绘制的类型参数";
      return;
    }

    var type = attribute.type;
    if (control[type] == null) {
      throw "传入的[" + type + "]类型参数有误";
      return;
    }

    var drawOkCalback = attribute.success;
    if (attribute.success) delete attribute.success;

    attribute.style = attribute.style || {};
    attribute.attr = attribute.attr || {};

    //赋默认值
    attribute = addPropertiesDefVal(attribute);
    // console.log(control[type])
    var entity = control[type].startDraw(dataSource, attribute);
    // return;

    switch (type) {
      case "label":
      case "point":
      case "billboard":
      case "model":
      case "ellipse":
      case "ellipsoid":
        //点
        eventCortol.createDrawPointHandler(entity, drawOkCalback);
        break;
      case "polyline":
      case "polylineVolume":
        //线
        eventCortol.createDrawPolylineHandler(
          entity,
          control[type].getPositions(entity),
          drawOkCalback
        );
        break;
      case "polygon":
        //面
        eventCortol.createDrawPolygonHandler(
          entity,
          control[type].getPositions(entity),
          drawOkCalback
        );
        break;
      case "rectangle":
      case "extrudedRectangle":
      case "measureHeight":
        //两个点的对象
        eventCortol.createTwoPointsModelHandler(
          entity,
          control[type].getPositions(entity),
          drawOkCalback
        );
        break;
      case "wall":
        //墙
        var ePositions = control[type].getPositions(entity);
        var eMinimumHeights = control[type].getMinimumHeights(entity);
        var eMaximumHeights = control[type].getMaximumHeights(entity);
        eventCortol.createDrawWallHandler(
          entity,
          ePositions,
          eMinimumHeights,
          eMaximumHeights,
          drawOkCalback
        );
        break;
    }
    extendEntity(entity);
    arrEntity.push(entity);

    entity.startDrawing();
    currentEntity = entity;

    return entity;
  }

  //停止编辑
  function stopDraw(noevent) {
    //释放上次未完成的绘制
    eventCortol.destroyDrawHandler();
    if (currentEntity && currentEntity.inProgress) {
      currentEntity.stopDrawing(noevent);
      dataSource.entities.remove(currentEntity);
      removeArrayOne(arrEntity, currentEntity); //arrEntity.remove(currentEntity);
    }

    //释放在编辑的对象
    if (currentEntity && currentEntity.stopEditing) {
      currentEntity.stopEditing(noevent);
      currentEntity = null;
    }
    return this;
  }

  //修改了属性
  function updateAttribute(attribute, entity) {
    // console.log(attribute, entity)
    if (entity != null) currentEntity = entity;

    if (currentEntity == null || attribute == null) return;
    //attribute.minMaxPoints = attribute.minMaxPoints || {};
    attribute.style = attribute.style || {};
    attribute.attr = attribute.attr || {};

    var type = currentEntity.attribute.type;
    control[type].attribute2Entity(attribute, currentEntity[type]);
    if (type == "model")
      control[type].attribute2Model(attribute, currentEntity);
    currentEntity.attribute = attribute;

    if (type == "ellipse" || type == "wall" || type == "rectangle") {
      currentEntity.editor.updateDraggers();
    }

    //名称 绑定到tooltip
    if (options.tooltip) {
      if (currentEntity.attribute.attr && currentEntity.attribute.attr.name) {
        currentEntity.tooltip = {
          html: currentEntity.attribute.attr.name,
          check: function check() {
            return !_hasEdit;
          },
        };
      } else {
        currentEntity.tooltip = null;
      }
    }
    entity.changeEditing();
    return currentEntity;
  }

  //修改坐标、高程
  function updateGeometry(positions, entity) {
    if (entity == null) entity = currentEntity;
    if (entity == null || positions == null) return;
    var type = entity.attribute.type;

    control[type].setPositions(entity, positions);

    if (entity.editor && entity.editor.destroy) {
      //entity.editor.updateDraggers();

      entity.editor.destroy();
      var type = entity.attribute.type;
      entity.editor = control[type].getEditor(dataSource, entity, {
        dragIcon: dragIcon,
      });
    }

    return entity;
  }

  /**
   * 扩展entity实体，绑定一些方法
   */
  function extendEntity(entity) {
    //绘制开始、修改、结束
    entity.startDrawing = function () {
      $(".cesium-viewer").css("cursor", "crosshair");

      var entity = this;
      if (
        options.onStartDrawing &&
        typeof options.onStartDrawing == "function"
      ) {
        options.onStartDrawing(entity);
      }
    };
    entity.changeDrawing = function () {
      var entity = this;
      if (
        options.onChangeDrawing &&
        typeof options.onChangeDrawing == "function"
      ) {
        options.onChangeDrawing(entity);
      }
    };
    entity.moveDrawing = function () {
      var entity = this;
      if (options.onMoveDrawing && typeof options.onMoveDrawing == "function") {
        options.onMoveDrawing(entity);
      }
    };
    entity.stopDrawing = function () {
      $(".cesium-viewer").css("cursor", "");

      var entity = this;
      if (options.onStopDrawing && typeof options.onStopDrawing == "function") {
        options.onStopDrawing(entity);
      }
    };

    //编辑开始、修改、结束
    entity.startEditing = function () {
      if (!_hasEdit) return;
      var entity = this;
      currentEntity = entity;

      //绑定编辑器
      if (entity.editor == null) {
        var type = entity.attribute.type;
        entity.editor = control[type].getEditor(dataSource, entity, {
          dragIcon: dragIcon,
        });
      }

      if (
        options.onStartEditing &&
        typeof options.onStartEditing == "function"
      ) {
        options.onStartEditing(entity);
      }
    };

    entity.stopEditing = function (noevent) {
      var entity = this;

      //释放编辑器
      if (entity.editor) {
        entity.editor.destroy();
        entity.editor = null;
      }

      if (
        !noevent &&
        options.onStopEditing &&
        typeof options.onStopEditing == "function"
      ) {
        options.onStopEditing(entity);
      }
    };

    entity.changeEditing = function () {
      var entity = this;
      if (
        options.onChangeEditing &&
        typeof options.onChangeEditing == "function"
      ) {
        options.onChangeEditing(entity);
      }
    };

    entity.updatePositions = function (positions) {
      var entity = this;
      var type = entity.attribute.type;
      if (type == "ellipse") {
        if (!entity.attribute.style.clampToGround) {
          var height = Number(
            Cesium.Cartographic.fromCartesian(positions).height.toFixed(2)
          );
          entity.attribute.style.height = height;

          if (entity.ellipse.height) entity.ellipse.height.setValue(height);
          else entity.ellipse.height = height;

          if (entity.attribute.style.extrudedHeight) {
            var extrudedHeight =
              height + Number(entity.attribute.style.extrudedHeight);
            entity.ellipse.extrudedHeight.setValue(extrudedHeight);
          }
        }
      }
      control[type].setPositions(currentEntity, positions);
    };
  }

  //删除单个
  function deleteEntity(entity) {
    if (entity == null) return;
    entity.stopEditing(true);

    removeArrayOne(arrEntity, entity); //arrEntity.remove(entity);

    dataSource.entities.remove(entity);
  }

  //删除当前entity
  function deleteCurrentEntity() {
    if (currentEntity) {
      currentEntity.stopEditing(true);
      removeArrayOne(arrEntity, currentEntity); //arrEntity.remove(currentEntity);
      dataSource.entities.remove(currentEntity);
      currentEntity = null;
    }
  }

  //删除所有
  function deleteAll() {
    stopDraw();

    dataSource.entities.removeAll();
    arrEntity = [];
  }

  function setVisible(visible) {
    //if(visible)
    //    viewer.dataSources.add(dataSource);
    //else
    //    viewer.dataSources.remove(dataSource,false);

    $(arrEntity).each(function (i, item) {
      if (visible) {
        if (!dataSource.entities.contains(item)) dataSource.entities.add(item);
      } else {
        if (dataSource.entities.contains(item))
          dataSource.entities.remove(item);
      }
    });
  }

  //获取实体的经纬度值 坐标数组
  function getCoordinates(entity) {
    var type = entity.attribute.type;
    var positions = control[type].getCoordinates(entity);
    return positions;
  }

  //获取实体的坐标数组
  function getPositions(entity) {
    var type = entity.attribute.type;
    var positions = control[type].getPositions(entity);
    return positions;
  }

  function setPositions(entity, positions) {
    var type = entity.attribute.type;
    var positions = control[type].setPositions(entity, positions);
  }

  //是否存在绘制
  function hasDraw() {
    return arrEntity.length > 0;
  }

  //获取所有绘制的实体对象列表
  function getEntitys() {
    return arrEntity;
  }

  function getDataSource() {
    return dataSource;
  }

  function getEntityById(id) {
    for (var i = 0; i < arrEntity.length; i++) {
      var entity = arrEntity[i];
      if (id == entity.attribute.attr.id) {
        return entity;
      }
    }
    return null;
  }

  function getCurrentEntity() {
    return currentEntity;
  }

  //从plot的 标号默认值F12打印 拷贝，方便读取
  var configDefval = {
    label: {
      edittype: "label",
      name: "文字",
      style: {
        text: "文字",
        color: "#ffffff",
        opacity: 1,
        font_family: "楷体",
        font_size: 30,
        border: true,
        border_color: "#000000",
        border_width: 3,
        background: false,
        background_color: "#000000",
        background_opacity: 0.5,
        font_weight: "normal",
        font_style: "normal",
        scaleByDistance: false,
        scaleByDistance_far: 1000000,
        scaleByDistance_farValue: 0.1,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        distanceDisplayCondition: false,
        distanceDisplayCondition_far: 10000,
        distanceDisplayCondition_near: 0,
      },
      attr: { id: "", name: "", remark: "" },
    },
    point: {
      edittype: "point",
      name: "点标记",
      style: {
        pixelSize: 10,
        color: "#3388ff",
        opacity: 1,
        outline: true,
        outlineColor: "#ffffff",
        outlineOpacity: 0.6,
        outlineWidth: 2,
        scaleByDistance: false,
        scaleByDistance_far: 1000000,
        scaleByDistance_farValue: 0.1,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        distanceDisplayCondition: false,
        distanceDisplayCondition_far: 10000,
        distanceDisplayCondition_near: 0,
      },
      attr: { id: "", name: "", remark: "" },
    },
    imagepoint: {
      edittype: "imagepoint",
      name: "图标点标记",
      style: {
        image: "",
        opacity: 1,
        scale: 1,
        rotation: 0,
        scaleByDistance: false,
        scaleByDistance_far: 1000000,
        scaleByDistance_farValue: 0.1,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        distanceDisplayCondition: false,
        distanceDisplayCondition_far: 10000,
        distanceDisplayCondition_near: 0,
      },
      attr: { id: "", name: "", remark: "" },
    },
    model: {
      edittype: "model",
      name: "模型",
      style: {
        modelUrl: "",
        scale: 1,
        heading: 0,
        pitch: 0,
        roll: 0,
        fill: false,
        color: "#3388ff",
        opacity: 1,
        silhouette: false,
        silhouetteColor: "#ffffff",
        silhouetteSize: 2,
        silhouetteAlpha: 0.8,
      },
      attr: { id: "", name: "", remark: "" },
    },
    polyline: {
      edittype: "polyline",
      name: "线",
      position: { minCount: 2 },
      style: {
        lineType: "solid",
        color: "#3388ff",
        width: 4,
        clampToGround: false,
        outline: false,
        outlineColor: "#ffffff",
        outlineWidth: 2,
        opacity: 1,
        zIndex: 0,
      },
      attr: { id: "", name: "", remark: "" },
    },
    polylineVolume: {
      edittype: "polylineVolume",
      name: "管道线",
      position: { height: true, minCount: 2 },
      style: {
        color: "#00FF00",
        radius: 10,
        shape: "pipeline",
        outline: false,
        outlineColor: "#ffffff",
        opacity: 1,
      },
      attr: { id: "", name: "", remark: "" },
    },
    polygon: {
      edittype: "polygon",
      name: "面",
      position: { height: true, minCount: 3 },
      style: {
        fill: true,
        color: "#3388ff",
        opacity: 0.6,
        outline: true,
        outlineWidth: 1,
        outlineColor: "#ffffff",
        outlineOpacity: 0.6,
        clampToGround: false,
        zIndex: 0,
      },
      attr: { id: "", name: "", remark: "" },
    },
    polygon_clampToGround: {
      edittype: "polygon_clampToGround",
      name: "贴地面",
      position: { height: false, minCount: 3 },
      style: { color: "#ffff00", opacity: 0.6, clampToGround: true, zIndex: 0 },
      attr: { id: "", name: "", remark: "" },
    },
    extrudedPolygon: {
      edittype: "extrudedPolygon",
      name: "拉伸面",
      position: { height: true, minCount: 3 },
      style: {
        fill: true,
        color: "#00FF00",
        opacity: 0.6,
        outline: true,
        outlineWidth: 1,
        outlineColor: "#ffffff",
        outlineOpacity: 0.6,
        extrudedHeight: 100,
        perPositionHeight: true,
        zIndex: 0,
      },
      attr: { id: "", name: "", remark: "" },
    },
    rectangle: {
      edittype: "rectangle",
      name: "矩形",
      position: { height: false, minCount: 2, maxCount: 2 },
      style: {
        height: 0,
        fill: true,
        color: "#3388ff",
        opacity: 0.6,
        outline: true,
        outlineWidth: 1,
        outlineColor: "#ffffff",
        outlineOpacity: 0.6,
        rotation: 0,
        clampToGround: false,
        zIndex: 0,
      },
      attr: { id: "", name: "", remark: "" },
    },
    rectangle_clampToGround: {
      edittype: "rectangle_clampToGround",
      name: "贴地矩形",
      position: { height: false, minCount: 2, maxCount: 2 },
      style: {
        color: "#ffff00",
        opacity: 0.6,
        rotation: 0,
        clampToGround: true,
        zIndex: 0,
      },
      attr: { id: "", name: "", remark: "" },
    },
    rectangleImg: {
      edittype: "rectangleImg",
      name: "贴地图片",
      position: { height: false, minCount: 2, maxCount: 2 },
      style: {
        image: "",
        opacity: 1,
        rotation: 0,
        clampToGround: true,
        zIndex: 0,
      },
      attr: { id: "", name: "", remark: "" },
    },
    extrudedRectangle: {
      edittype: "extrudedRectangle",
      name: "拉伸矩形",
      position: { height: false, minCount: 2, maxCount: 2 },
      style: {
        extrudedHeight: 40,
        height: 0,
        fill: true,
        color: "#00FF00",
        opacity: 0.6,
        outline: true,
        outlineWidth: 1,
        outlineColor: "#ffffff",
        outlineOpacity: 0.6,
        rotation: 0,
        zIndex: 0,
      },
      attr: { id: "", name: "", remark: "" },
    },
    ellipse: {
      edittype: "ellipse",
      name: "椭圆",
      position: { height: false },
      style: {
        semiMinorAxis: 200,
        semiMajorAxis: 200,
        height: 0,
        fill: true,
        color: "#3388ff",
        opacity: 0.6,
        outline: true,
        outlineWidth: 1,
        outlineColor: "#ffffff",
        outlineOpacity: 0.6,
        rotation: 0,
        clampToGround: false,
        zIndex: 0,
      },
      attr: { id: "", name: "", remark: "" },
    },
    ellipse_clampToGround: {
      edittype: "ellipse_clampToGround",
      name: "椭圆",
      position: { height: false },
      style: {
        semiMinorAxis: 200,
        semiMajorAxis: 200,
        color: "#ffff00",
        opacity: 0.6,
        rotation: 0,
        clampToGround: true,
        zIndex: 0,
      },
      attr: { id: "", name: "", remark: "" },
    },
    extrudedEllipse: {
      edittype: "extrudedEllipse",
      name: "圆柱体",
      position: { height: false },
      style: {
        semiMinorAxis: 200,
        semiMajorAxis: 200,
        extrudedHeight: 200,
        height: 0,
        fill: true,
        color: "#00FF00",
        opacity: 0.6,
        outline: true,
        outlineWidth: 1,
        outlineColor: "#ffffff",
        outlineOpacity: 0.6,
        rotation: 0,
        zIndex: 0,
      },
      attr: { id: "", name: "", remark: "" },
    },
    ellipsoid: {
      edittype: "ellipsoid",
      name: "球体",
      style: {
        extentRadii: 200,
        widthRadii: 200,
        heightRadii: 200,
        fill: true,
        color: "#00FF00",
        opacity: 0.6,
        outline: true,
        outlineWidth: 1,
        outlineColor: "#ffffff",
        outlineOpacity: 0.6,
      },
      attr: { id: "", name: "", remark: "" },
    },
    wall: {
      edittype: "wall",
      name: "墙体",
      position: { height: true, minCount: 2 },
      style: {
        extrudedHeight: 40,
        fill: true,
        color: "#00FF00",
        opacity: 0.6,
        outline: true,
        outlineWidth: 1,
        outlineColor: "#ffffff",
        outlineOpacity: 0.6,
      },
      attr: { id: "", name: "", remark: "" },
    },
  };

  //剔除与默认值相同的值
  function removeGeoJsonDefVal(geojson) {
    if (!geojson.properties || !geojson.properties.type) return geojson;

    var type = geojson.properties.edittype || geojson.properties.type;
    var def = configDefval[type];
    if (!def) return geojson;

    var newgeojson = util.clone(geojson);
    if (geojson.properties.style) {
      var newstyle = {};
      for (var i in geojson.properties.style) {
        var val = geojson.properties.style[i];
        if (val == null) continue;

        var valDef = def.style[i];
        if (valDef === val) continue;
        newstyle[i] = val;
      }
      newgeojson.properties.style = newstyle;
    }

    if (geojson.properties.attr) {
      var newattr = {};
      for (var i in geojson.properties.attr) {
        var val = geojson.properties.attr[i];
        if (val == null) continue;

        var valDef = def.attr[i];
        if (valDef === val) continue;

        newattr[i] = val;
      }
      newgeojson.properties.attr = newattr;
    }

    return newgeojson;
  }

  function addPropertiesDefVal(properties) {
    //赋默认值
    var def = configDefval[properties.edittype || properties.type];
    if (def) {
      properties.style = properties.style || {};
      for (var key in def.style) {
        var val = properties.style[key];
        if (val != null) continue;

        properties.style[key] = def.style[key];
      }

      properties.attr = properties.attr || {};
      for (var key in def.attr) {
        var val = properties.attr[key];
        if (val != null) continue;

        properties.attr[key] = def.attr[key];
      }
    }
    return properties;
  }

  //转换当前所有为geojson
  function toGeoJSON(entity) {
    if (entity == null) {
      //全部数据
      if (arrEntity.length == 0) return null;
      var features = [];
      for (var i = 0; i < arrEntity.length; i++) {
        var entity = arrEntity[i];

        var type = entity.attribute.type;
        let geojson = control[type].toGeoJSON(entity);
        geojson = removeGeoJsonDefVal(geojson);

        features.push(geojson);
      }
      var geojson = {
        type: "FeatureCollection",
        features: features,
      };
      return geojson;
    } else {
      var type = entity.attribute.type;
      var geojson = control[type].toGeoJSON(entity);
      geojson = removeGeoJsonDefVal(geojson);
      return geojson;
    }
  }

  /**
   * 加载goejson数据
   * @param {Object} json geojson字符串
   * @param {Object} isClear 是否清空已有的模型
   */
  function jsonToEntityHD(json, isClear, isFly) {
    var jsonObjs = json;
    try {
      if (util.isString(json)) jsonObjs = JSON.parse(json);
    } catch (e) {
      util.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
      return;
    }

    if (isClear) {
      deleteAll();
    }
    var arrthis = [];

    if (!jsonObjs.properties || !jsonObjs.properties.type) {
      //非本身保存的外部其他geojson数据
      jsonObjs.properties = jsonObjs.properties || {};
      switch (jsonObjs.geometry.type) {
        case "MultiPolygon":
        case "Polygon":
          jsonObjs.properties.type = "polygon";
          break;
        case "MultiLineString":
        case "LineString":
          jsonObjs.properties.type = "polyline";
          break;
        case "MultiPoint":
        case "Point":
          jsonObjs.properties.type = "point";
          break;
      }
    }

    var type = jsonObjs.properties.type;
    if (control[type] == null) {
      throw "数据无法识别或者数据的[" + type + "]类型参数有误";
      return;
    }
    jsonObjs.properties.style = jsonObjs.properties.style || {};

    //赋默认值
    jsonObjs.properties = addPropertiesDefVal(jsonObjs.properties);
    // console.log(viewer)
    // viewer.dataSources.add(jsonObjs.properties)
    var entity = control[type].startDraw(dataSource, jsonObjs.properties);

    var positions = drawutils.getPositionsFromJson(jsonObjs.geometry);
    control[type].setPositions(entity, positions);
    extendEntity(entity);

    //名称 绑定到tooltip
    if (options.tooltip) {
      if (entity.attribute.attr && entity.attribute.attr.name) {
        entity.tooltip = entity.attribute.attr.name;
      } else {
        entity.tooltip = null;
      }
    }

    arrEntity.push(entity);
    arrthis.push(entity);
    // console.log(arrthis,isFly)

    if (isFly) viewer.flyTo(arrthis);

    return arrthis;
  }
  function jsonToEntity(json, isClear, isFly) {
    var jsonObjs = json;
    try {
      if (util.isString(json)) jsonObjs = JSON.parse(json);
    } catch (e) {
      util.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
      return;
    }

    if (isClear) {
      deleteAll();
    }
    var arrthis = [];
    var jsonFeatures = jsonObjs.features;
    for (var i = 0; i < jsonFeatures.length; i++) {
      var feature = jsonFeatures[i];

      if (!feature.properties || !feature.properties.type) {
        //非本身保存的外部其他geojson数据
        feature.properties = feature.properties || {};
        switch (feature.geometry.type) {
          case "MultiPolygon":
          case "Polygon":
            feature.properties.type = "polygon";
            break;
          case "MultiLineString":
          case "LineString":
            feature.properties.type = "polyline";
            break;
          case "MultiPoint":
          case "Point":
            feature.properties.type = "point";
            break;
        }
      }

      var type = feature.properties.type;
      if (control[type] == null) {
        throw "数据无法识别或者数据的[" + type + "]类型参数有误";
        return;
      }
      feature.properties.style = feature.properties.style || {};

      //赋默认值
      feature.properties = addPropertiesDefVal(feature.properties);
      // console.log(viewer)
      // viewer.dataSources.add(feature.properties)
      var entity = control[type].startDraw(dataSource, feature.properties);

      var positions = drawutils.getPositionsFromJson(feature.geometry);
      control[type].setPositions(entity, positions);
      extendEntity(entity);

      //名称 绑定到tooltip
      if (options.tooltip) {
        if (entity.attribute.attr && entity.attribute.attr.name) {
          entity.tooltip = entity.attribute.attr.name;
        } else {
          entity.tooltip = null;
        }
      }

      arrEntity.push(entity);
      arrthis.push(entity);
    }
    // console.log(arrthis,isFly)

    if (isFly) viewer.flyTo(arrthis);

    return arrthis;
  }

  /**
   * 加载标记信息json文件，一数组的字符串Array<Object>，
   * @param {Object} json Arrray<Object> Object {id:"abcd",name:"abcd",x:"117.22",y:"31.22"}
   * @param {Object} style Object 标记的样式
   * @param {Object} isClear boolean 是否清空已有模型
   */
  function markersInfoToEntity(json, style, isClear) {
    var arr = json;
    try {
      if (util.isString(json)) arr = JSON.parse(json);
    } catch (e) {
      util.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
      return;
    }

    if (!(arr instanceof Array)) {
      util.alert("请确认json文件格式正确!!!");
      return;
    }
    if (isClear) {
      deleteAll();
    }

    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (!item.x || !item.y) {
        util.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
        return;
      }
      var attr = {
        id: item.id || item.ID || "",
        name: item.name || item.NAME || "",
        remark: item.remark || item.REMA || "",
      };
      var attribute = {
        type: style.type || "billboard",
        attr: attr,
        style: style.style,
      };

      var markerPosition = Cesium.Cartesian3.fromDegrees(
        item.x,
        item.y,
        item.z || 0.0
      );
      var entity = control[attribute.type].startDraw(dataSource, attribute);
      control[attribute.type].setPositions(entity, markerPosition);
      extendEntity(entity);
      arrEntity.push(entity);
    }

    return arrEntity;
  }

  //删除数组的1个
  function removeArrayOne(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  }

  return {
    startDraw: startDraw,
    stopDraw: stopDraw,
    updateAttribute: updateAttribute,
    updateGeometry: updateGeometry,
    toGeoJSON: toGeoJSON,
    jsonToEntity: jsonToEntity,
    jsonToEntityHD: jsonToEntityHD,
    markersInfoToEntity: markersInfoToEntity,
    deleteEntity: deleteEntity,
    deleteCurrentEntity: deleteCurrentEntity,
    deleteAll: deleteAll,
    setVisible: setVisible,
    hasDraw: hasDraw,
    hasEdit: hasEdit,
    getEntitys: getEntitys,
    getDataSource: getDataSource,
    getEntityById: getEntityById,
    getCurrentEntity: getCurrentEntity,
    getCoordinates: getCoordinates,
    getPositions: getPositions,
    setPositions: setPositions,
  };
}
var BillboardControl = {
  typename: "billboard",
  startDraw: function startDraw(dataSource, attribute) {
    var entityattr = this.attribute2Entity(attribute);

    var entity = dataSource.entities.add({
      billboard: entityattr,
      attribute: attribute,
    });

    return entity;
  },
  attribute2Entity: function attribute2Entity(attribute, entityattr) {
    attribute = attribute || {};
    attribute.style = attribute.style || {};

    if (entityattr == null) {
      //默认值
      entityattr = {
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      };
    }

    //Style赋值值Entity
    for (var key in attribute.style) {
      var value = attribute.style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "scaleByDistance_near": //跳过扩展其他属性的参数
        case "scaleByDistance_nearValue":
        case "scaleByDistance_far":
        case "scaleByDistance_farValue":
        case "distanceDisplayCondition_far":
        case "distanceDisplayCondition_near":
          break;
        case "opacity":
          //透明度
          entityattr.color = new Cesium.Color.fromCssColorString(
            "#FFFFFF"
          ).withAlpha(Number(value || 1.0));
          break;
        case "rotation":
          //旋转角度
          entityattr.rotation = Cesium.Math.toRadians(value);
          break;
        case "scaleByDistance":
          //是否按视距缩放
          if (value) {
            entityattr.scaleByDistance = new Cesium.NearFarScalar(
              Number(attribute.style.scaleByDistance_near || 1000),
              Number(attribute.style.scaleByDistance_nearValue || 1.0),
              Number(attribute.style.scaleByDistance_far || 1000000),
              Number(attribute.style.scaleByDistance_farValue || 0.1)
            );
          } else {
            entityattr.scaleByDistance = null;
          }
          break;
        case "distanceDisplayCondition":
          //是否按视距显示
          if (value) {
            entityattr.distanceDisplayCondition =
              new Cesium.DistanceDisplayCondition(
                Number(attribute.style.distanceDisplayCondition_near || 0),
                Number(attribute.style.distanceDisplayCondition_far || 100000)
              );
          } else {
            entityattr.distanceDisplayCondition = null;
          }
          break;
      }
    }

    return entityattr;
  },
  getEditor: function getEditor(dataSource, entity, options) {
    return new PointEditor(dataSource, entity, options);
  },
  setPositions: function setPositions(entity, position) {
    entity.position = new DynamicProperty(position);
  },
  getPositions: function getPositions(entity) {
    return [entity.position.getValue()];
  },
  getCoordinates: function getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = drawutils.getCoordinates(positions);
    return coordinates;
  },
  toGeoJSON: function toGeoJSON(entity) {
    var coordinates = this.getCoordinates(entity);

    return {
      type: "Feature",
      properties: entity.attribute,
      geometry: { type: "Point", coordinates: coordinates[0] },
    };
  },
};
var LabelControl = {
  typename: "label",
  startDraw: function startDraw(dataSource, attribute) {
    var entityattr = this.attribute2Entity(attribute);

    var entity = dataSource.entities.add({
      label: entityattr,
      attribute: attribute,
    });

    return entity;
  },
  attribute2Entity: function attribute2Entity(attribute, entityattr) {
    attribute = attribute || {};
    attribute.style = attribute.style || {};
    if (entityattr == null) {
      //默认值
      entityattr = {
        scale: 1.0,
        //disableDepthTestDistance:Number.POSITIVE_INFINITY,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      };
    }

    //Style赋值值Entity
    for (var key in attribute.style) {
      var value = attribute.style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "font_style": //跳过扩展其他属性的参数
        case "font_weight":
        case "font_size":
        case "font_family":
        case "text":
        case "scaleByDistance_near":
        case "scaleByDistance_nearValue":
        case "scaleByDistance_far":
        case "scaleByDistance_farValue":
        case "distanceDisplayCondition_far":
        case "distanceDisplayCondition_near":
        case "background_opacity":
        case "pixelOffsetY":
          break;
        case "color":
          //颜色
          entityattr.fillColor = new Cesium.Color.fromCssColorString(
            value || "#ffffff"
          ).withAlpha(Number(attribute.style.opacity || 1.0));
          break;

        case "border":
          //是否衬色
          entityattr.style = value
            ? Cesium.LabelStyle.FILL_AND_OUTLINE
            : Cesium.LabelStyle.FILL;
          break;
        case "border_color":
          //衬色
          entityattr.outlineColor = new Cesium.Color.fromCssColorString(
            value || "#000000"
          ).withAlpha(Number(attribute.style.opacity || 1.0));
          break;
        case "border_width":
          entityattr.outlineWidth = value;
          break;
        case "background":
          //是否背景色
          entityattr.showBackground = value;
          break;
        case "background_color":
          //背景色
          entityattr.backgroundColor = new Cesium.Color.fromCssColorString(
            value || "#000000"
          ).withAlpha(
            Number(
              attribute.style.background_opacity ||
                attribute.style.opacity ||
                0.5
            )
          );
          break;
        case "pixelOffset":
          //偏移量
          entityattr.pixelOffset = new Cesium.Cartesian2(
            attribute.style.pixelOffset[0],
            attribute.style.pixelOffset[1]
          );
          break;
        case "hasPixelOffset":
          //是否存在偏移量
          if (!value) entityattr.pixelOffset = new Cesium.Cartesian2(0, 0);
          break;
        case "pixelOffsetX":
          //偏移量
          entityattr.pixelOffset = new Cesium.Cartesian2(
            value,
            attribute.style.pixelOffsetY
          );
          break;
        case "scaleByDistance":
          //是否按视距缩放
          if (value) {
            entityattr.scaleByDistance = new Cesium.NearFarScalar(
              Number(attribute.style.scaleByDistance_near || 1000),
              Number(attribute.style.scaleByDistance_nearValue || 1.0),
              Number(attribute.style.scaleByDistance_far || 1000000),
              Number(attribute.style.scaleByDistance_farValue || 0.1)
            );
          } else {
            entityattr.scaleByDistance = null;
          }
          break;
        case "distanceDisplayCondition":
          //是否按视距显示
          if (value) {
            entityattr.distanceDisplayCondition =
              new Cesium.DistanceDisplayCondition(
                Number(attribute.style.distanceDisplayCondition_near || 0),
                Number(attribute.style.distanceDisplayCondition_far || 100000)
              );
          } else {
            entityattr.distanceDisplayCondition = null;
          }
          break;
      }
    }

    //文字内容
    entityattr.text = (attribute.style.text || "文字").replace(
      new RegExp("<br />", "gm"),
      "\n"
    );

    //样式（倾斜、加粗等）
    var fontStyle =
      (attribute.style.font_style || "normal") +
      " small-caps " +
      (attribute.style.font_weight || "normal") +
      " " +
      (attribute.style.font_size || "25") +
      "px " +
      (attribute.style.font_family || "楷体");
    entityattr.font = fontStyle;

    return entityattr;
  },
  getEditor: function getEditor(dataSource, entity, options) {
    return new PointEditor(dataSource, entity, options);
  },
  setPositions: function setPositions(entity, position) {
    entity.position = new DynamicProperty(position);
  },
  getPositions: function getPositions(entity) {
    return [entity.position.getValue()];
  },
  getCoordinates: function getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = drawutils.getCoordinates(positions);
    return coordinates;
  },
  toGeoJSON: function toGeoJSON(entity) {
    var coordinates = this.getCoordinates(entity);

    return {
      type: "Feature",
      properties: entity.attribute,
      geometry: {
        type: "Point",
        coordinates: coordinates[0],
      },
    };
  },
};
var EllipseControl = {
  typename: "ellipse",
  startDraw: function startDraw(dataSource, attribute) {
    var entityattr = this.attribute2Entity(attribute);

    var entity = dataSource.entities.add({
      ellipse: entityattr,
      attribute: attribute,
    });

    return entity;
  },
  attribute2Entity: function attribute2Entity(attribute, entityattr) {
    attribute = attribute || {};
    attribute.style = attribute.style || {};
    if (entityattr == null) {
      //默认值
      entityattr = {
        fill: true,
      };
    }

    //贴地时，剔除高度相关属性
    if (attribute.style.clampToGround) {
      if (attribute.style.hasOwnProperty("height"))
        delete attribute.style.height;
      if (attribute.style.hasOwnProperty("extrudedHeight"))
        delete attribute.style.extrudedHeight;
    }

    //Style赋值值Entity
    for (var key in attribute.style) {
      var value = attribute.style[key];

      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
          break;
        case "outlineColor":
          //边框颜色
          entityattr.outlineColor = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(
            attribute.style.outlineOpacity || attribute.style.opacity || 1.0
          );
          break;
        case "color":
          //填充颜色
          entityattr.material = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(attribute.style.opacity || 1.0));
          break;
        case "rotation":
          //旋转角度
          entityattr.rotation = Cesium.Math.toRadians(value);
          break;
        case "height":
          entityattr.height = Number(value);
          if (attribute.style.extrudedHeight)
            entityattr.extrudedHeight =
              Number(attribute.style.extrudedHeight) + Number(value);
          break;
        case "extrudedHeight":
          entityattr.extrudedHeight =
            Number(entityattr.height || attribute.style.height || 0) +
            Number(value);
          break;
        case "radius":
          //半径
          entityattr.semiMinorAxis = Number(value);
          entityattr.semiMajorAxis = Number(value);
          console.log("半径");
          break;
      }
    }

    return entityattr;
  },
  getEditor: function getEditor(dataSource, entity, options) {
    return new EllipseEditor(dataSource, entity, options);
  },
  setPositions: function setPositions(entity, position) {
    entity.position = new DynamicProperty(position);
  },
  getPositions: function getPositions(entity) {
    return [entity.position.getValue()];
  },
  getCoordinates: function getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = drawutils.getCoordinates(positions);
    return coordinates;
  },
  toGeoJSON: function toGeoJSON(entity) {
    var coordinates = this.getCoordinates(entity);

    return {
      type: "Feature",
      properties: entity.attribute,
      geometry: { type: "Point", coordinates: coordinates[0] },
    };
  },
};
var PolylineControl = {
  typename: "polyline",
  startDraw: function startDraw(dataSource, attribute) {
    var entityattr = this.attribute2Entity(attribute);

    var entity = dataSource.entities.add({
      polyline: entityattr,
      attribute: attribute,
      _draw_positions: [],
    });

    entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
      return entity._draw_positions;
    }, false);

    return entity;
  },
  attribute2Entity: function attribute2Entity(attribute, entityattr) {
    attribute = attribute || {};
    attribute.style = attribute.style || {};

    if (entityattr == null) {
      entityattr = {
        followSurface: true,
      };
    }

    //Style赋值值Entity
    for (var key in attribute.style) {
      var value = attribute.style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "lineType": //跳过扩展其他属性的参数
        case "color":
        case "opacity":
        case "outline":
        case "outlineWidth":
        case "outlineColor":
        case "outlineOpacity":
          break;
      }
    }

    var color = new Cesium.Color.fromCssColorString(
      attribute.style.color || "#FFFF00"
    ).withAlpha(Number(attribute.style.opacity || 1.0));

    switch (attribute.style.lineType) {
      default:
      case "solid":
        //实线
        if (attribute.style.outline) {
          //存在衬色时
          entityattr.material = new Cesium.PolylineOutlineMaterialProperty({
            color: color,
            outlineWidth: Number(attribute.style.outlineWidth || 1.0),
            outlineColor: new Cesium.Color.fromCssColorString(
              attribute.style.outlineColor || "#FFFF00"
            ).withAlpha(
              Number(
                attribute.style.outlineOpacity || attribute.style.opacity || 1.0
              )
            ),
          });
        } else {
          entityattr.material = color;
        }
        break;
      case "dash":
        //虚线
        if (attribute.style.outline) {
          //存在衬色时
          entityattr.material = new Cesium.PolylineDashMaterialProperty({
            dashLength:
              attribute.style.dashLength ||
              attribute.style.outlineWidth ||
              16.0,
            color: color,
            gapColor: new Cesium.Color.fromCssColorString(
              attribute.style.outlineColor || "#FFFF00"
            ).withAlpha(
              Number(
                attribute.style.outlineOpacity || attribute.style.opacity || 1.0
              )
            ),
          });
        } else {
          entityattr.material = new Cesium.PolylineDashMaterialProperty({
            dashLength: attribute.style.dashLength || 16.0,
            color: color,
          });
        }

        break;
      case "glow":
        //发光线
        entityattr.material = new Cesium.PolylineGlowMaterialProperty({
          glowPower: attribute.style.glowPower || 0.1,
          color: color,
        });
        break;
      case "arrow":
        //箭头线
        entityattr.material = new Cesium.PolylineArrowMaterialProperty(color);
        break;
    }

    return entityattr;
  },
  getEditor: function getEditor(dataSource, entity, options) {
    return new PolylineEditor(dataSource, entity, options);
  },
  setPositions: function setPositions(entity, positions) {
    entity._draw_positions = positions;
  },
  getPositions: function getPositions(entity) {
    return entity._draw_positions || entity.polyline.positions.getValue();
  },
  getCoordinates: function getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = drawutils.getCoordinates(positions);
    return coordinates;
  },
  toGeoJSON: function toGeoJSON(entity) {
    var coordinates = this.getCoordinates(entity);

    return {
      type: "Feature",
      properties: entity.attribute,
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    };
  },
};
var PolylineVolumeControl = {
  typename: "polylineVolume",
  startDraw: function startDraw(dataSource, attribute) {
    var entityattr = this.attribute2Entity(attribute);

    var entity = dataSource.entities.add({
      polylineVolume: entityattr,
      attribute: attribute,
      _draw_positions: [],
    });
    entity.polylineVolume.positions = new Cesium.CallbackProperty(function (
      time
    ) {
      var newarr = [];
      for (var i = 0; i < entity._draw_positions.length; i++) {
        newarr.push(entity._draw_positions[i].clone());
      }
      return newarr; //entity._draw_positions
    },
    false);

    return entity;
  },
  attribute2Entity: function attribute2Entity(attribute, entityattr) {
    attribute = attribute || {};
    attribute.style = attribute.style || {};
    if (entityattr == null) {
      entityattr = {
        //positions: new DynamicProperty([])
        //positions: new Cesium.ConstantProperty([])
      };
    }

    //Style赋值值Entity
    for (var key in attribute.style) {
      var value = attribute.style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
        case "radius":
        case "shape":
          break;
        case "outlineColor":
          //边框颜色
          entityattr.outlineColor = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(
            attribute.style.outlineOpacity || attribute.style.opacity || 1.0
          );
          break;
        case "color":
          //填充颜色
          entityattr.material = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(attribute.style.opacity || 1.0));
          break;
      }
    }

    //管道样式
    attribute.style.radius = attribute.style.radius || 10;
    switch (attribute.style.shape) {
      default:
      case "pipeline":
        entityattr.shape = this._getCorridorShape1(attribute.style.radius); //（厚度固定为半径的1/3）
        break;
      case "circle":
        entityattr.shape = this._getCorridorShape2(attribute.style.radius);
        break;
      case "star":
        entityattr.shape = this._getCorridorShape3(attribute.style.radius);
        break;
    }

    return entityattr;
  },
  //管道形状1【内空管道】 radius整个管道的外半径
  _getCorridorShape1: function _getCorridorShape1(radius) {
    var hd = radius / 3;
    var startAngle = 0;
    var endAngle = 360;

    var pss = [];
    for (var i = startAngle; i <= endAngle; i++) {
      var radians = Cesium.Math.toRadians(i);
      pss.push(
        new Cesium.Cartesian2(
          radius * Math.cos(radians),
          radius * Math.sin(radians)
        )
      );
    }
    for (var i = endAngle; i >= startAngle; i--) {
      var radians = Cesium.Math.toRadians(i);
      pss.push(
        new Cesium.Cartesian2(
          (radius - hd) * Math.cos(radians),
          (radius - hd) * Math.sin(radians)
        )
      );
    }
    return pss;
  },
  //管道形状2【圆柱体】 radius整个管道的外半径
  _getCorridorShape2: function _getCorridorShape2(radius) {
    var startAngle = 0;
    var endAngle = 360;

    var pss = [];
    for (var i = startAngle; i <= endAngle; i++) {
      var radians = Cesium.Math.toRadians(i);
      pss.push(
        new Cesium.Cartesian2(
          radius * Math.cos(radians),
          radius * Math.sin(radians)
        )
      );
    }
    return pss;
  },
  //管道形状2【星状】 radius整个管道的外半径 ,arms星角的个数（默认6个角）
  _getCorridorShape3: function _getCorridorShape3(radius, arms) {
    var arms = arms || 6;
    var angle = Math.PI / arms;
    var length = 2 * arms;
    var pss = new Array(length);
    for (var i = 0; i < length; i++) {
      var r = i % 2 === 0 ? radius : radius / 3;
      pss[i] = new Cesium.Cartesian2(
        Math.cos(i * angle) * r,
        Math.sin(i * angle) * r
      );
    }
    return pss;
  },
  getEditor: function getEditor(dataSource, entity, options) {
    return new PolylineVolumeEditor(dataSource, entity, options);
  },
  setPositions: function setPositions(entity, positions) {
    //entity.polylineVolume.positions.setValue(positions);
    entity._draw_positions = positions;
  },
  getPositions: function getPositions(entity) {
    return entity._draw_positions || entity.polylineVolume.positions.getValue();
  },
  getCoordinates: function getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = drawutils.getCoordinates(positions);
    return coordinates;
  },
  toGeoJSON: function toGeoJSON(entity) {
    var coordinates = this.getCoordinates(entity);
    return {
      type: "Feature",
      properties: entity.attribute,
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    };
  },
};

var PolygonControl = {
  typename: "polygon",
  startDraw: function startDraw(dataSource, attribute) {
    var entityattr = this.attribute2Entity(attribute);
    var addattr = {
      polygon: entityattr,
      attribute: attribute,
      _draw_positions: [],
    };
    if (!attribute.style.extrudedHeight) {
      //边线特殊处理
      addattr.polyline = {
        clampToGround: attribute.style.clampToGround,
        show: false,
      };
    }
    var entity = dataSource.entities.add(addattr);
    entity.polygon.hierarchy = new Cesium.CallbackProperty(function (time) {
      return new Cesium.PolygonHierarchy(entity._draw_positions);
      // return entity._draw_positions;
    }, false);

    if (entity.polyline) {
      //边线
      entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
        if (!entity.polyline.show.getValue()) return null;

        return entity._draw_positions.concat([entity._draw_positions[0]]);
      }, false);
      entity.polyline.show = new Cesium.CallbackProperty(function (time) {
        return (
          entity.polygon.outline &&
          entity.polygon.outline.getValue() &&
          entity.polygon.outlineWidth &&
          entity.polygon.outlineWidth.getValue() > 1
        );
      }, false);
      entity.polyline.width = new Cesium.CallbackProperty(function (time) {
        return entity.polygon.outlineWidth;
      }, false);
      entity.polyline.color = new Cesium.CallbackProperty(function (time) {
        return entity.polygon.outlineColor;
      }, false);
    }

    return entity;
  },
  attribute2Entity: function attribute2Entity(attribute, entityattr) {
    attribute = attribute || {};
    attribute.style = attribute.style || {};
    if (entityattr == null) {
      entityattr = {
        fill: true,
        classificationType: Cesium.ClassificationType.BOTH,
      };
    }

    //Style赋值值Entity
    for (var key in attribute.style) {
      var value = attribute.style[key];
      // console.log(value,key,'123123')
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
          break;
        case "outlineColor":
          //边框颜色
          entityattr.outlineColor = new Cesium.Color.fromCssColorString(
            value || attribute.style.color || "#FFFF00"
          ).withAlpha(
            attribute.style.outlineOpacity || attribute.style.opacity || 1.0
          );
          break;
        case "color":
          //填充颜色
          entityattr.material = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(attribute.style.opacity || 1.0));
          break;
        case "extrudedHeight":
          //高度
          var maxHight = 0;
          if (entityattr.hierarchy)
            maxHight = drawutils.getMaxHeightForPositions(
              entityattr.hierarchy.getValue()
            );
          entityattr.extrudedHeight = Number(value) + maxHight;
          break;
        case "clampToGround":
          //贴地
          entityattr.perPositionHeight = !value;
          break;
      }
    }

    //如果未设置任何material，默认设置随机颜色
    if (attribute.style.color == null) {
      entityattr.material = Cesium.Color.fromRandom({
        minimumGreen: 0.75,
        maximumBlue: 0.75,
        alpha: Number(attribute.style.opacity || 1.0),
      });
    }

    return entityattr;
  },
  getEditor: function getEditor(dataSource, entity, options) {
    if (entity.polygon.extrudedHeight) {
      return new PolygonExtrudedEditor(dataSource, entity, options);
    } else {
      return new PolygonEditor(dataSource, entity, options);
    }
  },
  setPositions: function setPositions(entity, position) {
    entity._draw_positions = position;

    //存在extrudedHeight高度设置时
    if (entity.attribute.style.extrudedHeight) {
      var maxHight = drawutils.getMaxHeightForPositions(position);
      entity.polygon.extrudedHeight =
        maxHight + Number(entity.attribute.style.extrudedHeight);
    }
  },
  getPositions: function getPositions(entity) {
    if (entity._draw_positions) return entity._draw_positions;

    var arr = entity.polygon.hierarchy.getValue();
    if (arr.positions && this.isArray(arr.positions)) return arr.positions;
    return arr;
  },
  isArray: function isArray(obj) {
    return (
      (typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object" &&
      obj.constructor == Array
    );
  },
  getCoordinates: function getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = drawutils.getCoordinates(positions);
    return coordinates;
  },
  toGeoJSON: function toGeoJSON(entity) {
    var coordinates = this.getCoordinates(entity);

    if (coordinates.length > 0) {
      var first = coordinates[0];
      var last = coordinates[coordinates.length - 1];
      if (first[0] != last[0] || first[1] != last[1] || first[2] != last[2]) {
        coordinates.push(first);
      }
    }

    return {
      type: "Feature",
      properties: entity.attribute,
      geometry: {
        type: "Polygon",
        coordinates: [coordinates],
      },
    };
  },
};
var EllipsoidControl = {
  typename: "ellipsoid",
  startDraw: function startDraw(dataSource, attribute) {
    var entityattr = this.attribute2Entity(attribute);

    var entity = dataSource.entities.add({
      ellipsoid: entityattr,
      attribute: attribute,
    });

    return entity;
  },
  attribute2Entity: function attribute2Entity(attribute, entityattr) {
    attribute = attribute || {};
    attribute.style = attribute.style || {};
    if (entityattr == null) {
      //默认值
      entityattr = {
        fill: true,
      };
    }

    //Style赋值值Entity
    for (var key in attribute.style) {
      var value = attribute.style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
        case "widthRadii":
        case "heightRadii":
          break;
        case "outlineColor":
          //边框颜色
          entityattr.outlineColor = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(
            attribute.style.outlineOpacity || attribute.style.opacity || 1.0
          );
          break;
        case "color":
          //填充颜色
          entityattr.material = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(attribute.style.opacity || 1.0));
          break;
        case "extentRadii":
          //球体长宽高半径
          var extentRadii = attribute.style.extentRadii || 100;
          var widthRadii = attribute.style.widthRadii || 100;
          var heightRadii = attribute.style.heightRadii || 100;
          entityattr.radii = new Cesium.Cartesian3(
            extentRadii,
            widthRadii,
            heightRadii
          );
          break;
      }
    }

    return entityattr;
  },
  getEditor: function getEditor(dataSource, entity, options) {
    return new EllipsoidEditor(dataSource, entity, options);
  },
  setPositions: function setPositions(entity, position) {
    entity.position = new DynamicProperty(position);
  },
  getPositions: function getPositions(entity) {
    return [entity.position.getValue()];
  },
  getCoordinates: function getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = drawutils.getCoordinates(positions);
    return coordinates;
  },
  toGeoJSON: function toGeoJSON(entity) {
    var coordinates = this.getCoordinates(entity);

    return {
      type: "Feature",
      properties: entity.attribute,
      geometry: { type: "Point", coordinates: coordinates[0] },
    };
  },
};
var WallControl = {
  typename: "wall",
  startDraw: function startDraw(dataSource, attribute) {
    var entityattr = this.attribute2Entity(attribute);

    var entity = dataSource.entities.add({
      wall: entityattr,
      attribute: attribute,
    });

    return entity;
  },
  attribute2Entity: function attribute2Entity(attribute, entityattr) {
    attribute = attribute || {};
    attribute.style = attribute.style || {};

    if (!entityattr) {
      entityattr = {
        fill: true,
        minimumHeights: [],
        maximumHeights: [],
        positions: new DynamicProperty([]),
      };
    }

    //Style赋值值Entity
    for (var key in attribute.style) {
      var value = attribute.style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
          break;
        case "outlineColor":
          //边框颜色
          entityattr.outlineColor = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(
            attribute.style.outlineOpacity || attribute.style.opacity || 1.0
          );
          break;
        case "color":
          //填充颜色
          entityattr.material = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(attribute.style.opacity || 1.0));
          break;
      }
    }

    //如果未设置任何material，设置默认颜色
    if (entityattr.material == null) {
      entityattr.material = Cesium.Color.fromRandom({
        minimumGreen: 0.75,
        maximumBlue: 0.75,
        alpha: Number(attribute.style.opacity || 1.0),
      });
    }

    return entityattr;
  },
  getEditor: function getEditor(dataSource, entity, options) {
    return new WallEditor(dataSource, entity, options);
  },
  setPositions: function setPositions(entity, position) {
    entity.wall.positions = new DynamicProperty(position);

    if (entity.wall.maximumHeights && entity.wall.minimumHeights) {
      for (var i = 0; i < position.length; i++) {
        var carto = Cesium.Cartographic.fromCartesian(position[i]);
        entity.wall.minimumHeights._value[i] = Number(carto.height);
        entity.wall.maximumHeights._value[i] =
          Number(carto.height) + Number(entity.attribute.style.extrudedHeight);
      }
    }
  },
  getPositions: function getPositions(entity) {
    return entity.wall.positions.getValue();
  },

  setMaximumHeights: function setMaximumHeights(entity, maximumHeights) {
    entity.wall.maximumHeights = new DynamicProperty(maximumHeights);
  },
  getMaximumHeights: function getMaximumHeights(entity) {
    return entity.wall.maximumHeights.getValue();
  },
  setMinimumHeights: function setMinimumHeights(entity, minimumHeights) {
    entity.wall.minimumHeights = new _DynamicProperty.DynamicProperty(
      minimumHeights
    );
  },
  getMinimumHeights: function getMinimumHeights(entity) {
    return entity.wall.minimumHeights.getValue();
  },

  getCoordinates: function getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = drawutils.getCoordinates(positions);
    return coordinates;
  },
  toGeoJSON: function toGeoJSON(entity) {
    var coordinates = this.getCoordinates(entity);

    return {
      type: "Feature",
      properties: entity.attribute,
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    };
  },
};
var PointControl = {
  typename: "point",
  startDraw: function startDraw(dataSource, attribute) {
    var entityattr = this.attribute2Entity(attribute);

    var entity = dataSource.entities.add({
      point: entityattr,
      attribute: attribute,
    });

    return entity;
  },
  attribute2Entity: function attribute2Entity(attribute, entityattr) {
    attribute = attribute || {};
    attribute.style = attribute.style || {};
    if (entityattr == null) {
      //默认值
      entityattr = {};
    }

    //Style赋值值Entity
    for (var key in attribute.style) {
      var value = attribute.style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
        case "scaleByDistance_near":
        case "scaleByDistance_nearValue":
        case "scaleByDistance_far":
        case "scaleByDistance_farValue":
        case "distanceDisplayCondition_far":
        case "distanceDisplayCondition_near":
          break;
        case "outlineColor":
          //边框颜色
          entityattr.outlineColor = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(
            attribute.style.outlineOpacity || attribute.style.opacity || 1.0
          );
          break;
        case "color":
          //填充颜色
          entityattr.color = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(attribute.style.opacity || 1.0));
          break;
        case "scaleByDistance":
          //是否按视距缩放
          if (value) {
            entityattr.scaleByDistance = new Cesium.NearFarScalar(
              Number(attribute.style.scaleByDistance_near || 1000),
              Number(attribute.style.scaleByDistance_nearValue || 1.0),
              Number(attribute.style.scaleByDistance_far || 1000000),
              Number(attribute.style.scaleByDistance_farValue || 0.1)
            );
          } else {
            entityattr.scaleByDistance = null;
          }
          break;
        case "distanceDisplayCondition":
          //是否按视距显示
          if (value) {
            entityattr.distanceDisplayCondition =
              new Cesium.DistanceDisplayCondition(
                Number(attribute.style.distanceDisplayCondition_near || 0),
                Number(attribute.style.distanceDisplayCondition_far || 100000)
              );
          } else {
            entityattr.distanceDisplayCondition = null;
          }
          break;
      }
    }

    //无边框时，需设置宽度为0
    if (!attribute.style.outline) entityattr.outlineWidth = 0.0;

    return entityattr;
  },
  getEditor: function getEditor(dataSource, entity, options) {
    return new PointEditor(dataSource, entity, options);
  },
  setPositions: function setPositions(entity, position) {
    entity.position = new DynamicProperty(position);
  },
  getPositions: function getPositions(entity) {
    return [entity.position.getValue()];
  },
  getCoordinates: function getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = drawutils.getCoordinates(positions);
    return coordinates;
  },
  toGeoJSON: function toGeoJSON(entity) {
    var coordinates = this.getCoordinates(entity);

    return {
      type: "Feature",
      properties: entity.attribute,
      geometry: { type: "Point", coordinates: coordinates[0] },
    };
  },
};
var RectangleControl = {
  typename: "rectangle",
  startDraw: function startDraw(dataSource, attribute) {
    var entityattr = this.attribute2Entity(attribute);
    var addattr = {
      rectangle: entityattr,
      attribute: attribute,
      _draw_positions: [],
    };
    if (!attribute.style.extrudedHeight) {
      //边线特殊处理
      addattr.polyline = {
        clampToGround: attribute.style.clampToGround,
        show: false,
      };
    }
    var entity = dataSource.entities.add(addattr);
    entity.rectangle.coordinates = new Cesium.CallbackProperty(function (time) {
      // 直接返回，不能返回空数组
      if (!entity._draw_positions || entity._draw_positions.length == 0) return;

      return Cesium.Rectangle.fromCartesianArray(entity._draw_positions);
    }, false);
    if (entity.polyline) {
      //边线
      entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
        if (!entity.polyline.show.getValue()) return null;

        var positions = entity._draw_positions;
        var height = entity.rectangle.height
          ? entity.rectangle.height.getValue()
          : 0;

        var re = Cesium.Rectangle.fromCartesianArray(positions);
        var pt1 = Cesium.Cartesian3.fromRadians(re.west, re.south, height);
        var pt2 = Cesium.Cartesian3.fromRadians(re.east, re.south, height);
        var pt3 = Cesium.Cartesian3.fromRadians(re.east, re.north, height);
        var pt4 = Cesium.Cartesian3.fromRadians(re.west, re.north, height);

        return [pt1, pt2, pt3, pt4, pt1];
      }, false);
      entity.polyline.show = new Cesium.CallbackProperty(function (time) {
        return (
          entity.rectangle.outline &&
          entity.rectangle.outline.getValue() &&
          entity.rectangle.outlineWidth &&
          entity.rectangle.outlineWidth.getValue() > 1
        );
      }, false);
      entity.polyline.width = new Cesium.CallbackProperty(function (time) {
        return entity.rectangle.outlineWidth;
      }, false);
      entity.polyline.color = new Cesium.CallbackProperty(function (time) {
        return entity.rectangle.outlineColor;
      }, false);
    }

    return entity;
  },
  attribute2Entity: function attribute2Entity(attribute, entityattr) {
    attribute = attribute || {};
    attribute.style = attribute.style || {};

    if (!entityattr) {
      entityattr = {
        fill: true,
      };
    }

    //贴地时，剔除高度相关属性
    if (attribute.style.clampToGround) {
      if (attribute.style.hasOwnProperty("height"))
        delete attribute.style.height;
      if (attribute.style.hasOwnProperty("extrudedHeight"))
        delete attribute.style.extrudedHeight;
    }

    //Style赋值值Entity
    for (var key in attribute.style) {
      var value = attribute.style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "opacity": //跳过扩展其他属性的参数
        case "outlineOpacity":
          break;
        case "outlineColor":
          //边框颜色
          entityattr.outlineColor = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(
            attribute.style.outlineOpacity || attribute.style.opacity || 1.0
          );
          break;
        case "height":
          entityattr.height = Number(value);
          if (attribute.style.extrudedHeight)
            entityattr.extrudedHeight =
              Number(attribute.style.extrudedHeight) + Number(value);
          break;
        case "extrudedHeight":
          entityattr.extrudedHeight =
            Number(entityattr.height || attribute.style.height || 0) +
            Number(value);
          break;
        case "color":
          //填充颜色
          entityattr.material = new Cesium.Color.fromCssColorString(
            value || "#FFFF00"
          ).withAlpha(Number(attribute.style.opacity || 1.0));
          break;
        case "image":
          //填充图片
          entityattr.material = new Cesium.ImageMaterialProperty({
            image: attribute.style.image,
            color: new Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(
              Number(attribute.style.opacity || 1.0)
            ),
          });
          break;
        case "rotation":
          //旋转角度
          entityattr.rotation = Cesium.Math.toRadians(value);
          if (!attribute.style.stRotation)
            entityattr.stRotation = Cesium.Math.toRadians(value);
          break;
        case "stRotation":
          entityattr.stRotation = Cesium.Math.toRadians(value);
          break;
      }
    }

    //如果未设置任何material，设置默认颜色
    if (entityattr.material == null) {
      entityattr.material = Cesium.Color.fromRandom({
        minimumGreen: 0.75,
        maximumBlue: 0.75,
        alpha: Number(attribute.style.opacity || 1.0),
      });
    }

    return entityattr;
  },
  getEditor: function getEditor(dataSource, entity, options) {
    if (entity.rectangle.extrudedHeight) {
      return new RectangleExtrudedEditor(dataSource, entity, options);
    } else {
      return new RectangleEditor(dataSource, entity, options);
    }
  },
  setPositions: function setPositions(entity, position) {
    entity._draw_positions = position;
  },
  getPositions: function getPositions(entity) {
    return entity._draw_positions;
  },
  getCoordinates: function getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = drawutils.getCoordinates(positions);
    return coordinates;
  },
  //getDiagonalPositions: function (entity) {
  //    var rectangle = entity.rectangle.coordinates.getValue();
  //    var nw = Cesium.Rectangle.northwest(rectangle);
  //    var se = Cesium.Rectangle.southeast(rectangle);
  //    return Cesium.Cartesian3.fromRadiansArray([nw.longitude, nw.latitude, se.longitude, se.latitude]);
  //},
  toGeoJSON: function toGeoJSON(entity) {
    var coordinates = this.getCoordinates(entity);

    return {
      type: "Feature",
      properties: entity.attribute,
      geometry: {
        type: "MultiPoint",
        coordinates: coordinates,
      },
    };
  },
};
var ModelControl = {
  typename: "model",
  startDraw: function startDraw(dataSource, attribute) {
    var entityattr = this.attribute2Entity(attribute);
    // console.log(entityattr)
    var entity = dataSource.entities.add({
      model: entityattr,
      //  {
      //     color: entityattr.color,
      //     heading: entityattr.heading,
      //     pitch: entityattr.pitch,
      //     roll: entityattr.roll,
      //     scale: entityattr.scale,
      //     silhouetteSize: entityattr.silhouetteSize,
      //     uri: require(entityattr.uri),
      // },
      attribute: attribute,
    });
    console.log(entity);
    return entity;
  },
  attribute2Entity: function attribute2Entity(attribute, entityattr) {
    attribute = attribute || {};
    attribute.style = attribute.style || {};
    if (entityattr == null) {
      //默认值
      entityattr = {};
    }

    //Style赋值值Entity
    for (var key in attribute.style) {
      var value = attribute.style[key];
      switch (key) {
        default:
          //直接赋值
          entityattr[key] = value;
          break;
        case "silhouette": //跳过扩展其他属性的参数
        case "silhouetteColor":
        case "silhouetteAlpha":
        case "silhouetteSize":
        case "fill":
        case "color":
        case "opacity":
          break;
        case "modelUrl":
          //模型uri
          entityattr.uri = value;
          break;
      }
    }

    //轮廓
    if (attribute.style.silhouette) {
      entityattr.silhouetteColor = new Cesium.Color.fromCssColorString(
        attribute.style.silhouetteColor || "#FFFFFF"
      ).withAlpha(Number(attribute.style.silhouetteAlpha || 1.0));
      entityattr.silhouetteSize = Number(attribute.style.silhouetteSize || 1.0);
    } else entityattr.silhouetteSize = 0.0;

    //透明度、颜色
    var opacity = attribute.style.hasOwnProperty("opacity")
      ? Number(attribute.style.opacity)
      : 1;
    if (attribute.style.fill)
      entityattr.color = new Cesium.Color.fromCssColorString(
        attribute.style.color || "#FFFFFF"
      ).withAlpha(opacity);
    else
      entityattr.color = new Cesium.Color.fromCssColorString(
        "#FFFFFF"
      ).withAlpha(opacity);

    return entityattr;
  },
  attribute2Model: function attribute2Model(attribute, model) {
    //角度控制
    var heading = Cesium.Math.toRadians(
      Number(model.attribute.style.heading || 0.0)
    );
    var pitch = Cesium.Math.toRadians(
      Number(model.attribute.style.pitch || 0.0)
    );
    var roll = Cesium.Math.toRadians(Number(model.attribute.style.roll || 0.0));
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);

    if (model.orientation) {
      model.orientation = Cesium.Transforms.headingPitchRollQuaternion(
        model.position.getValue(),
        hpr
      );
    }
  },
  getEditor: function getEditor(dataSource, entity, options) {
    return new PointEditor(dataSource, entity, options);
  },
  setPositions: function setPositions(entity, position) {
    entity.position = new DynamicProperty(position);
    var heading = Cesium.Math.toRadians(
      Number(entity.attribute.style.heading || 0.0)
    );
    var pitch = Cesium.Math.toRadians(
      Number(entity.attribute.style.pitch || 0.0)
    );
    var roll = Cesium.Math.toRadians(
      Number(entity.attribute.style.roll || 0.0)
    );
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(
      entity.position.getValue(),
      hpr
    );
  },
  getPositions: function getPositions(entity) {
    return [entity.position.getValue()];
  },
  getCoordinates: function getCoordinates(entity) {
    var positions = this.getPositions(entity);
    var coordinates = drawutils.getCoordinates(positions);
    return coordinates;
  },
  toGeoJSON: function toGeoJSON(entity) {
    var coordinates = this.getCoordinates(entity);

    return {
      type: "Feature",
      properties: entity.attribute,
      geometry: { type: "Point", coordinates: coordinates[0] },
    };
  },
};
var drawutils = {
  //公开绘制相关的一些内置参数，方便外部控制
  DraggerPixelSize: 12, //编辑点的像素大小
  DrawPointColor: new Cesium.Color.fromCssColorString("#792ae0"), //绘制的点
  MoveHeightPointColor: new Cesium.Color.fromCssColorString("#d600c8"), //上下移动高度的点
  MovePointColor: new Cesium.Color.fromCssColorString("#ffff00"), //平移的点，比如设置半径
  DrawTooltip: "修改 坐标位置",
  MoveHeightTooltip: "修改 高度",
  MoveEllipseMajorTooltip: "修改 长半径",
  MoveEllipseMinorTooltip: "修改 短半径",
  MoveRadiusTooltip: "修改 半径",
  /**
   * 创建Dragger拖动点的公共方法
   */
  createDragger: function createDragger(dataSource, options) {
    var dragger;
    if (options.dragger) {
      dragger = options.dragger;
    } else {
      var position = Cesium.defaultValue(
        options.position,
        Cesium.Cartesian3.ZERO
      );
      var heightReference = options.clampToGround
        ? Cesium.HeightReference.CLAMP_TO_GROUND
        : Cesium.HeightReference.NONE;
      if (window.viewer && viewer.scene.mode !== Cesium.SceneMode.SCENE3D)
        heightReference = Cesium.HeightReference.NONE;

      dragger = dataSource.entities.add({
        position: position,
        point: {
          scale: 1,
          color: options.color || this.DrawPointColor,
          pixelSize: this.DraggerPixelSize || 12,
          outlineColor: new Cesium.Color.fromCssColorString(
            "#ffffff"
          ).withAlpha(0.8),
          outlineWidth: 2,
          scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.5),
          heightReference: heightReference,
        },
        tooltip: options.tooltip || this.DrawTooltip,
      });
    }

    dragger._isDragger = true;
    dragger.onDrag = Cesium.defaultValue(options.onDrag, null);
    dragger.horizontal = Cesium.defaultValue(options.horizontal, true);
    dragger.vertical = Cesium.defaultValue(options.vertical, false);
    dragger.verticalCtrl = Cesium.defaultValue(options.vertical, false);

    return dragger;
  },
  /**
   * 将Cartesian坐标数组  转换为  经纬度坐标数组
   * @param {Array} positions Array<Cartesian3> 笛卡尔坐标数组
   */
  getCoordinates: function getCoordinates(positions) {
    var coordinates = [];
    for (var i = 0; i < positions.length; i++) {
      var carto = Cesium.Cartographic.fromCartesian(positions[i]);

      var lng = Number(Cesium.Math.toDegrees(carto.longitude).toFixed(6));
      var lat = Number(Cesium.Math.toDegrees(carto.latitude).toFixed(6));
      var height = Number(carto.height.toFixed(1));

      coordinates.push([lng, lat, height]);
    }
    return coordinates;
  },
  /**
   * 获取坐标数组中最高高程值
   * @param {Array} positions Array<Cartesian3> 笛卡尔坐标数组
   * @param {Number} defaultVal 默认高程值
   */
  getMaxHeightForPositions: function getMaxHeightForPositions(
    positions,
    defaultVal
  ) {
    if (defaultVal == null) defaultVal = 0;

    var maxHeight = defaultVal;
    if (positions == null || positions.length == 0) return maxHeight;

    var extrudedPosition = positions[0];
    for (var i = 0; i < positions.length; i++) {
      var tempCarto = Cesium.Cartographic.fromCartesian(positions[i]);
      if (tempCarto.height > maxHeight) {
        maxHeight = tempCarto.height;
      }
    }
    return maxHeight;
  },
  /**
   * 设定带有高度的坐标,参数positions为Cartesian3类型,返回类型为Cartesian3类型(的数组)
   * @param {Array} positions Cartesian3类型的数组
   * @param {Number} height 高度值
   * @return {Array} Cartesian3类型的数组
   */
  getPositionsWithHeight: function getPositionsWithHeight(positions, height) {
    if (positions instanceof Array) {
      var lonlats = [];
      for (var i = 0; i < positions.length; i++) {
        var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
          positions[i]
        );
        var tempcarto = {
          lon: Cesium.Math.toDegrees(cartographic.longitude),
          lat: Cesium.Math.toDegrees(cartographic.latitude),
          hgt: Math.ceil(Number(cartographic.height) + Number(height)),
        };
        var lonlat = [tempcarto.lon, tempcarto.lat, tempcarto.hgt];
        lonlats = lonlats.concat(lonlat);
      }
      return Cesium.Cartesian3.fromDegreesArrayHeights(lonlats);
    } else {
      var cartographic =
        Cesium.Ellipsoid.WGS84.cartesianToCartographic(positions);
      var lon = Cesium.Math.toDegrees(cartographic.longitude);
      var lat = Cesium.Math.toDegrees(cartographic.latitude);
      return Cesium.Cartesian3.fromDegrees(
        lon,
        lat,
        Number(cartographic.height) + Number(height)
      );
    }
  },

  /**
   * 带有高度差的两点，判断其直角点
   * @param {Cartesian3} cartesian1
   * @param {Cartesian3} cartesian2
   * @return {Cartesian3}
   */
  getZHeightPosition: function getZHeightPosition(cartesian1, cartesian2) {
    var carto1 = Cesium.Cartographic.fromCartesian(cartesian1);
    var lng1 = Number(Cesium.Math.toDegrees(carto1.longitude));
    var lat1 = Number(Cesium.Math.toDegrees(carto1.latitude));
    var height1 = Number(carto1.height.toFixed(2));

    var carto2 = Cesium.Cartographic.fromCartesian(cartesian2);
    var lng2 = Number(Cesium.Math.toDegrees(carto2.longitude));
    var lat2 = Number(Cesium.Math.toDegrees(carto2.latitude));
    var height2 = Number(carto2.height.toFixed(2));

    if (height1 > height2)
      return Cesium.Cartesian3.fromDegrees(lng2, lat2, height1);
    else return Cesium.Cartesian3.fromDegrees(lng1, lat1, height2);
  },

  /**
   * 带有高度差的两点，计算两点间的水平距离
   * @param {Cartesian3} cartesian1
   * @param {Cartesian3} cartesian2
   * @return {Number}
   */
  getHDistance: function getHDistance(cartesian1, cartesian2) {
    var zCartesian = this.getZHeightPosition(cartesian1, cartesian2);

    var carto1 = Cesium.Cartographic.fromCartesian(cartesian2);
    var cartoZ = Cesium.Cartographic.fromCartesian(zCartesian);

    var hDistance = Cesium.Cartesian3.distance(cartesian1, zCartesian);

    if (Math.abs(Number(cartoZ.height) - Number(carto1.height)) < 0.01) {
      hDistance = Cesium.Cartesian3.distance(cartesian2, zCartesian);
    }

    return hDistance;
  },

  /**
   * 计算两点之间的中点
   * @param {Cartesian3} cartesian1
   * @param {Cartesian3} cartesian2
   * @return {Cartesian3}
   */
  getMidPosition: function getMidPosition(cartesian1, cartesian2) {
    var carto1 = Cesium.Cartographic.fromCartesian(cartesian1);
    var lng1 = Number(Cesium.Math.toDegrees(carto1.longitude));
    var lat1 = Number(Cesium.Math.toDegrees(carto1.latitude));
    var height1 = Number(carto1.height.toFixed(2));

    var carto2 = Cesium.Cartographic.fromCartesian(cartesian2);
    var lng2 = Number(Cesium.Math.toDegrees(carto2.longitude));
    var lat2 = Number(Cesium.Math.toDegrees(carto2.latitude));
    var height2 = Number(carto2.height.toFixed(2));

    var newLng = (lng1 + lng2) / 2;
    var newLat = (lat1 + lat2) / 2;
    var newHeight = (height1 + height2) / 2;

    return Cesium.Cartesian3.fromDegrees(newLng, newLat, newHeight);
  },
  isArray: function isArray(obj) {
    return (
      (typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object" &&
      obj.constructor == Array
    );
  },
  getPositionsFromJson: function getPositionsFromJson(geometry) {
    if (!geometry) {
      return null;
    }
    switch (geometry.type) {
      case "Point":
        var point = geometry.coordinates;
        if (point.length == 1 && this.isArray(point[0]))
          //兼容旧版本
          point = point[0];
        return this.lonLatToCartesian(point);
      case "MultiPoint":
        return this.lonLatsToCartesians(geometry.coordinates);
      case "LineString":
        return this.lonLatsToCartesians(geometry.coordinates);
      case "MultiLineString":
        return this.lonLatsToCartesians(geometry.coordinates[0]);
      case "Polygon":
        return this.lonLatsToCartesians(geometry.coordinates[0]);
      case "MultiPolygon":
        return this.lonLatsToCartesians(geometry.coordinates[0][0]);
      default:
        throw new Error("Invalid GeoJSON object.");
    }
  },

  /**
   * 根据单个经纬度坐标值数组,求出笛卡尔坐标
   * @param {Array} [coords=[longitude,latitude,height]] 值数组
   * @return {Cartesian3}
   */
  lonLatToCartesian: function lonLatToCartesian(coords) {
    return Cesium.Cartesian3.fromDegrees(
      Number(coords[0]),
      Number(coords[1]),
      Number(coords[2] || 0)
    );
  },

  /**
   * 根据多个经纬度坐标值数组,求出笛卡尔坐标
   * @param {Array} [coords=[[longitude,latitude,height],[longitude,latitude,height],...]]
   * @return {Array} Cartesian3类型的数组
   */
  lonLatsToCartesians: function lonLatsToCartesians(coords) {
    var lonlats = [];
    for (var i = 0; i < coords.length; i++) {
      var lonlat = [
        Number(coords[i][0]),
        Number(coords[i][1]),
        Number(coords[i][2] || 0),
      ];
      lonlats = lonlats.concat(lonlat);
    }
    return Cesium.Cartesian3.fromDegreesArrayHeights(lonlats);
  },

  //格式化为业务格式数据
  normalizeJsonData: function normalizeJsonData(businessData) {
    var jsonData = {};
    jsonData.type = "FeatureCollection";
    jsonData.features = [];
    var _businessData;
    if (typeof businessData == "string") {
      _businessData = JSON.parse(businessData);
    } else _businessData = businessData;
    if (_businessData instanceof Array) {
      for (var i = 0; i < _businessData.length; i++) {
        var tempObj = {
          type: "Feature",
        };
        tempObj.properties =
          _businessData[i].properties || _businessData[i].PROPERTIES;
        tempObj.geometry =
          _businessData[i].geometry || _businessData[i].GEOMETRY;
        jsonData.features.push(tempObj);
      }
      return JSON.stringify(jsonData);
    } else if (
      businessData.features &&
      businessData.features instanceof Array
    ) {
      return businessData;
    }
  },
  //格式化为geojson数据
  normalizeBusinessData: function normalizeBusinessData(jsonData) {
    var jsonObjs = {};
    try {
      jsonObjs = JSON.parse(jsonData);
    } catch (e) {
      (0, _util.alert)(
        e.name + ": " + e.message + " \n请确认json文件格式正确!!!"
      );
      return;
    }
    var features = jsonObjs.features;
    var terminalObjs = [];
    for (var i = 0; i < features.length; i++) {
      var feature = features[i];
      var tempObj = {
        dataID: feature.properties.attr.id,
        dataType: feature.properties.attr.type,
        properties: feature.properties,
        geometry: feature.geometry,
      };
      terminalObjs.push(tempObj);
    }
    return JSON.stringify(terminalObjs);
  },
};
/**
 * 创建一个编辑器，用于管理查看器的整体绘图和编辑功能。
 */
function EventControl(viewer) {
  this.viewer = viewer;
}

EventControl.prototype.setCursor = function (style) {
  $("#" + this.viewer._container.id).css("cursor", style || "");
};
/**
 * 【绘制】单个坐标点的对象（点、字）绘制处理程序，绑定单击事件
 */
EventControl.prototype.createDrawPointHandler = function (
  entity,
  drawOkCalback
) {
  this.setCursor("crosshair");

  var that = this;
  entity.inProgress = true;
  var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  handler.setInputAction(function (event) {
    var cartesian = (0, getCurrentMousePosition)(
      that.viewer.scene,
      event.position,
      entity
    );
    if (cartesian) {
      that.setCursor();

      entity.updatePositions(cartesian);

      entity.inProgress = false;
      handler.destroy();
      that.drawHandler = null;
      that.pickedEntity = entity;

      entity.stopDrawing();
      entity.startEditing();
      drawOkCalback && drawOkCalback(entity);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  //记录最近一次值
  this.drawHandler = handler;
  return handler;
};

/**
 * 【绘制】多个坐标点的对象（线）绘制处理程序，绑定单击、鼠标移动、双击事件
 * Creates a handler that lets you modify a list of positions.
 */
EventControl.prototype.createDrawPolylineHandler = function (
  entity,
  positions,
  drawOkCalback
) {
  this.setCursor("crosshair");
  var that = this;

  entity.inProgress = true;
  var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

  // Adds a point to the positions list.
  handler.lastPointTemporary = false;
  handler.setInputAction(function (event) {
    var cartesian = (0, getCurrentMousePosition)(
      that.viewer.scene,
      event.position,
      entity
    );
    if (cartesian) {
      if (handler.lastPointTemporary) {
        positions.pop();
      }
      if (entity.attribute && entity.attribute.addHeight)
        //在绘制点基础自动增加高度
        cartesian = drawutils.getPositionsWithHeight(
          cartesian,
          entity.attribute.addHeight
        );

      //test
      //var cartoLoc = Cesium.Cartographic.fromCartesian(cartesian);
      //cartesian._height= cartoLoc.height;
      //console.log('当前点高度：' + cartoLoc.height);

      //var str = "";
      //for (var i = 0; i < positions.length; i++) {
      //    str += Cesium.Cartographic.fromCartesian(positions[i]).height+",";
      //}
      //console.log('数组高度：' + str);

      positions.push(cartesian);

      handler.lastPointTemporary = false;
      if (entity.attribute && entity.attribute.minMaxPoints) {
        if (
          (positions.length == entity.attribute.minMaxPoints.min &&
            positions.length == entity.attribute.minMaxPoints.max) ||
          (entity.attribute.minMaxPoints.isSuper && positions.length == 4)
        ) {
          entity.inProgress = false;
          handler.destroy();
          that.drawHandler = null;
          that.pickedEntity = entity;
          that.setCursor();

          entity.stopDrawing();
          entity.startEditing();
          //   drawOkCalback && drawOkCalback(entity);
        }
      }
      entity.changeDrawing();
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // Replaces the last point in the list with the point under the mouse.
  handler.setInputAction(function (event) {
    if (event.endPosition) {
      var cartesian = (0, getCurrentMousePosition)(
        that.viewer.scene,
        event.endPosition,
        entity
      );
      if (cartesian) {
        if (handler.lastPointTemporary) {
          positions.pop();
        }
        positions.push(cartesian);
        handler.lastPointTemporary = true;
        entity.moveDrawing();
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(function (event) {
    entity.inProgress = false;
    handler.destroy();
    that.drawHandler = null;
    that.pickedEntity = entity;
    that.setCursor();

    positions.pop(); //必要代码 消除双击带来的多余经纬度

    entity.stopDrawing();
    entity.startEditing();
    drawOkCalback && drawOkCalback(entity);
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

  //记录最近一次值
  this.drawHandler = handler;

  return handler;
};

/**
 * 【绘制】面绘制处理程序，绑定单击、鼠标移动、双击事件
 * Creates a handler that lets you modify a list of positions.
 */
EventControl.prototype.createDrawPolygonHandler = function (
  entity,
  positions,
  drawOkCalback
) {
  this.setCursor("crosshair");
  var that = this;

  entity.inProgress = true;
  var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

  // Adds a point to the positions list.
  handler.lastPointTemporary = false;
  handler.setInputAction(function (event) {
    var cartesian = (0, getCurrentMousePosition)(
      that.viewer.scene,
      event.position,
      entity
    );
    if (cartesian) {
      if (handler.lastPointTemporary) {
        positions.pop();
      }
      positions.push(cartesian);

      if (entity.attribute.style.extrudedHeight) {
        //存在extrudedHeight高度设置时
        var maxHight = drawutils.getMaxHeightForPositions(positions);
        entity.polygon.extrudedHeight =
          maxHight + Number(entity.attribute.style.extrudedHeight);
      }

      handler.lastPointTemporary = false;
      entity.changeDrawing();
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // Replaces the last point in the list with the point under the mouse.
  handler.setInputAction(function (event) {
    if (event.endPosition) {
      var cartesian = (0, getCurrentMousePosition)(
        that.viewer.scene,
        event.endPosition,
        entity
      );
      if (cartesian) {
        if (handler.lastPointTemporary) {
          positions.pop();
        }
        positions.push(cartesian);

        if (entity.attribute.style.extrudedHeight) {
          //存在extrudedHeight高度设置时
          var maxHight = drawutils.getMaxHeightForPositions(positions);
          entity.polygon.extrudedHeight =
            maxHight + Number(entity.attribute.style.extrudedHeight);
        }

        handler.lastPointTemporary = true;
        entity.moveDrawing();
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(function (event) {
    entity.inProgress = false;
    handler.destroy();
    that.drawHandler = null;
    that.setCursor();
    that.pickedEntity = entity;

    positions.pop(); //必要代码 消除双击带来的多余经纬度

    entity.stopDrawing();
    entity.startEditing();
    drawOkCalback && drawOkCalback(entity);
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

  //记录最近一次值
  this.drawHandler = handler;

  return handler;
};

/**
 * 【绘制】Cesium矩形，绑定单击、鼠标移动、双击事件;
 * Creates a handler that lets you modify a list of positions.
 */
EventControl.prototype.createTwoPointsModelHandler = function (
  entity,
  positions,
  drawOkCalback
) {
  // console.log(entity, positions, drawOkCalback)
  this.setCursor("crosshair");
  var that = this;
  entity.inProgress = true;

  var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  handler.lastPointTemporary = false;
  handler.setInputAction(function (event) {
    var cartesian = (0, getCurrentMousePosition)(
      that.viewer.scene,
      event.position,
      entity
    );
    if (cartesian) {
      if (handler.lastPointTemporary) {
        positions.pop();
      }
      positions.push(cartesian);

      if (positions.length == 1 && !entity.attribute.style.clampToGround) {
        var modelHeight = Number(
          Cesium.Cartographic.fromCartesian(cartesian).height.toFixed(2)
        );
        entity.rectangle.height = modelHeight;
        entity.attribute.style.height = modelHeight;

        if (entity.attribute.style.extrudedHeight)
          entity.rectangle.extrudedHeight =
            modelHeight + Number(entity.attribute.style.extrudedHeight);
      }

      handler.lastPointTemporary = false;
      entity.changeDrawing();

      if (positions.length == 2) {
        entity.inProgress = false;
        handler.destroy();
        that.drawHandler = null;
        that.setCursor();
        that.pickedEntity = entity;

        entity.stopDrawing();
        entity.startEditing();
        drawOkCalback && drawOkCalback(entity);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // Replaces the last point in the list with the point under the mouse.
  handler.setInputAction(function (event) {
    if (event.endPosition) {
      var cartesian = (0, getCurrentMousePosition)(
        that.viewer.scene,
        event.endPosition,
        entity
      );
      if (cartesian) {
        if (handler.lastPointTemporary) {
          positions.pop();
        }
        positions.push(cartesian);

        handler.lastPointTemporary = true;
        entity.moveDrawing();
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  //记录最近一次值
  this.drawHandler = handler;

  return handler;
};

/**
 * 【绘制】Cesium墙体，绑定单击、鼠标移动、双击事件;
 * 除记录墙体的鼠标拾取的坐标外,还需记录顶部和底部的高程,并赋值给墙体Entity
 * Creates a handler that lets you modify a list of positions.
 */
EventControl.prototype.createDrawWallHandler = function (
  entity,
  positions,
  minimumHeights,
  maximumHeights,
  drawOkCalback
) {
  this.setCursor("crosshair");
  var that = this;

  entity.inProgress = true;
  var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

  // Adds a point to the positions list.
  handler.lastPointTemporary = false;
  handler.setInputAction(function (event) {
    var cartesian = (0, getCurrentMousePosition)(
      that.viewer.scene,
      event.position,
      entity
    );
    if (cartesian) {
      if (handler.lastPointTemporary) {
        positions.pop();
        minimumHeights.pop();
        maximumHeights.pop();
      }
      positions.push(cartesian);
      var cartoPs = Cesium.Cartographic.fromCartesian(cartesian);
      var minHeight = Number(cartoPs.height.toFixed(2));
      var maxHeight =
        Number(minHeight) + Number(entity.attribute.style.extrudedHeight);
      minimumHeights.push(minHeight);
      maximumHeights.push(maxHeight);
      handler.lastPointTemporary = false;

      entity.changeDrawing();
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // Replaces the last point in the list with the point under the mouse.
  handler.setInputAction(function (event) {
    if (event.endPosition) {
      //var cartesian = this.viewer.camera.pickEllipsoid(event.endPosition, this.viewer.scene.globe.ellipsoid);
      var cartesian = (0, getCurrentMousePosition)(
        that.viewer.scene,
        event.endPosition,
        entity
      );
      if (cartesian) {
        if (handler.lastPointTemporary) {
          positions.pop();
          minimumHeights.pop();
          maximumHeights.pop();
        }
        positions.push(cartesian);
        var cartoPs = Cesium.Cartographic.fromCartesian(cartesian);
        var minHeight = Number(cartoPs.height.toFixed(2));
        var maxHeight =
          Number(minHeight) + Number(entity.attribute.style.extrudedHeight);
        minimumHeights.push(minHeight);
        maximumHeights.push(maxHeight);

        handler.lastPointTemporary = true;
        entity.moveDrawing();
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(function (event) {
    entity.inProgress = false;
    handler.destroy();
    that.drawHandler = null;
    that.setCursor();
    that.pickedEntity = entity;

    positions.pop(); //必要代码 消除双击带来的多余经纬度
    minimumHeights.pop();
    maximumHeights.pop();

    entity.stopDrawing();
    entity.startEditing();
    drawOkCalback && drawOkCalback(entity);
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

  //记录最近一次值
  this.drawHandler = handler;
  this.pickedEntity = entity;

  return handler;
};

/**
 * 【绘制】 释放未完成的创建绘制
 */
EventControl.prototype.destroyDrawHandler = function () {
  this.setCursor();
  if (this.drawHandler) {
    this.setCursor();
    this.drawHandler.destroy();
    this.drawHandler = null;
  }
};

/**
 * 【编辑】 绑定左键单击事件[选中激活编辑+单击空白处取消编辑]
 */
EventControl.prototype.createEditSelectHandler = function (calback) {
  var that = this;
  var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
  handler.setInputAction(function (e) {
    var picked = that.viewer.scene.pick(e.position);
    var pickedEntity = null;
    if (Cesium.defined(picked)) {
      var id = Cesium.defaultValue(picked.id, picked.primitive.id);
      if (id instanceof Cesium.Entity) {
        var inProgress = Cesium.defaultValue(id.inProgress, false);
        if (!inProgress) {
          pickedEntity = id;
        }
      }
    }
    that.pickedEntity = pickedEntity;

    calback(pickedEntity); //回调
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  this.selectHandler = handler;
};

/**
 * 【编辑】将协助选择和拖动编辑绑定的拖动到，实体对象
 * Initialize the utility handler that will assist in selecting and manipulating Dragger billboards.
 */
EventControl.prototype.createEditDraggerHandler = function () {
  var draggerHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
  draggerHandler.dragger = null;

  var that = this;
  // Left down selects a dragger
  draggerHandler.setInputAction(function (click) {
    var pickedObject = that.viewer.scene.pick(click.position);
    if (Cesium.defined(pickedObject)) {
      var entity = pickedObject.id;
      if (entity && Cesium.defaultValue(entity._isDragger, false)) {
        // Resize the dragger.
        if (entity.billboard) {
          entity.billboard.scale_src = entity.billboard.scale.getValue();
          entity.billboard.scale._value = entity.billboard.scale_src * 1.2;
        }

        draggerHandler.dragger = entity;
        that.viewer.scene.screenSpaceCameraController.enableRotate = false;
        that.viewer.scene.screenSpaceCameraController.enableTilt = false;
        that.viewer.scene.screenSpaceCameraController.enableTranslate = false;
        that.viewer.scene.screenSpaceCameraController.enableInputs = false;
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

  // Left down selects a dragger
  draggerHandler.setInputAction(
    function (click) {
      var pickedObject = that.viewer.scene.pick(click.position);
      if (Cesium.defined(pickedObject)) {
        var entity = pickedObject.id;
        if (entity && Cesium.defaultValue(entity._isDragger, false)) {
          // Resize the dragger.
          if (entity.billboard) {
            entity.billboard.scale_src = entity.billboard.scale._value;
            entity.billboard.scale._value = entity.billboard.scale_src * 1.2;
          }

          draggerHandler.dragger = entity;
          that.viewer.scene.screenSpaceCameraController.enableRotate = false;
          that.viewer.scene.screenSpaceCameraController.enableTilt = false;
          that.viewer.scene.screenSpaceCameraController.enableTranslate = false;
          that.viewer.scene.screenSpaceCameraController.enableInputs = false;
        }
      }
    },
    Cesium.ScreenSpaceEventType.LEFT_DOWN,
    Cesium.KeyboardEventModifier.CTRL
  );

  // Mouse move drags the draggers and calls their onDrag callback.
  draggerHandler.setInputAction(function (event) {
    if (draggerHandler.dragger) {
      if (draggerHandler.dragger.horizontal) {
        var hit;
        if (draggerHandler.dragger.model) {
          //点
          //在模型上提取坐标
          var scene = that.viewer.scene;
          var pickobject = scene.pick(event.endPosition);
          if (
            Cesium.defined(pickobject) &&
            pickobject.id == draggerHandler.dragger
          ) {
            var pickRay = scene.camera.getPickRay(event.endPosition); //提取鼠标点的地理坐标
            hit = scene.globe.pick(pickRay, scene);
          }
        }

        if (hit == null)
          hit = (0, getCurrentMousePosition)(
            that.viewer.scene,
            event.endPosition,
            that.pickedEntity
          );

        if (hit) {
          draggerHandler.dragger.position = hit;
          if (draggerHandler.dragger.onDrag) {
            draggerHandler.dragger.onDrag(draggerHandler.dragger, hit);
          }
        }
      }

      if (draggerHandler.dragger.vertical) {
        var dy = event.endPosition.y - event.startPosition.y;
        var position = draggerHandler.dragger.position.getValue();
        var tangentPlane = new Cesium.EllipsoidTangentPlane(position);

        scratchBoundingSphere.center = position;
        scratchBoundingSphere.radius = 1;

        var metersPerPixel = that.viewer.scene.frameState.camera.getPixelSize(
          scratchBoundingSphere,
          that.viewer.scene.frameState.context.drawingBufferWidth,
          that.viewer.scene.frameState.context.drawingBufferHeight
        );

        var zOffset = new Cesium.Cartesian3();

        Cesium.Cartesian3.multiplyByScalar(
          tangentPlane.zAxis,
          -dy * metersPerPixel,
          zOffset
        );
        var newPosition = Cesium.Cartesian3.clone(position);
        Cesium.Cartesian3.add(position, zOffset, newPosition);

        draggerHandler.dragger.position = newPosition;
        if (draggerHandler.dragger.onDrag) {
          draggerHandler.dragger.onDrag(draggerHandler.dragger, newPosition);
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  var scratchBoundingSphere = new Cesium.BoundingSphere();

  // Mouse move drags the draggers and calls their onDrag callback.
  draggerHandler.setInputAction(
    function (event) {
      if (draggerHandler.dragger && draggerHandler.dragger.verticalCtrl) {
        var dy = event.endPosition.y - event.startPosition.y;
        var position = draggerHandler.dragger.position.getValue();
        var tangentPlane = new Cesium.EllipsoidTangentPlane(position);

        scratchBoundingSphere.center = position;
        scratchBoundingSphere.radius = 1;

        var metersPerPixel = that.viewer.scene.frameState.camera.getPixelSize(
          scratchBoundingSphere,
          that.viewer.scene.frameState.context.drawingBufferWidth,
          that.viewer.scene.frameState.context.drawingBufferHeight
        );

        var zOffset = new Cesium.Cartesian3();

        Cesium.Cartesian3.multiplyByScalar(
          tangentPlane.zAxis,
          -dy * metersPerPixel,
          zOffset
        );
        var newPosition = Cesium.Cartesian3.clone(position);
        Cesium.Cartesian3.add(position, zOffset, newPosition);

        draggerHandler.dragger.position = newPosition;
        if (draggerHandler.dragger.onDrag) {
          draggerHandler.dragger.onDrag(draggerHandler.dragger, newPosition);
        }
      }
    },
    Cesium.ScreenSpaceEventType.MOUSE_MOVE,
    Cesium.KeyboardEventModifier.CTRL
  );

  // Left up stops dragging.
  draggerHandler.setInputAction(function () {
    if (draggerHandler.dragger) {
      if (draggerHandler.dragger.billboard) {
        draggerHandler.dragger.billboard.scale._value =
          draggerHandler.dragger.billboard.scale_src;
      }

      draggerHandler.dragger = null;
      that.viewer.scene.screenSpaceCameraController.enableRotate = true;
      that.viewer.scene.screenSpaceCameraController.enableTilt = true;
      that.viewer.scene.screenSpaceCameraController.enableTranslate = true;
      that.viewer.scene.screenSpaceCameraController.enableInputs = true;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_UP);

  // Left up stops dragging.
  draggerHandler.setInputAction(
    function () {
      if (draggerHandler.dragger) {
        if (draggerHandler.dragger.billboard) {
          draggerHandler.dragger.billboard.scale._value =
            draggerHandler.dragger.billboard.scale_src;
        }

        draggerHandler.dragger = null;
        that.viewer.scene.screenSpaceCameraController.enableRotate = true;
        that.viewer.scene.screenSpaceCameraController.enableTilt = true;
        that.viewer.scene.screenSpaceCameraController.enableTranslate = true;
        that.viewer.scene.screenSpaceCameraController.enableInputs = true;
      }
    },
    Cesium.ScreenSpaceEventType.LEFT_UP,
    Cesium.KeyboardEventModifier.CTRL
  );

  this.draggerHandler = draggerHandler;
};

/**
 * 【编辑】 释放编辑相关事件
 */
EventControl.prototype.destroyEditHandler = function () {
  if (this.selectHandler) {
    this.selectHandler.destroy();
    this.selectHandler = null;
  }

  if (this.draggerHandler) {
    this.draggerHandler.destroy();
    this.draggerHandler = null;
  }
};

function getCurrentMousePosition(scene, position, noPickEntity) {
  var cartesian;

  //在模型上提取坐标
  var pickedObject = scene.pick(position);
  if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
    //pickPositionSupported :判断是否支持深度拾取,不支持时无法进行鼠标交互绘制

    if (
      noPickEntity == null ||
      (noPickEntity &&
        pickedObject.id !== noPickEntity &&
        pickedObject.primitive !== noPickEntity)
    ) {
      var cartesian = scene.pickPosition(position);
      if (Cesium.defined(cartesian)) {
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var height = cartographic.height; //模型高度
        if (height >= 0) return cartesian;

        //不是entity时，支持3dtiles地下
        if (!Cesium.defined(pickedObject.id) && height >= -500)
          return cartesian;
      }
    }
  }

  //测试scene.pickPosition和globe.pick的适用场景 https://zhuanlan.zhihu.com/p/44767866
  //1. globe.pick的结果相对稳定准确，不论地形深度检测开启与否，不论加载的是默认地形还是别的地形数据；
  //2. scene.pickPosition只有在开启地形深度检测，且不使用默认地形时是准确的。
  //注意点： 1. globe.pick只能求交地形； 2. scene.pickPosition不仅可以求交地形，还可以求交除地形以外其他所有写深度的物体。

  //提取鼠标点的地理坐标
  if (scene.mode === Cesium.SceneMode.SCENE3D) {
    //三维模式下
    var pickRay = scene.camera.getPickRay(position);
    cartesian = scene.globe.pick(pickRay, scene);
  } else {
    //二维模式下
    cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid);
  }
  return cartesian;
}

//提取地球中心点坐标
function getCenter(viewer, isToWgs) {
  var scene = viewer.scene;
  var target = pickCenterPoint(scene);
  var bestTarget = target;
  if (!bestTarget) {
    var globe = scene.globe;
    var carto = scene.camera.positionCartographic.clone();
    var height = globe.getHeight(carto);
    carto.height = height || 0;
    bestTarget = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);
  }

  var result = formatPositon(bestTarget);
  if (isToWgs) result = viewer.mars.point2wgs(result); //坐标转换为wgs

  // 获取地球中心点世界位置  与  摄像机的世界位置  之间的距离
  var distance = Cesium.Cartesian3.distance(
    bestTarget,
    viewer.scene.camera.positionWC
  );
  result.cameraZ = distance;

  return result;
}

function pickCenterPoint(scene) {
  var canvas = scene.canvas;
  var center = new Cesium.Cartesian2(
    canvas.clientWidth / 2,
    canvas.clientHeight / 2
  );

  var ray = scene.camera.getPickRay(center);
  var target = scene.globe.pick(ray, scene);
  return target || scene.camera.pickEllipsoid(center);
}
//格式化 数字 小数位数
function formatNum(num, digits) {
  //var pow = Math.pow(10, (digits === undefined ? 6 : digits));
  //return Math.round(num * pow) / pow;
  return Number(num.toFixed(digits || 0));
}

//格式化坐标点为可显示的可理解格式（如：经度x:123.345345、纬度y:31.324324、高度z:123.1）。
function formatPositon(position) {
  var carto = Cesium.Cartographic.fromCartesian(position);
  var result = {};
  result.y = formatNum(Cesium.Math.toDegrees(carto.latitude), 6);
  result.x = formatNum(Cesium.Math.toDegrees(carto.longitude), 6);
  result.z = formatNum(carto.height, 2);
  return result;
}

//计算贴地路线
function terrainPolyline(params) {
  var viewer = params.viewer;
  var positions = params.positions;
  if (positions == null || positions.length == 0) {
    if (params.calback) params.calback(positions);
    return;
  }

  var flatPositions = Cesium.PolylinePipeline.generateArc({
    positions: positions,
    granularity: params.granularity || 0.00001,
  });

  var cartographicArray = [];
  var ellipsoid = viewer.scene.globe.ellipsoid;
  for (var i = 0; i < flatPositions.length; i += 3) {
    var cartesian = Cesium.Cartesian3.unpack(flatPositions, i);
    cartographicArray.push(ellipsoid.cartesianToCartographic(cartesian));
  }

  //用于缺少地形数据时，赋值的高度
  var tempHeight = Cesium.Cartographic.fromCartesian(positions[0]).height;

  Cesium.sampleTerrainMostDetailed(
    viewer.terrainProvider,
    cartographicArray
  ).then((samples) => {
    var noHeight = false;
    var offset = params.offset || 2; //增高高度，便于可视

    for (var i = 0; i < samples.length; ++i) {
      if (samples[i].height == null) {
        noHeight = true;
        samples[i].height = tempHeight;
      } else {
        samples[i].height =
          offset + samples[i].height * viewer.scene._terrainExaggeration;
      }
    }

    var raisedPositions = ellipsoid.cartographicArrayToCartesianArray(samples);
    if (params.calback) params.calback(raisedPositions, noHeight);
    else if (positions.setValue) positions.setValue(raisedPositions);
  });
}

function areas(geojson) {
  return geomReduce(
    geojson,
    function (value, geom) {
      return value + calculateArea(geom);
    },
    0
  );
}
function calculateArea(geojson) {
  var area = 0,
    i;
  switch (geojson.type) {
    case "Polygon":
      return polygonArea(geojson.coordinates);
    case "MultiPolygon":
      for (i = 0; i < geojson.coordinates.length; i++) {
        area += polygonArea(geojson.coordinates[i]);
      }
      return area;
    case "Point":
    case "MultiPoint":
    case "LineString":
    case "MultiLineString":
      return 0;
    case "GeometryCollection":
      for (i = 0; i < geojson.geometries.length; i++) {
        area += calculateArea(geojson.geometries[i]);
      }
      return area;
  }
}
function polygonArea(coords) {
  var area = 0;
  if (coords && coords.length > 0) {
    area += Math.abs(ringArea(coords[0]));
    for (var i = 1; i < coords.length; i++) {
      area -= Math.abs(ringArea(coords[i]));
    }
  }
  return area;
}
var RADIUS = 6378137;
function ringArea(coords) {
  var p1;
  var p2;
  var p3;
  var lowerIndex;
  var middleIndex;
  var upperIndex;
  var i;
  var area = 0;
  var coordsLength = coords.length;

  if (coordsLength > 2) {
    for (i = 0; i < coordsLength; i++) {
      if (i === coordsLength - 2) {
        // i = N-2
        lowerIndex = coordsLength - 2;
        middleIndex = coordsLength - 1;
        upperIndex = 0;
      } else if (i === coordsLength - 1) {
        // i = N-1
        lowerIndex = coordsLength - 1;
        middleIndex = 0;
        upperIndex = 1;
      } else {
        // i = 0 to N-3
        lowerIndex = i;
        middleIndex = i + 1;
        upperIndex = i + 2;
      }
      p1 = coords[lowerIndex];
      p2 = coords[middleIndex];
      p3 = coords[upperIndex];
      area += (rad(p3[0]) - rad(p1[0])) * Math.sin(rad(p2[1]));
    }

    area = (area * RADIUS * RADIUS) / 2;
  }

  return area;
}

function rad(_) {
  return (_ * Math.PI) / 180;
}
function geomReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  geomEach(
    geojson,
    function (
      currentGeometry,
      featureIndex,
      featureProperties,
      featureBBox,
      featureId
    ) {
      if (featureIndex === 0 && initialValue === undefined)
        previousValue = currentGeometry;
      else
        previousValue = callback(
          previousValue,
          currentGeometry,
          featureIndex,
          featureProperties,
          featureBBox,
          featureId
        );
    }
  );
  return previousValue;
}
function geomEach(geojson, callback) {
  var i,
    j,
    g,
    geometry$$1,
    stopG,
    geometryMaybeCollection,
    isGeometryCollection,
    featureProperties,
    featureBBox,
    featureId,
    featureIndex = 0,
    isFeatureCollection = geojson.type === "FeatureCollection",
    isFeature = geojson.type === "Feature",
    stop = isFeatureCollection ? geojson.features.length : 1;

  // This logic may look a little weird. The reason why it is that way
  // is because it's trying to be fast. GeoJSON supports multiple kinds
  // of objects at its root: FeatureCollection, Features, Geometries.
  // This function has the responsibility of handling all of them, and that
  // means that some of the `for` loops you see below actually just don't apply
  // to certain inputs. For instance, if you give this just a
  // Point geometry, then both loops are short-circuited and all we do
  // is gradually rename the input until it's called 'geometry'.
  //
  // This also aims to allocate as few resources as possible: just a
  // few numbers and booleans, rather than any temporary arrays as would
  // be required with the normalization approach.
  for (i = 0; i < stop; i++) {
    geometryMaybeCollection = isFeatureCollection
      ? geojson.features[i].geometry
      : isFeature
      ? geojson.geometry
      : geojson;
    featureProperties = isFeatureCollection
      ? geojson.features[i].properties
      : isFeature
      ? geojson.properties
      : {};
    featureBBox = isFeatureCollection
      ? geojson.features[i].bbox
      : isFeature
      ? geojson.bbox
      : undefined;
    featureId = isFeatureCollection
      ? geojson.features[i].id
      : isFeature
      ? geojson.id
      : undefined;
    isGeometryCollection = geometryMaybeCollection
      ? geometryMaybeCollection.type === "GeometryCollection"
      : false;
    stopG = isGeometryCollection
      ? geometryMaybeCollection.geometries.length
      : 1;

    for (g = 0; g < stopG; g++) {
      geometry$$1 = isGeometryCollection
        ? geometryMaybeCollection.geometries[g]
        : geometryMaybeCollection;

      // Handle null Geometry
      if (geometry$$1 === null) {
        callback(null, featureIndex, featureProperties, featureBBox, featureId);
        continue;
      }
      switch (geometry$$1.type) {
        case "Point":
        case "LineString":
        case "MultiPoint":
        case "Polygon":
        case "MultiLineString":
        case "MultiPolygon": {
          callback(
            geometry$$1,
            featureIndex,
            featureProperties,
            featureBBox,
            featureId
          );
          break;
        }
        case "GeometryCollection": {
          for (j = 0; j < geometry$$1.geometries.length; j++) {
            callback(
              geometry$$1.geometries[j],
              featureIndex,
              featureProperties,
              featureBBox,
              featureId
            );
          }
          break;
        }
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
    // Only increase `featureIndex` per each feature
    featureIndex++;
  }
}
function rhumbBearing(start, end, options) {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var final = options.final;

  // validation
  if (!start) throw new Error("start point is required");
  if (!end) throw new Error("end point is required");

  var bear360;

  if (final) bear360 = calculateRhumbBearing(getCoord(end), getCoord(start));
  else bear360 = calculateRhumbBearing(getCoord(start), getCoord(end));

  var bear180 = bear360 > 180 ? -(360 - bear360) : bear360;

  return bear180;
}
function destination(origin, distance, bearing, options) {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var units = options.units;
  var properties = options.properties;

  // Handle input
  var coordinates1 = getCoord(origin);
  var longitude1 = degreesToRadians(coordinates1[0]);
  var latitude1 = degreesToRadians(coordinates1[1]);
  var bearing_rad = degreesToRadians(bearing);
  var radians = lengthToRadians(distance, units);

  // Main
  var latitude2 = Math.asin(
    Math.sin(latitude1) * Math.cos(radians) +
      Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearing_rad)
  );
  var longitude2 =
    longitude1 +
    Math.atan2(
      Math.sin(bearing_rad) * Math.sin(radians) * Math.cos(latitude1),
      Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2)
    );
  var lng = radiansToDegrees(longitude2);
  var lat = radiansToDegrees(latitude2);

  return point([lng, lat], properties);
}
var earthRadius = 6371008.8;
var factors = {
  meters: earthRadius,
  metres: earthRadius,
  millimeters: earthRadius * 1000,
  millimetres: earthRadius * 1000,
  centimeters: earthRadius * 100,
  centimetres: earthRadius * 100,
  kilometers: earthRadius / 1000,
  kilometres: earthRadius / 1000,
  miles: earthRadius / 1609.344,
  nauticalmiles: earthRadius / 1852,
  inches: earthRadius * 39.37,
  yards: earthRadius / 1.0936,
  feet: earthRadius * 3.28084,
  radians: 1,
  degrees: earthRadius / 111325,
};
function lengthToRadians(distance, units) {
  if (distance === undefined || distance === null)
    throw new Error("distance is required");

  if (units && typeof units !== "string")
    throw new Error("units must be a string");
  var factor = factors[units || "kilometers"];
  if (!factor) throw new Error(units + " units is invalid");
  return distance / factor;
}
function calculateRhumbBearing(from, to) {
  // φ => phi
  // Δλ => deltaLambda
  // Δψ => deltaPsi
  // θ => theta
  var phi1 = degreesToRadians(from[1]);
  var phi2 = degreesToRadians(to[1]);
  var deltaLambda = degreesToRadians(to[0] - from[0]);
  // if deltaLambdaon over 180° take shorter rhumb line across the anti-meridian:
  if (deltaLambda > Math.PI) deltaLambda -= 2 * Math.PI;
  if (deltaLambda < -Math.PI) deltaLambda += 2 * Math.PI;

  var deltaPsi = Math.log(
    Math.tan(phi2 / 2 + Math.PI / 4) / Math.tan(phi1 / 2 + Math.PI / 4)
  );

  var theta = Math.atan2(deltaLambda, deltaPsi);

  return (radiansToDegrees(theta) + 360) % 360;
}
function radiansToDegrees(radians) {
  if (radians === null || radians === undefined)
    throw new Error("radians is required");

  var degrees = radians % (2 * Math.PI);
  return (degrees * 180) / Math.PI;
}
function degreesToRadians(degrees) {
  if (degrees === null || degrees === undefined)
    throw new Error("degrees is required");

  var radians = degrees % 360;
  return (radians * Math.PI) / 180;
}
function getCoord(obj) {
  if (!obj) throw new Error("obj is required");

  var coordinates = getCoords(obj);

  // getCoord() must contain at least two numbers (Point)
  if (
    coordinates.length > 1 &&
    isNumber(coordinates[0]) &&
    isNumber(coordinates[1])
  ) {
    return coordinates;
  } else {
    throw new Error("Coordinate is not a valid Point");
  }
}
function getCoords(obj) {
  if (!obj) throw new Error("obj is required");
  var coordinates;

  // Array of numbers
  if (obj.length) {
    coordinates = obj;

    // Geometry Object
  } else if (obj.coordinates) {
    coordinates = obj.coordinates;

    // Feature
  } else if (obj.geometry && obj.geometry.coordinates) {
    coordinates = obj.geometry.coordinates;
  }
  // Checks if coordinates contains a number
  if (coordinates) {
    containsNumber(coordinates);
    return coordinates;
  }
  throw new Error("No valid coordinates");
}
function containsNumber(coordinates) {
  if (
    coordinates.length > 1 &&
    isNumber(coordinates[0]) &&
    isNumber(coordinates[1])
  ) {
    return true;
  }

  if (Array.isArray(coordinates[0]) && coordinates[0].length) {
    return containsNumber(coordinates[0]);
  }
  throw new Error("coordinates must only contain numbers");
}
function points(coordinates, properties, options) {
  if (!coordinates) throw new Error("coordinates is required");
  if (!Array.isArray(coordinates))
    throw new Error("coordinates must be an Array");

  return featureCollection(
    coordinates.map(function (coords) {
      return point(coords, properties);
    }),
    options
  );
}
function point(coordinates, properties, options) {
  if (!coordinates) throw new Error("coordinates is required");
  if (!Array.isArray(coordinates))
    throw new Error("coordinates must be an Array");
  if (coordinates.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!isNumber(coordinates[0]) || !isNumber(coordinates[1]))
    throw new Error("coordinates must contain numbers");

  return feature(
    {
      type: "Point",
      coordinates: coordinates,
    },
    properties,
    options
  );
}
function isNumber(num) {
  return !isNaN(num) && num !== null && !Array.isArray(num);
}
function isObject(input) {
  return !!input && input.constructor === Object;
}
function feature(geometry, properties, options) {
  // Optional Parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var bbox = options.bbox;
  var id = options.id;

  // Validation
  if (geometry === undefined) throw new Error("geometry is required");
  if (properties && properties.constructor !== Object)
    throw new Error("properties must be an Object");
  if (bbox) validateBBox(bbox);
  if (id) validateId(id);

  // Main
  var feat = { type: "Feature" };
  if (id) feat.id = id;
  if (bbox) feat.bbox = bbox;
  feat.properties = properties || {};
  feat.geometry = geometry;
  return feat;
}
function featureCollection(features, options) {
  // Optional Parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var bbox = options.bbox;
  var id = options.id;

  // Validation
  if (!features) throw new Error("No features passed");
  if (!Array.isArray(features)) throw new Error("features must be an Array");
  if (bbox) validateBBox(bbox);
  if (id) validateId(id);

  // Main
  var fc = { type: "FeatureCollection" };
  if (id) fc.id = id;
  if (bbox) fc.bbox = bbox;
  fc.features = features;
  return fc;
}
function validateId(id) {
  if (!id) throw new Error("id is required");
  if (["string", "number"].indexOf(typeof id) === -1)
    throw new Error("id must be a number or a string");
}
function validateBBox(bbox) {
  if (!bbox) throw new Error("bbox is required");
  if (!Array.isArray(bbox)) throw new Error("bbox must be an Array");
  if (bbox.length !== 4 && bbox.length !== 6)
    throw new Error("bbox must be an Array of 4 or 6 numbers");
  bbox.forEach(function (num) {
    if (!isNumber(num)) throw new Error("bbox must only contain numbers");
  });
}

function getType(geojson, name) {
  if (!geojson) throw new Error((name || "geojson") + " is required");
  // GeoJSON Feature & GeometryCollection
  if (geojson.geometry && geojson.geometry.type) return geojson.geometry.type;
  // GeoJSON Geometry & FeatureCollection
  if (geojson.type) return geojson.type;
  throw new Error((name || "geojson") + " is invalid");
}
function coordEach(geojson, callback, excludeWrapCoord) {
  // Handles null Geometry -- Skips this GeoJSON
  if (geojson === null) return;
  var j,
    k,
    l,
    geometry$$1,
    stopG,
    coords,
    geometryMaybeCollection,
    wrapShrink = 0,
    coordIndex = 0,
    isGeometryCollection,
    type = geojson.type,
    isFeatureCollection = type === "FeatureCollection",
    isFeature = type === "Feature",
    stop = isFeatureCollection ? geojson.features.length : 1;

  // This logic may look a little weird. The reason why it is that way
  // is because it's trying to be fast. GeoJSON supports multiple kinds
  // of objects at its root: FeatureCollection, Features, Geometries.
  // This function has the responsibility of handling all of them, and that
  // means that some of the `for` loops you see below actually just don't apply
  // to certain inputs. For instance, if you give this just a
  // Point geometry, then both loops are short-circuited and all we do
  // is gradually rename the input until it's called 'geometry'.
  //
  // This also aims to allocate as few resources as possible: just a
  // few numbers and booleans, rather than any temporary arrays as would
  // be required with the normalization approach.
  for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
    geometryMaybeCollection = isFeatureCollection
      ? geojson.features[featureIndex].geometry
      : isFeature
      ? geojson.geometry
      : geojson;
    isGeometryCollection = geometryMaybeCollection
      ? geometryMaybeCollection.type === "GeometryCollection"
      : false;
    stopG = isGeometryCollection
      ? geometryMaybeCollection.geometries.length
      : 1;

    for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
      var multiFeatureIndex = 0;
      var geometryIndex = 0;
      geometry$$1 = isGeometryCollection
        ? geometryMaybeCollection.geometries[geomIndex]
        : geometryMaybeCollection;

      // Handles null Geometry -- Skips this geometry
      if (geometry$$1 === null) continue;
      coords = geometry$$1.coordinates;
      var geomType = geometry$$1.type;

      wrapShrink =
        excludeWrapCoord &&
        (geomType === "Polygon" || geomType === "MultiPolygon")
          ? 1
          : 0;

      switch (geomType) {
        case null:
          break;
        case "Point":
          callback(
            coords,
            coordIndex,
            featureIndex,
            multiFeatureIndex,
            geometryIndex
          );
          coordIndex++;
          multiFeatureIndex++;
          break;
        case "LineString":
        case "MultiPoint":
          for (j = 0; j < coords.length; j++) {
            callback(
              coords[j],
              coordIndex,
              featureIndex,
              multiFeatureIndex,
              geometryIndex
            );
            coordIndex++;
            if (geomType === "MultiPoint") multiFeatureIndex++;
          }
          if (geomType === "LineString") multiFeatureIndex++;
          break;
        case "Polygon":
        case "MultiLineString":
          for (j = 0; j < coords.length; j++) {
            for (k = 0; k < coords[j].length - wrapShrink; k++) {
              callback(
                coords[j][k],
                coordIndex,
                featureIndex,
                multiFeatureIndex,
                geometryIndex
              );
              coordIndex++;
            }
            if (geomType === "MultiLineString") multiFeatureIndex++;
            if (geomType === "Polygon") geometryIndex++;
          }
          if (geomType === "Polygon") multiFeatureIndex++;
          break;
        case "MultiPolygon":
          for (j = 0; j < coords.length; j++) {
            if (geomType === "MultiPolygon") geometryIndex = 0;
            for (k = 0; k < coords[j].length; k++) {
              for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                callback(
                  coords[j][k][l],
                  coordIndex,
                  featureIndex,
                  multiFeatureIndex,
                  geometryIndex
                );
                coordIndex++;
              }
              geometryIndex++;
            }
            multiFeatureIndex++;
          }
          break;
        case "GeometryCollection":
          for (j = 0; j < geometry$$1.geometries.length; j++)
            coordEach(geometry$$1.geometries[j], callback, excludeWrapCoord);
          break;
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
  }
}
function centroid(geojson, properties) {
  var xSum = 0;
  var ySum = 0;
  var len = 0;
  coordEach(
    geojson,
    function (coord) {
      xSum += coord[0];
      ySum += coord[1];
      len++;
    },
    true
  );
  return point([xSum / len, ySum / len], properties);
}
function centerOfMass(geojson, properties) {
  switch (getType(geojson)) {
    case "Point":
      return geojson;
    case "Polygon":
      var coords = [];
      coordEach(geojson, function (coord) {
        coords.push(coord);
      });

      // First, we neutralize the feature (set it around coordinates [0,0]) to prevent rounding errors
      // We take any point to translate all the points around 0
      var centre = centroid(geojson, properties);
      var translation = centre.geometry.coordinates;
      var sx = 0;
      var sy = 0;
      var sArea = 0;
      var i, pi, pj, xi, xj, yi, yj, a;

      var neutralizedPoints = coords.map(function (point$$1) {
        return [point$$1[0] - translation[0], point$$1[1] - translation[1]];
      });

      for (i = 0; i < coords.length - 1; i++) {
        // pi is the current point
        pi = neutralizedPoints[i];
        xi = pi[0];
        yi = pi[1];

        // pj is the next point (pi+1)
        pj = neutralizedPoints[i + 1];
        xj = pj[0];
        yj = pj[1];

        // a is the common factor to compute the signed area and the final coordinates
        a = xi * yj - xj * yi;

        // sArea is the sum used to compute the signed area
        sArea += a;

        // sx and sy are the sums used to compute the final coordinates
        sx += (xi + xj) * a;
        sy += (yi + yj) * a;
      }

      // Shape has no area: fallback on turf.centroid
      if (sArea === 0) {
        return centre;
      } else {
        // Compute the signed area, and factorize 1/6A
        var area = sArea * 0.5;
        var areaFactor = 1 / (6 * area);

        // Compute the final coordinates, adding back the values that have been neutralized
        return point(
          [translation[0] + areaFactor * sx, translation[1] + areaFactor * sy],
          properties
        );
      }
    default:
      // Not a polygon: Compute the convex hull and work with that
      var hull = convex(geojson);

      if (hull) return centerOfMass(hull, properties);
      // Hull is empty: fallback on the centroid
      else return centroid(geojson, properties);
  }
}
function convex(geojson, options) {
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var concavity = options.concavity || Infinity;
  var points$$1 = [];

  // Convert all points to flat 2D coordinate Array
  coordEach(geojson, function (coord) {
    points$$1.push([coord[0], coord[1]]);
  });
  if (!points$$1.length) return null;

  var convexHull = concaveman(points$$1, concavity);

  // Convex hull should have at least 3 different vertices in order to create a valid polygon
  if (convexHull.length > 3) {
    return polygon([convexHull]);
  }
  return null;
}
function fastConvexHull(points) {
  var left = points[0];
  var top = points[0];
  var right = points[0];
  var bottom = points[0];

  // find the leftmost, rightmost, topmost and bottommost points
  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    if (p[0] < left[0]) left = p;
    if (p[0] > right[0]) right = p;
    if (p[1] < top[1]) top = p;
    if (p[1] > bottom[1]) bottom = p;
  }

  // filter out points that are inside the resulting quadrilateral
  var cull = [left, top, right, bottom];
  var filtered = cull.slice();
  for (i = 0; i < points.length; i++) {
    if (!pointInPolygon(points[i], cull)) filtered.push(points[i]);
  }

  // get convex hull around the filtered points
  var indices = monotoneConvexHull2d(filtered);

  // return the hull as array of points (rather than indices)
  var hull = [];
  for (i = 0; i < indices.length; i++) hull.push(filtered[indices[i]]);
  return hull;
}

function concaveman(points, concavity, lengthThreshold) {
  // a relative measure of concavity; higher value means simpler hull
  concavity = Math.max(0, concavity === undefined ? 2 : concavity);

  // when a segment goes below this length threshold, it won't be drilled down further
  lengthThreshold = lengthThreshold || 0;

  // start with a convex hull of the points
  var hull = fastConvexHull(points);

  // index the points with an R-tree
  var tree = rbush_1(16, ["[0]", "[1]", "[0]", "[1]"]).load(points);

  // turn the convex hull into a linked list and populate the initial edge queue with the nodes
  var queue = [];
  for (var i = 0, last; i < hull.length; i++) {
    var p = hull[i];
    tree.remove(p);
    last = insertNode(p, last);
    queue.push(last);
  }

  // index the segments with an R-tree (for intersection checks)
  var segTree = rbush_1(16);
  for (i = 0; i < queue.length; i++) segTree.insert(updateBBox(queue[i]));

  var sqConcavity = concavity * concavity;
  var sqLenThreshold = lengthThreshold * lengthThreshold;

  // process edges one by one
  while (queue.length) {
    var node = queue.shift();
    var a = node.p;
    var b = node.next.p;

    // skip the edge if it's already short enough
    var sqLen = getSqDist(a, b);
    if (sqLen < sqLenThreshold) continue;

    var maxSqLen = sqLen / sqConcavity;

    // find the best connection point for the current edge to flex inward to
    p = findCandidate(
      tree,
      node.prev.p,
      a,
      b,
      node.next.next.p,
      maxSqLen,
      segTree
    );

    // if we found a connection and it satisfies our concavity measure
    if (p && Math.min(getSqDist(p, a), getSqDist(p, b)) <= maxSqLen) {
      // connect the edge endpoints through this point and add 2 new edges to the queue
      queue.push(node);
      queue.push(insertNode(p, node));

      // update point and segment indexes
      tree.remove(p);
      segTree.remove(node);
      segTree.insert(updateBBox(node));
      segTree.insert(updateBBox(node.next));
    }
  }

  // convert the resulting hull linked list to an array of points
  node = last;
  var concave = [];
  do {
    concave.push(node.p);
    node = node.next;
  } while (node !== last);

  concave.push(node.p);

  return concave;
}
// 键盘控制
let cameraFunc;
export function bind(viewer) {
  var scene = viewer.scene;
  var canvas = viewer.canvas;
  canvas.setAttribute("tabindex", "0"); // needed to put focus on the canvas
  canvas.onclick = function () {
    canvas.focus();
  };
  var ellipsoid = scene.globe.ellipsoid;

  // disable the default event handlers
  scene.screenSpaceCameraController.enableRotate = false;
  scene.screenSpaceCameraController.enableTranslate = false;
  scene.screenSpaceCameraController.enableZoom = false;
  scene.screenSpaceCameraController.enableTilt = false;
  scene.screenSpaceCameraController.enableLook = false;

  var startMousePosition;
  var mousePosition;
  var flags = {
    looking: false,
    moveForward: false,
    moveBackward: false,
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false,
  };

  var speedRatio = 100;

  var handler = new Cesium.ScreenSpaceEventHandler(canvas);

  handler.setInputAction(function (movement) {
    flags.looking = true;
    mousePosition = startMousePosition = Cesium.Cartesian3.clone(
      movement.position
    );
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

  handler.setInputAction(function (movement) {
    mousePosition = movement.endPosition;
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(function (position) {
    flags.looking = false;
  }, Cesium.ScreenSpaceEventType.LEFT_UP);

  handler.setInputAction(function (delta) {
    if (delta > 0) {
      speedRatio = speedRatio * 0.8;
    } else {
      speedRatio = speedRatio * 1.2;
    }
  }, Cesium.ScreenSpaceEventType.WHEEL);

  function getFlagForKeyCode(keyCode) {
    switch (keyCode) {
      case 38: //镜头前进
      case "W".charCodeAt(0):
        return "moveForward";
      case "S".charCodeAt(0):
      case 40:
        //镜头后退
        return "moveBackward";
      case "D".charCodeAt(0):
      case 39:
        //向右平移镜头
        return "moveRight";
      case "A".charCodeAt(0):
      case 37:
        //向左平移镜头
        return "moveLeft";
      case "Q".charCodeAt(0):
        return "moveUp";
      case "E".charCodeAt(0):
        return "moveDown";
      default:
        return undefined;
    }
  }

  document.addEventListener(
    "keydown",
    function (e) {
      var flagName = getFlagForKeyCode(e.keyCode);
      if (typeof flagName !== "undefined") {
        flags[flagName] = true;
      }
    },
    false
  );

  document.addEventListener(
    "keyup",
    function (e) {
      var flagName = getFlagForKeyCode(e.keyCode);
      if (typeof flagName !== "undefined") {
        flags[flagName] = false;
      }
    },
    false
  );

  function moveForward(distance) {
    //和模型的相机移动不太一样  不是沿着相机目标方向，而是默认向上方向 和 向右 方向的插值方向
    var camera = viewer.camera;
    var direction = camera.direction;
    //获得此位置默认的向上方向
    var up = Cesium.Cartesian3.normalize(
      camera.position,
      new Cesium.Cartesian3()
    );

    // right = direction * up
    var right = Cesium.Cartesian3.cross(direction, up, new Cesium.Cartesian3());

    direction = Cesium.Cartesian3.cross(up, right, new Cesium.Cartesian3());

    direction = Cesium.Cartesian3.normalize(direction, direction);
    direction = Cesium.Cartesian3.multiplyByScalar(
      direction,
      distance,
      direction
    );

    camera.position = Cesium.Cartesian3.add(
      camera.position,
      direction,
      camera.position
    );
  }

  cameraFunc = function cameraFunc(clock) {
    var camera = viewer.camera;

    if (flags.looking) {
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;

      // Coordinate (0.0, 0.0) will be where the mouse was clicked.
      var x = (mousePosition.x - startMousePosition.x) / width;
      var y = -(mousePosition.y - startMousePosition.y) / height;

      //这计算了，分别向右 和 向上移动的
      var lookFactor = 0.05;
      camera.lookRight(x * lookFactor);
      camera.lookUp(y * lookFactor);

      //获得direction 方向
      var direction = camera.direction;
      //获得此位置默认的向上方向
      var up = Cesium.Cartesian3.normalize(
        camera.position,
        new Cesium.Cartesian3()
      );

      // right = direction * up
      var right = Cesium.Cartesian3.cross(
        direction,
        up,
        new Cesium.Cartesian3()
      );
      // up = right * direction
      up = Cesium.Cartesian3.cross(right, direction, new Cesium.Cartesian3());

      camera.up = up;
      camera.right = right;
    }

    // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
    var cameraHeight = ellipsoid.cartesianToCartographic(
      camera.position
    ).height;
    var moveRate = cameraHeight / speedRatio;

    if (flags.moveForward) {
      moveForward(moveRate);
    }
    if (flags.moveBackward) {
      moveForward(-moveRate);
    }
    if (flags.moveUp) {
      camera.moveUp(moveRate);
    }
    if (flags.moveDown) {
      camera.moveDown(moveRate);
    }
    if (flags.moveLeft) {
      camera.moveLeft(moveRate);
    }
    if (flags.moveRight) {
      camera.moveRight(moveRate);
    }
  };

  viewer.clock.onTick.addEventListener(cameraFunc);
}

export function unbind(viewer) {
  var scene = viewer.scene;
  scene.screenSpaceCameraController.enableRotate = true;
  scene.screenSpaceCameraController.enableTranslate = true;
  scene.screenSpaceCameraController.enableZoom = true;
  scene.screenSpaceCameraController.enableTilt = true;
  scene.screenSpaceCameraController.enableLook = true;

  if (cameraFunc) {
    viewer.clock.onTick.removeEventListener(cameraFunc);
    cameraFunc = undefined;
  }
}
var util = {
  _interopRequireDefault: function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  },

  isNumber: function isNumber(obj) {
    return typeof obj == "number" && obj.constructor == Number;
  },

  isString: function isString(str) {
    return typeof str == "string" && str.constructor == String;
  },

  alert: function alert(msg, title) {
    if (window.haoutil && window.haoutil.alert)
      //此方法需要引用haoutil
      window.haoutil.alert(msg);
    else if (window.layer)
      //此方法需要引用layer.js
      layer.alert(msg, {
        title: title || "提示",
        skin: "layui-layer-lan layer-mars-dialog",
        closeBtn: 0,
        anim: 0,
      });
    else alert(msg);
  },

  msg: function msg(msg) {
    if (window.haoutil && window.haoutil.msg)
      //此方法需要引用haoutil
      window.haoutil.msg(msg);
    else if (window.toastr)
      //此方法需要引用toastr
      toastr.info(msg);
    else if (window.layer) layer.msg(msg); //此方法需要引用layer.js
    else alert(msg);
  },

  //url参数获取
  getRequest: function getRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  },
  getRequestByName: function getRequestByName(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  },

  clone: function clone(obj) {
    if (
      null == obj ||
      "object" != (typeof obj === "undefined" ? "undefined" : _typeof(obj))
    )
      return obj;

    // Handle Date
    if (obj instanceof Date) {
      var copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      var copy = [];
      for (var i = 0, len = obj.length; i < len; ++i) {
        copy[i] = clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (
      (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object"
    ) {
      var copy = {};
      for (var attr in obj) {
        if (attr == "_layer" || attr == "_layers" || attr == "_parent")
          continue;

        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
      }
      return copy;
    }
    return obj;
  },

  isPCBroswer: function isPCBroswer() {
    var sUserAgent = navigator.userAgent.toLowerCase();

    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone/i) == "iphone";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (
      bIsIpad ||
      bIsIphoneOs ||
      bIsMidp ||
      bIsUc7 ||
      bIsUc ||
      bIsAndroid ||
      bIsCE ||
      bIsWM
    ) {
      return false;
    } else {
      return true;
    }
  },

  //获取浏览器类型及版本
  getExplorerInfo: function getExplorerInfo() {
    var explorer = window.navigator.userAgent.toLowerCase();
    //ie
    if (explorer.indexOf("msie") >= 0) {
      var ver = Number(explorer.match(/msie ([\d]+)/)[1]);
      return { type: "IE", version: ver };
    }
    //firefox
    else if (explorer.indexOf("firefox") >= 0) {
      var ver = Number(explorer.match(/firefox\/([\d]+)/)[1]);
      return { type: "Firefox", version: ver };
    }
    //Chrome
    else if (explorer.indexOf("chrome") >= 0) {
      var ver = Number(explorer.match(/chrome\/([\d]+)/)[1]);
      return { type: "Chrome", version: ver };
    }
    //Opera
    else if (explorer.indexOf("opera") >= 0) {
      var ver = Number(explorer.match(/opera.([\d]+)/)[1]);
      return { type: "Opera", version: ver };
    }
    //Safari
    else if (explorer.indexOf("Safari") >= 0) {
      var ver = Number(explorer.match(/version\/([\d]+)/)[1]);
      return { type: "Safari", version: ver };
    }
    return { type: explorer, version: -1 };
  },

  //检测浏览器webgl支持
  webglreport: function webglreport() {
    var exinfo = getExplorerInfo();
    if (exinfo.type == "IE" && exinfo.version < 11) {
      return false;
    }

    try {
      var glContext;
      var canvas = document.createElement("canvas");
      var requestWebgl2 = typeof WebGL2RenderingContext !== "undefined";
      if (requestWebgl2) {
        glContext =
          canvas.getContext("webgl2") ||
          canvas.getContext("experimental-webgl2") ||
          undefined;
      }
      if (glContext == null) {
        glContext =
          canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl") ||
          undefined;
      }
      if (glContext == null) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  },

  //计算贴地路线
  terrainPolyline: function terrainPolyline(params) {
    var viewer = params.viewer;
    var positions = params.positions;
    if (positions == null || positions.length == 0) {
      if (params.calback) params.calback(positions);
      return;
    }

    var flatPositions = Cesium.PolylinePipeline.generateArc({
      positions: positions,
      granularity: params.granularity || 0.00001,
    });

    var cartographicArray = [];
    var ellipsoid = viewer.scene.globe.ellipsoid;
    for (var i = 0; i < flatPositions.length; i += 3) {
      var cartesian = Cesium.Cartesian3.unpack(flatPositions, i);
      cartographicArray.push(ellipsoid.cartesianToCartographic(cartesian));
    }

    //用于缺少地形数据时，赋值的高度
    var tempHeight = Cesium.Cartographic.fromCartesian(positions[0]).height;

    Cesium.sampleTerrainMostDetailed(
      viewer.terrainProvider,
      cartographicArray
    ).then((samples) => {
      var noHeight = false;
      var offset = params.offset || 2; //增高高度，便于可视

      for (var i = 0; i < samples.length; ++i) {
        if (samples[i].height == null) {
          noHeight = true;
          samples[i].height = tempHeight;
        } else {
          samples[i].height =
            offset + samples[i].height * viewer.scene._terrainExaggeration;
        }
      }

      var raisedPositions =
        ellipsoid.cartographicArrayToCartesianArray(samples);
      if (params.calback) params.calback(raisedPositions, noHeight);
      else if (positions.setValue) positions.setValue(raisedPositions);
    });
  },

  //地形构造
  _ellipsoid: new Cesium.EllipsoidTerrainProvider({
    ellipsoid: Cesium.Ellipsoid.WGS84,
  }),
  getEllipsoidTerrain: function getEllipsoidTerrain() {
    return _ellipsoid;
  },
  getTerrainProvider: function getTerrainProvider(cfg) {
    if (!cfg.hasOwnProperty("requestWaterMask")) cfg.requestWaterMask = true;
    if (!cfg.hasOwnProperty("requestVertexNormals"))
      cfg.requestVertexNormals = true;

    var terrainProvider;

    if (cfg.url == "" || cfg.url == null || cfg.url == "cesium") {
      terrainProvider = new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(1),
      });
    } else if (cfg.url == "ellipsoid" || cfg.url == "null") {
      terrainProvider = _ellipsoid;
    } else if (cfg.type == "gee") {
      //谷歌地球地形服务
      terrainProvider = new Cesium.GoogleEarthEnterpriseTerrainProvider({
        metadata: new Cesium.GoogleEarthEnterpriseMetadata(cfg),
      });
    } else {
      terrainProvider = new Cesium.CesiumTerrainProvider(cfg);
    }
    return terrainProvider;
  },

  //创建模型
  createModel: function createModel(cfg, viewer) {
    cfg = viewer.mars.point2map(cfg); //转换坐标系

    var position = Cesium.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0);

    var heading = Cesium.Math.toRadians(cfg.heading || 0);
    var pitch = Cesium.Math.toRadians(cfg.pitch || 0);
    var roll = Cesium.Math.toRadians(cfg.roll || 0);
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);

    var converter = cfg.converter || Cesium.Transforms.eastNorthUpToFixedFrame;
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr,
      viewer.scene.globe.ellipsoid,
      converter
    );

    var model = viewer.entities.add({
      name: cfg.name || "",
      position: position,
      orientation: orientation,
      model: cfg,
      tooltip: cfg.tooltip,
      popup: cfg.popup,
    });
    return model;
  },

  formatDegree: function formatDegree(value) {
    value = Math.abs(value);
    var v1 = Math.floor(value); //度
    var v2 = Math.floor((value - v1) * 60); //分
    var v3 = Math.round(((value - v1) * 3600) % 60); //秒
    return v1 + "° " + v2 + "'  " + v3 + '"';
  },

  checkToken: function checkToken(token) {
    var nowTime = new Date().getTime();
    var lastTime = Number(
      window.localStorage.getItem("tokenTime1987") || nowTime
    );
    var startTime = new Date(token.start).getTime();
    var endTime = new Date(token.end).getTime();

    if (
      (token.hostname &&
        window.location.hostname.indexOf(token.hostname) === -1) ||
      nowTime <= startTime ||
      nowTime >= endTime ||
      lastTime <= startTime ||
      lastTime >= endTime
    ) {
      if (window.layer)
        layer.open({
          type: 1,
          title: unescape("%u8BB8%u53EF%u5230%u671F%u63D0%u793A"), //"许可到期提示",
          skin: "layer-mars-dialog",
          shade: [1, "#000"],
          closeBtn: 0,
          resize: false,
          area: ["400px", "150px"], //宽高
          content: '<div style="margin: 20px;">' + token.msg + "</div>",
        });
      else alert(token.msg);
      return false;
    } else {
      window.localStorage.setItem("tokenTime1987", nowTime);
      setTimeout(function () {
        checkToken(token);
      }, 600000 + Math.random() * 600000); //随机10分钟-20分钟内再次校验
      return true;
    }
  },
};
function PolygonEditor(dataSource, entity, options) {
  // console.log(dataSource, entity, options)
  this.dataSource = dataSource;
  this.entity = entity;
  this.draggers = [];

  var positions = entity.polygon.hierarchy.getValue().positions;
  for (var i = 0; i < positions.length; i++) {
    var loc = positions[i];
    var dragger = drawutils.createDragger(this.dataSource, {
      dragIcon: options.dragIcon,
      position: loc,
      clampToGround: entity.attribute.style.hasOwnProperty("clampToGround")
        ? entity.attribute.style.clampToGround
        : !entity.attribute.style.perPositionHeight,
      onDrag: function onDrag(dragger, position) {
        dragger.positions[dragger.index] = position;
        entity.changeEditing();
      },
    });
    dragger.index = i;
    dragger.positions = positions;
    this.draggers.push(dragger);
  }
}

PolygonEditor.prototype.updateDraggers = function () {
  var positions = this.entity.polygon.hierarchy.getValue();
  for (var i = 0; i < this.draggers.length; i++) {
    var position = positions[i];
    this.draggers[i].position = position;
  }
};

PolygonEditor.prototype.destroy = function () {
  for (var i = 0; i < this.draggers.length; i++) {
    this.dataSource.entities.remove(this.draggers[i]);
  }
  this.draggers = [];
};
function PolygonExtrudedEditor(dataSource, entity, options) {
  this.dataSource = dataSource;
  this.entity = entity;
  this.draggers = [];
  this.heightDraggers = [];

  var that = this;
  var i = 0;
  var positions = entity.polygon.hierarchy.getValue().positions;

  for (i = 0; i < positions.length; i++) {
    var loc = positions[i];
    if (entity.polygon.height != undefined) {
      var carto = Cesium.Cartographic.fromCartesian(loc);
      carto.height += entity.polygon.height.getValue();
      loc = Cesium.Cartesian3.fromRadians(
        carto.longitude,
        carto.latitude,
        carto.height
      );
    }

    var dragger = drawutils.createDragger(this.dataSource, {
      dragIcon: options.dragIcon,
      position: loc,
      onDrag: function onDrag(dragger, position) {
        dragger.positions[dragger.index] = position;

        var entityPositions = entity.polygon.hierarchy.getValue();
        var extrudedPs = entityPositions[0];
        for (var i = 1; i < entityPositions.length; i++) {
          var tempCarto1 = Cesium.Cartographic.fromCartesian(extrudedPs);
          var tempCarto2 = Cesium.Cartographic.fromCartesian(
            entityPositions[i]
          );
          if (Number(tempCarto2.height) > Number(tempCarto1.height)) {
            extrudedPs = entityPositions[i];
          }
        }
        var extrHeight =
          Number(entity.polygon.extrudedHeight) -
          Number(Cesium.Cartographic.fromCartesian(extrudedPs).height);
        entity.attribute.style.extrudedHeight = Number(extrHeight.toFixed(2));

        that.updateDraggers();
        entity.changeEditing();
      },
    });
    dragger.index = i;
    dragger.positions = positions;
    this.draggers.push(dragger);
  }

  // Add a dragger that will change the extruded height on the polygon.
  //创建高程拖拽点
  if (entity.polygon.extrudedHeight) {
    for (i = 0; i < positions.length; i++) {
      var position = positions[i];
      var cartoLoc = Cesium.Cartographic.fromCartesian(position);
      cartoLoc.height = entity.polygon.extrudedHeight.getValue();
      var draggerPs = Cesium.Cartesian3.fromRadians(
        cartoLoc.longitude,
        cartoLoc.latitude,
        cartoLoc.height
      );

      var dragger = drawutils.createDragger(this.dataSource, {
        dragIcon: options.dragIcon,
        position: draggerPs,
        color: drawutils.MoveHeightPointColor,
        tooltip: drawutils.MoveHeightTooltip,
        onDrag: function onDrag(dragger, position) {
          var entityPositions = that.entity.polygon.hierarchy.getValue();
          var extrudedPs = entityPositions[0];
          for (var i = 1; i < entityPositions.length; i++) {
            var tempCarto1 = Cesium.Cartographic.fromCartesian(extrudedPs);
            var tempCarto2 = Cesium.Cartographic.fromCartesian(
              entityPositions[i]
            );
            if (Number(tempCarto2.height) > Number(tempCarto1.height)) {
              extrudedPs = entityPositions[i];
            }
          }
          var cartoLoc = Cesium.Cartographic.fromCartesian(position);
          entity.polygon.extrudedHeight = new Cesium.ConstantProperty(
            Number(cartoLoc.height)
          );
          var extrHeight =
            Number(cartoLoc.height) -
            Number(Cesium.Cartographic.fromCartesian(extrudedPs).height);
          entity.attribute.style.extrudedHeight = Number(extrHeight.toFixed(2));
          that.updateDraggers();
          entity.changeEditing();
        },
        vertical: true,
        horizontal: false,
      });
      dragger.index = i;
      this.heightDraggers.push(dragger);
    }
  }
}

//更新拖拽点（编辑点）
PolygonExtrudedEditor.prototype.updateDraggers = function () {
  var positions = this.entity.polygon.hierarchy.getValue();
  var extrudedHeight = this.entity.polygon.extrudedHeight.getValue();
  var height = 0;
  if (this.entity.polygon.height != undefined) {
    height = this.entity.polygon.height.getValue();
  }
  for (var i = 0; i < this.heightDraggers.length; i++) {
    var position = positions[i];
    var heightDragger = this.heightDraggers[i];
    var extrudedCarto = Cesium.Cartographic.fromCartesian(position);
    extrudedCarto.height = extrudedHeight;
    var loc = Cesium.Cartesian3.fromRadians(
      extrudedCarto.longitude,
      extrudedCarto.latitude,
      extrudedCarto.height
    );
    heightDragger.position = loc;

    var dragger = this.draggers[i];
    var carto = Cesium.Cartographic.fromCartesian(position);
    carto.height += height;
    loc = Cesium.Cartesian3.fromRadians(
      carto.longitude,
      carto.latitude,
      carto.height
    );
    dragger.position = loc;
  }
};

PolygonExtrudedEditor.prototype.destroy = function () {
  var i = 0;

  for (i = 0; i < this.draggers.length; i++) {
    this.dataSource.entities.remove(this.draggers[i]);
  }
  this.draggers = [];

  for (i = 0; i < this.heightDraggers.length; i++) {
    this.dataSource.entities.remove(this.heightDraggers[i]);
  }
  this.heightDraggers = [];
};
function DynamicProperty(value) {
  this._value = undefined;
  this._hasClone = false;
  this._hasEquals = false;
  this._definitionChanged = new Cesium.Event();
  this._constant = false;
  this.setValue(value);
}

Object.defineProperties(DynamicProperty.prototype, {
  /**
   * Gets a value indicating if this property is constant.
   * This property always returns <code>true</code>.
   * @memberof DynamicProperty.prototype
   *
   * @type {Boolean}
   * @readonly
   */
  isConstant: {
    get: function get() {
      return this._constant;
    },
    set: function set(value) {
      if (this._constant !== value) {
        this._constant = value;
        this._definitionChanged.raiseEvent(this);
      }
    },
  },
  /**
   * Gets the event that is raised whenever the definition of this property changes.
   * The definition is changed whenever setValue is called with data different
   * than the current value.
   * @memberof DynamicProperty.prototype
   *
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function get() {
      return this._definitionChanged;
    },
  },
});

/**
 * Gets the value of the property.
 *
 * @param {JulianDate} [time] The time for which to retrieve the value.  This parameter is unused since the value does not change with respect to time.
 * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
 * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
 */
DynamicProperty.prototype.getValue = function (time, result) {
  return this._hasClone ? this._value.clone(result) : this._value;
};

/**
 * Sets the value of the property.
 *
 * @param {Object} value The property value.
 *
 * @exception {DeveloperError} value.clone is a required function.
 * @exception {DeveloperError} value.equals is a required function.
 */
DynamicProperty.prototype.setValue = function (value) {
  var oldValue = this._value;
  if (oldValue !== value) {
    var isDefined = Cesium.defined(value);
    var hasClone = isDefined && typeof value.clone === "function";
    var hasEquals = isDefined && typeof value.equals === "function";

    this._hasClone = hasClone;
    this._hasEquals = hasEquals;

    var changed = !hasEquals || !value.equals(oldValue);
    if (changed) {
      this._value = !hasClone ? value : value.clone();
      this._definitionChanged.raiseEvent(this);
    }
  }
};

/**
 * Compares this property to the provided property and returns
 * <code>true</code> if they are equal, <code>false</code> otherwise.
 *
 * @param {Property} [other] The other property.
 * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
 */
DynamicProperty.prototype.equals = function (other) {
  return (
    this === other || //
    (other instanceof DynamicProperty && //
      ((!this._hasEquals && this._value === other._value) || //
        (this._hasEquals && this._value.equals(other._value))))
  );
};

DynamicProperty.prototype.valueOf = function (other) {
  return this._value;
};

DynamicProperty.prototype.toString = function (other) {
  return String(this._value);
};
// 线
function PolylineEditor(dataSource, entity, options) {
  this.dataSource = dataSource;
  this.entity = entity;
  this.draggers = [];

  var positions = entity._draw_positions;
  //entity.polyline.positions.isConstant = false;
  for (var i = 0; i < positions.length; i++) {
    var loc = positions[i];
    var dragger = drawutils.createDragger(this.dataSource, {
      dragIcon: options.dragIcon,
      position: loc,
      onDrag: function onDrag(dragger, position) {
        positions[dragger.index] = position;
        entity._draw_positions = positions;
        entity.changeEditing();
      },
    });
    dragger.index = i;
    //dragger.positions = positions;
    this.draggers.push(dragger);
  }
}

PolylineEditor.prototype.updateDraggers = function () {
  var positions = this.entity.polyline.positions.getValue();
  for (var i = 0; i < this.draggers.length; i++) {
    var position = positions[i];
    this.draggers[i].position = position;
  }
};

PolylineEditor.prototype.destroy = function () {
  //this.entity.polyline.positions.isConstant = true;

  for (var i = 0; i < this.draggers.length; i++) {
    this.dataSource.entities.remove(this.draggers[i]);
  }
  this.draggers = [];
};
// 贴地园
function EllipseEditor(dataSource, entity, options) {
  this.dataSource = dataSource;
  this.entity = entity;
  this.options = options;
  this.draggers = [];
  this.heightDraggers = [];
  this.initDraggers();
}

EllipseEditor.prototype.initDraggers = function () {
  var that = this;
  var position = this.entity.position.getValue();

  var carto = Cesium.Cartographic.fromCartesian(position);
  if (this.entity.attribute.style.height != carto.height) {
    position = Cesium.Cartesian3.fromRadians(
      carto.longitude,
      carto.latitude,
      this.entity.attribute.style.height
    );
    this.entity.position.setValue(position);
  }

  // Create a dragger that just modifies the entities position.
  var dragger = drawutils.createDragger(this.dataSource, {
    dragIcon: this.options.dragIcon,
    position: position,
    clampToGround: this.entity.attribute.style.clampToGround,
    onDrag: function onDrag(dragger, newPosition) {
      var diff = new Cesium.Cartesian3();
      Cesium.Cartesian3.subtract(
        newPosition,
        that.entity.position.getValue(),
        diff
      );
      if (!that.entity.attribute.style.clampToGround) {
        var cartoLoc = Cesium.Cartographic.fromCartesian(newPosition);
        that.entity.ellipse.height = new Cesium.ConstantProperty(
          cartoLoc.height
        );
        that.entity.attribute.style.height = Number(cartoLoc.height.toFixed(2));
      }
      that.entity.position.setValue(newPosition);

      var newPos = new Cesium.Cartesian3();
      Cesium.Cartesian3.add(
        dragger.majorDragger.position.getValue(),
        diff,
        newPos
      );
      dragger.majorDragger.position = new Cesium.ConstantProperty(newPos);

      if (dragger.minorDragger) {
        Cesium.Cartesian3.add(
          dragger.minorDragger.position.getValue(),
          diff,
          newPos
        );
        dragger.minorDragger.position = new Cesium.ConstantProperty(newPos);
      }

      if (that.entity.attribute.style.extrudedHeight != undefined)
        that.updateHeightDraggers();
      that.entity.changeEditing();
    },
  });
  this.draggers.push(dragger);

  //获取椭圆上的坐标点数组
  var cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions(
    {
      center: position,
      semiMinorAxis: this.entity.ellipse.semiMinorAxis.getValue(),
      semiMajorAxis: this.entity.ellipse.semiMajorAxis.getValue(),
      rotation: Cesium.Math.toRadians(
        Number(this.entity.attribute.style.rotation || 0)
      ),
      granularity: 2.0,
    },
    true,
    false
  );

  //长半轴上的坐标点
  var majorPos = new Cesium.Cartesian3(
    cep.positions[0],
    cep.positions[1],
    cep.positions[2]
  );

  var majorDragger = drawutils.createDragger(this.dataSource, {
    dragIcon: this.options.dragIcon,
    position: majorPos,
    clampToGround: this.entity.attribute.style.clampToGround,
    color: drawutils.MovePointColor,
    tooltip: this.entity.attribute.style.radius
      ? drawutils.MoveRadiusTooltip
      : drawutils.MoveEllipseMajorTooltip,
    onDrag: function onDrag(dragger, newPosition) {
      var majorRadius = Cesium.Cartesian3.distance(
        that.entity.position.getValue(),
        newPosition
      );
      var thisradius = Number(majorRadius.toFixed(2));
      that.entity.ellipse.semiMajorAxis = new Cesium.ConstantProperty(
        thisradius
      );
      let thisMinradius = that.entity.ellipse.semiMinorAxis.getValue();
      if (thisMinradius < thisradius) {
        that.entity.ellipse.semiMajorAxis = new Cesium.ConstantProperty(
          thisradius
        );
      } else {
        that.entity.ellipse.semiMajorAxis = new Cesium.ConstantProperty(
          thisradius
        );
        that.entity.ellipse.semiMinorAxis = new Cesium.ConstantProperty(
          thisradius
        );
      }
      if (that.entity.attribute.style.radius) {
        that.entity.attribute.style.radius = thisradius;
        that.entity.ellipse.semiMinorAxis = new Cesium.ConstantProperty(
          thisradius
        );
      } else {
        that.entity.attribute.style.semiMajorAxis = thisradius;
      }
      if (that.entity.attribute.style.extrudedHeight != undefined)
        that.updateHeightDraggers();
      that.entity.changeEditing();
    },
  });
  dragger.majorDragger = majorDragger;
  this.draggers.push(majorDragger);

  //短半轴上的坐标点
  if (!this.entity.attribute.style.radius) {
    var minorPos = new Cesium.Cartesian3(
      cep.positions[3],
      cep.positions[4],
      cep.positions[5]
    );
    var minorDragger = drawutils.createDragger(this.dataSource, {
      dragIcon: this.options.dragIcon,
      position: minorPos,
      clampToGround: this.entity.attribute.style.clampToGround,
      color: drawutils.MovePointColor,
      tooltip: drawutils.MoveEllipseMinorTooltip,
      onDrag: function onDrag(dragger, newPosition) {
        var minorRadius = Cesium.Cartesian3.distance(
          that.entity.position.getValue(),
          newPosition
        );
        var thisradius = Number(minorRadius.toFixed(2));
        let thisMaxradius = that.entity.ellipse.semiMajorAxis.getValue();
        if (thisMaxradius > thisradius) {
          that.entity.ellipse.semiMinorAxis = new Cesium.ConstantProperty(
            thisradius
          );
        } else {
          that.entity.ellipse.semiMajorAxis = new Cesium.ConstantProperty(
            thisradius
          );
          that.entity.ellipse.semiMinorAxis = new Cesium.ConstantProperty(
            thisradius
          );
        }
        // 获取长半径
        // that.entity.ellipse.semiMajorAxis.getValue()
        if (that.entity.attribute.style.radius) {
          that.entity.attribute.style.radius = thisradius;
          that.entity.ellipse.semiMajorAxis = new Cesium.ConstantProperty(
            thisradius
          );
        } else {
          that.entity.attribute.style.semiMinorAxis = thisradius;
        }
        if (that.entity.attribute.style.extrudedHeight != undefined)
          that.updateHeightDraggers();
        that.entity.changeEditing();
      },
    });
    dragger.minorDragger = minorDragger;
    this.draggers.push(minorDragger);
  }

  if (this.entity.attribute.style.extrudedHeight != undefined)
    this.initHeightDraggers();
};

//创建高程拖拽点
EllipseEditor.prototype.initHeightDraggers = function () {
  var that = this;

  var extrudedHeight = Number(this.entity.attribute.style.extrudedHeight);

  var hDragger = drawutils.createDragger(this.dataSource, {
    dragIcon: this.options.dragIcon,
    position: drawutils.getPositionsWithHeight(
      this.entity.position.getValue(),
      extrudedHeight
    ),
    clampToGround: this.entity.attribute.style.clampToGround,
    onDrag: function onDrag(dragger, newPosition) {
      var carto = Cesium.Cartographic.fromCartesian(newPosition);
      carto.height = Number(that.entity.ellipse.height);
      newPosition = Cesium.Cartesian3.fromRadians(
        carto.longitude,
        carto.latitude,
        carto.height
      );

      that.entity.position.setValue(newPosition);

      that.updateDraggers();
      that.entity.changeEditing();
    },
  });

  this.heightDraggers.push(hDragger);

  var cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions(
    {
      center: this.entity.position.getValue(),
      semiMinorAxis: this.entity.ellipse.semiMinorAxis.getValue(),
      semiMajorAxis: this.entity.ellipse.semiMajorAxis.getValue(),
      rotation: Cesium.Math.toRadians(
        Number(this.entity.attribute.style.rotation || 0)
      ),
      granularity: 2.0,
    },
    true,
    false
  );
  var majorPos = new Cesium.Cartesian3(
    cep.positions[0],
    cep.positions[1],
    cep.positions[2]
  );

  var majorHDragger = drawutils.createDragger(this.dataSource, {
    dragIcon: this.options.dragIcon,
    position: drawutils.getPositionsWithHeight(majorPos, extrudedHeight),
    clampToGround: this.entity.attribute.style.clampToGround,
    color: drawutils.MoveHeightPointColor,
    tooltip: drawutils.MoveHeightTooltip,
    onDrag: function onDrag(dragger, position) {
      var cartoLoc = Cesium.Cartographic.fromCartesian(position);
      that.entity.ellipse.extrudedHeight = new Cesium.ConstantProperty(
        cartoLoc.height
      );

      var extrudedHeight = cartoLoc.height - Number(that.entity.ellipse.height);
      that.entity.attribute.style.extrudedHeight = Number(
        extrudedHeight.toFixed(2)
      );

      that.updateHeightDraggers();
      that.entity.changeEditing();
    },
    vertical: true,
    horizontal: false,
  });
  this.heightDraggers.push(majorHDragger);

  var minorPos = new Cesium.Cartesian3(
    cep.positions[3],
    cep.positions[4],
    cep.positions[5]
  );
  var minorHDragger = drawutils.createDragger(this.dataSource, {
    dragIcon: this.options.dragIcon,
    position: drawutils.getPositionsWithHeight(minorPos, extrudedHeight),
    clampToGround: this.entity.attribute.style.clampToGround,
    color: drawutils.MoveHeightPointColor,
    tooltip: drawutils.MoveHeightTooltip,
    onDrag: function onDrag(dragger, position) {
      var cartoLoc = Cesium.Cartographic.fromCartesian(position);
      that.entity.ellipse.extrudedHeight = new Cesium.ConstantProperty(
        cartoLoc.height
      );

      var extrudedHeight = cartoLoc.height - Number(that.entity.ellipse.height);
      that.entity.attribute.style.extrudedHeight = Number(
        extrudedHeight.toFixed(2)
      );

      that.updateHeightDraggers();
      that.entity.changeEditing();
    },
    vertical: true,
    horizontal: false,
  });
  this.heightDraggers.push(minorHDragger);
};

//更新拖拽点
EllipseEditor.prototype.updateDraggers = function () {
  this.destroy();
  this.initDraggers();
};

//更新高程拖拽点
EllipseEditor.prototype.updateHeightDraggers = function () {
  for (var i = 0; i < this.heightDraggers.length; i++) {
    this.dataSource.entities.remove(this.heightDraggers[i]);
  }
  this.heightDraggers = [];
  this.initHeightDraggers();
};

EllipseEditor.prototype.destroy = function () {
  var i = 0;
  for (i = 0; i < this.draggers.length; i++) {
    this.dataSource.entities.remove(this.draggers[i]);
  }
  this.draggers = [];
  if (this.entity.attribute.style.extrudedHeight != undefined) {
    for (i = 0; i < this.heightDraggers.length; i++) {
      this.dataSource.entities.remove(this.heightDraggers[i]);
    }
    this.heightDraggers = [];
  }
};
// 矩形
function RectangleEditor(dataSource, entity, options) {
  this.dataSource = dataSource;
  this.entity = entity;
  this.options = options;
  this.draggers = [];

  this.initDraggers();
}

var midPoint = new Cesium.Cartesian3();

RectangleEditor.prototype.initDraggers = function () {
  var that = this;

  var positions = this.entity._draw_positions;

  //var rotation = this.entity.attribute.style.rotation;
  //if (rotation && rotation != 0) {
  //    midPoint = Cesium.Cartesian3.midpoint(positions[0], positions[1], midPoint)
  //}

  for (var i = 0; i < positions.length; i++) {
    var position = positions[i];

    if (this.entity.rectangle.height != undefined) {
      var newHeight = this.entity.rectangle.height.getValue();
      position = this.getNewHeightPosition(position, newHeight);
    }

    //if (rotation && rotation != 0) {
    //    position = getRotateCenterPoint(midPoint, position, 360 - this.entity.attribute.style.rotation);
    //}

    var dragger = drawutils.createDragger(this.dataSource, {
      dragIcon: this.options.dragIcon,
      position: position,
      clampToGround: this.entity.attribute.style.clampToGround,
      onDrag: function onDrag(dragger, position) {
        if (that.entity.rectangle.height != undefined) {
          var newHeight = that.entity.rectangle.height.getValue();
          position = that.getNewHeightPosition(position, newHeight);
        }

        that.entity._draw_positions[dragger.index] = position;
        dragger.position = position;

        that.entity.changeEditing();
      },
    });
    dragger.index = i;

    this.draggers.push(dragger);
  }
};

RectangleEditor.prototype.getNewHeightPosition = function (
  position,
  newHeight
) {
  var carto = Cesium.Cartographic.fromCartesian(position);
  carto.height = newHeight;
  position = Cesium.Cartesian3.fromRadians(
    carto.longitude,
    carto.latitude,
    carto.height
  );
  return position;
};

//RectangleEditor.prototype.updatePositions = function (height) {
//    var positions = this.entity._draw_positions;
//    var re = Cesium.Rectangle.fromCartesianArray(positions);
//    var pt1 = Cesium.Cartesian3.fromRadians(re.west, re.south, height);
//    var pt2 = Cesium.Cartesian3.fromRadians(re.east, re.south, height);
//    var pt3 = Cesium.Cartesian3.fromRadians(re.east, re.north, height);
//    var pt4 = Cesium.Cartesian3.fromRadians(re.west, re.north, height);
//};

//������ק��
RectangleEditor.prototype.updateDraggers = function () {
  this.destroy();
  this.initDraggers();
};

RectangleEditor.prototype.destroy = function () {
  for (var i = 0; i < this.draggers.length; i++) {
    this.dataSource.entities.remove(this.draggers[i]);
  }
  this.draggers = [];
};
var RectangleExtrudedEditor = function RectangleExtrudedEditor(
  dataSource,
  entity,
  options
) {
  this.dataSource = dataSource;
  this.entity = entity;
  this.options = options;

  this.draggers = [];
  this.heightDraggers = [];
  this.initDraggers();
};

RectangleExtrudedEditor.prototype.initDraggers = function () {
  var that = this;

  var positions = this.entity._draw_positions;
  for (var i = 0; i < positions.length; i++) {
    var position = positions[i];

    if (this.entity.rectangle.height != undefined) {
      var newHeight = this.entity.rectangle.height.getValue();
      position = this.getNewHeightPosition(position, newHeight);
    }

    var dragger = drawutils.createDragger(this.dataSource, {
      dragIcon: this.options.dragIcon,
      position: position,
      clampToGround: this.entity.attribute.style.clampToGround,
      onDrag: function onDrag(dragger, position) {
        if (that.entity.rectangle.height != undefined) {
          var newHeight = that.entity.rectangle.height.getValue();
          position = that.getNewHeightPosition(position, newHeight);
        }

        that.entity._draw_positions[dragger.index] = position;
        dragger.position = position;

        that.updateDraggers();
        that.entity.changeEditing();
      },
    });
    dragger.index = i;

    this.draggers.push(dragger);
  }

  // Add a dragger that will change the extruded height on the rectangle.
  if (this.entity.rectangle.extrudedHeight) {
    for (var i = 0; i < positions.length; i++) {
      var position = positions[i];

      var extrudedHeight = this.entity.rectangle.extrudedHeight.getValue();
      position = this.getNewHeightPosition(position, extrudedHeight);

      var dragger = drawutils.createDragger(this.dataSource, {
        dragIcon: this.options.dragIcon,
        position: position,
        color: drawutils.MoveHeightPointColor,
        tooltip: drawutils.MoveHeightTooltip,
        onDrag: function onDrag(dragger, position) {
          var cartoLoc = Cesium.Cartographic.fromCartesian(position);
          that.entity.rectangle.extrudedHeight = new Cesium.ConstantProperty(
            cartoLoc.height
          );

          var extrudedHeight =
            cartoLoc.height - Number(that.entity.rectangle.height);
          that.entity.attribute.style.extrudedHeight = Number(
            extrudedHeight.toFixed(1)
          );

          that.updateDraggers();
          that.entity.changeEditing();
        },
        vertical: true,
        horizontal: false,
      });
      dragger.index = i;
      this.heightDraggers.push(dragger);
    }
  }
};

//更新
RectangleExtrudedEditor.prototype.updateDraggers = function () {
  var extrudedHeight = this.entity.rectangle.extrudedHeight.getValue();

  var positions = this.entity._draw_positions;
  for (var i = 0; i < this.heightDraggers.length; i++) {
    var position = positions[i];

    if (this.entity.rectangle.height != undefined) {
      var newHeight = this.entity.rectangle.height.getValue();
      position = this.getNewHeightPosition(position, newHeight);
      this.draggers[i].position = position;
    }

    position = this.getNewHeightPosition(position, extrudedHeight);
    this.heightDraggers[i].position = position;
  }
};

RectangleExtrudedEditor.prototype.getNewHeightPosition = function (
  position,
  newHeight
) {
  var carto = Cesium.Cartographic.fromCartesian(position);
  carto.height = newHeight;
  position = Cesium.Cartesian3.fromRadians(
    carto.longitude,
    carto.latitude,
    carto.height
  );
  return position;
};

RectangleExtrudedEditor.prototype.destroy = function () {
  var i = 0;
  for (i = 0; i < this.draggers.length; i++) {
    this.dataSource.entities.remove(this.draggers[i]);
  }
  this.draggers = [];

  for (i = 0; i < this.heightDraggers.length; i++) {
    this.dataSource.entities.remove(this.heightDraggers[i]);
  }
  this.heightDraggers = [];
};
// 墙体编辑
var WallEditor = function WallEditor(dataSource, entity, options) {
  this.dataSource = dataSource;
  this.entity = entity;
  this.draggers = [];
  this.heightDraggers = [];

  var that = this;
  var i = 0;
  var positions = entity.wall.positions.getValue();
  //entity.wall.positions.isConstant = false;
  for (i = 0; i < positions.length; i++) {
    var loc = positions[i];
    var dragger = drawutils.createDragger(this.dataSource, {
      dragIcon: options.dragIcon,
      position: loc,
      onDrag: function onDrag(dragger, position) {
        dragger.positions[dragger.index] = position;
        that.updateDraggers();
        entity.changeEditing();
      },
    });
    dragger.index = i;
    dragger.positions = positions;
    this.draggers.push(dragger);
  }

  // Add a dragger that will change the extruded height on the wall.
  //创建高程拖拽点
  if (entity.wall.maximumHeights) {
    for (i = 0; i < positions.length; i++) {
      var position = positions[i];
      var carto = Cesium.Cartographic.fromCartesian(position.clone());
      carto.height = entity.wall.maximumHeights._value[i];
      var loc = Cesium.Cartesian3.fromRadians(
        carto.longitude,
        carto.latitude,
        carto.height
      );

      var dragger = drawutils.createDragger(this.dataSource, {
        dragIcon: options.dragIcon,
        position: loc,
        color: drawutils.MoveHeightPointColor,
        tooltip: drawutils.MoveHeightTooltip,
        onDrag: function onDrag(dragger, position) {
          var cartoLoc = Cesium.Cartographic.fromCartesian(position);
          var minimumHeights = that.entity.wall.minimumHeights.getValue();
          var extrudedHeight =
            Number(cartoLoc.height) - Number(minimumHeights[dragger.index]);
          entity.attribute.style.extrudedHeight = extrudedHeight.toFixed(2);
          that.updateDraggers();
          entity.changeEditing();
        },
        vertical: true,
        horizontal: false,
      });
      dragger.index = i;
      this.heightDraggers.push(dragger);
    }
  }
};

WallEditor.prototype.updateDraggers = function () {
  var positions = this.entity.wall.positions.getValue();
  var minimumHeights = this.entity.wall.minimumHeights.getValue();
  var maximumHeights = this.entity.wall.maximumHeights.getValue();
  var miniHeights;
  for (var i = 0; i < this.heightDraggers.length; i++) {
    var position = positions[i].clone();
    var heightDragger = this.heightDraggers[i];
    var extrudedCarto = Cesium.Cartographic.fromCartesian(position);
    minimumHeights[i] = extrudedCarto.height;
    maximumHeights[i] =
      Number(extrudedCarto.height) +
      Number(this.entity.attribute.style.extrudedHeight);

    heightDragger.position = drawutils.getPositionsWithHeight(
      position,
      this.entity.attribute.style.extrudedHeight
    );

    this.draggers[i].position = position;
  }
};

WallEditor.prototype.destroy = function () {
  var i = 0;

  for (i = 0; i < this.draggers.length; i++) {
    this.dataSource.entities.remove(this.draggers[i]);
  }
  this.draggers = [];

  for (i = 0; i < this.heightDraggers.length; i++) {
    this.dataSource.entities.remove(this.heightDraggers[i]);
  }
  this.heightDraggers = [];
};
/**
 * 编辑椭球
 * An editor that allows you to edit an ellipsoid
 */
var EllipsoidEditor = function EllipsoidEditor(dataSource, entity, options) {
  this.dataSource = dataSource;
  this.entity = entity;
  this.options = options;
  this.draggers = [];
  this.initDraggers();
};

//创建拖拽点
EllipsoidEditor.prototype.initDraggers = function () {
  var that = this;

  var ellipsoidPs = this.entity.position.getValue();
  var carto = Cesium.Cartographic.fromCartesian(ellipsoidPs);
  var radii = Number(this.entity.attribute.style.heightRadii) || 0;
  carto.height += radii;

  var draggerPs = Cesium.Cartesian3.fromRadians(
    carto.longitude,
    carto.latitude,
    carto.height
  );

  var dragger = drawutils.createDragger(this.dataSource, {
    dragIcon: this.options.dragIcon,
    position: draggerPs,
    onDrag: function onDrag(dragger, newPosition) {
      var diff = new Cesium.Cartesian3();
      Cesium.Cartesian3.subtract(
        newPosition,
        that.entity.position.getValue(),
        diff
      );

      that.entity.position.setValue(newPosition);

      var carto = Cesium.Cartographic.fromCartesian(newPosition);
      carto.height += Number(that.entity.attribute.style.heightRadii);
      newPosition = Cesium.Cartesian3.fromRadians(
        carto.longitude,
        carto.latitude,
        carto.height
      );

      dragger.position.setValue(newPosition);

      var newPos = new Cesium.Cartesian3();
      Cesium.Cartesian3.add(
        dragger.majorDragger.position.getValue(),
        diff,
        newPos
      );
      dragger.majorDragger.position = new Cesium.ConstantProperty(newPos);

      Cesium.Cartesian3.add(
        dragger.minorDragger.position.getValue(),
        diff,
        newPos
      );
      dragger.minorDragger.position = new Cesium.ConstantProperty(newPos);

      that.entity.changeEditing();
    },
  });
  this.draggers.push(dragger);

  //获取椭圆上的坐标点数组
  var cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions(
    {
      center: ellipsoidPs,
      semiMajorAxis: Number(this.entity.attribute.style.extentRadii),
      semiMinorAxis: Number(this.entity.attribute.style.widthRadii),
      rotation: Cesium.Math.toRadians(0),
      granularity: 2.0,
    },
    true,
    false
  );

  //长半轴上的坐标点
  var majorPos = new Cesium.Cartesian3(
    cep.positions[0],
    cep.positions[1],
    cep.positions[2]
  );

  var majorDragger = drawutils.createDragger(this.dataSource, {
    dragIcon: this.options.dragIcon,
    position: majorPos,
    color: drawutils.MovePointColor,
    tooltip: drawutils.MoveEllipseMajorTooltip,
    onDrag: function onDrag(dragger, newPosition) {
      var majorRadius = Cesium.Cartesian3.distance(
        that.entity.position.getValue(),
        newPosition
      );
      var thisradius = Number(majorRadius.toFixed(2));

      that.entity.attribute.style.extentRadii = thisradius;
      that.updateRadii();

      that.entity.changeEditing();
    },
  });
  dragger.majorDragger = majorDragger;
  this.draggers.push(majorDragger);

  //短半轴上的坐标点
  var minorPos = new Cesium.Cartesian3(
    cep.positions[3],
    cep.positions[4],
    cep.positions[5]
  );
  var minorDragger = drawutils.createDragger(this.dataSource, {
    dragIcon: this.options.dragIcon,
    position: minorPos,
    color: drawutils.MovePointColor,
    tooltip: drawutils.MoveEllipseMinorTooltip,
    onDrag: function onDrag(dragger, newPosition) {
      var minorRadius = Cesium.Cartesian3.distance(
        that.entity.position.getValue(),
        newPosition
      );
      var thisradius = Number(minorRadius.toFixed(2));

      that.entity.attribute.style.widthRadii = thisradius;
      that.updateRadii();

      that.entity.changeEditing();
    },
  });
  dragger.minorDragger = minorDragger;
  this.draggers.push(minorDragger);
};

EllipsoidEditor.prototype.updateRadii = function () {
  var extentRadii = Number(this.entity.attribute.style.extentRadii);
  var widthRadii = Number(this.entity.attribute.style.widthRadii);
  var heightRadii = Number(this.entity.attribute.style.heightRadii);
  this.entity.ellipsoid.radii = new Cesium.Cartesian3(
    extentRadii,
    widthRadii,
    heightRadii
  );
};

EllipsoidEditor.prototype.updateDraggers = function () {
  this.destroy();
  this.initDraggers();
};

EllipsoidEditor.prototype.destroy = function () {
  for (var i = 0; i < this.draggers.length; i++) {
    this.dataSource.entities.remove(this.draggers[i]);
  }
  this.draggers = [];
};
var PointEditor = function PointEditor(dataSource, entity, options) {
  this.dataSource = dataSource;
  this.entity = entity;
  this.draggers = [];

  var dragger = drawutils.createDragger(this.dataSource, {
    dragger: entity,
    onDrag: function onDrag(dragger, newPosition) {
      var diff = new Cesium.Cartesian3();
      Cesium.Cartesian3.subtract(newPosition, entity.position.getValue(), diff);

      entity.position._value = newPosition;

      entity.changeEditing();
    },
  });
  //this.draggers.push(dragger);
};

PointEditor.prototype.updateDraggers = function () {};

PointEditor.prototype.destroy = function () {
  this.draggers = [];
};
var PolylineVolumeEditor = function PolylineVolumeEditor(
  dataSource,
  entity,
  options
) {
  this.dataSource = dataSource;
  this.entity = entity;
  this.draggers = [];

  var positions = entity.polylineVolume.positions.getValue();

  for (var i = 0; i < positions.length; i++) {
    var loc = positions[i];

    var dragger = drawutils.createDragger(this.dataSource, {
      dragIcon: options.dragIcon,
      position: loc,
      onDrag: function onDrag(dragger, position) {
        positions[dragger.index] = position;
        entity.polylineVolume.positions = positions;
        entity.changeEditing();
      },
    });
    dragger.index = i;
    this.draggers.push(dragger);
  }
};

PolylineVolumeEditor.prototype.updateDraggers = function () {
  var positions = this.entity.polylineVolume.positions.getValue();
  for (var i = 0; i < this.draggers.length; i++) {
    var position = positions[i];
    this.draggers[i].position = position;
  }
};

PolylineVolumeEditor.prototype.destroy = function () {
  for (var i = 0; i < this.draggers.length; i++) {
    this.dataSource.entities.remove(this.draggers[i]);
  }
  this.draggers = [];
};
export function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    for (var i = 0, len = obj.length; i < len; ++i) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (typeof obj === "object") {
    var copy = {};
    for (var attr in obj) {
      if (attr == "_layer" || attr == "_layers" || attr == "_parent") continue;

      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }
  return obj;
}
var isutil = {
  // "判断 相关操作类";

  //============内部私有属性及方法============
  isArray: function (obj) {
    return typeof obj == "object" && obj.constructor == Array;
  },

  isString: function (str) {
    return typeof str == "string" && str.constructor == String;
  },

  isNumber: function (obj) {
    return typeof obj == "number" && obj.constructor == Number;
  },

  isDate: function (obj) {
    return typeof obj == "object" && obj.constructor == Date;
  },

  isFunction: function (obj) {
    return typeof obj == "function" && obj.constructor == Function;
  },

  isObject: function (obj) {
    return typeof obj == "object" && obj.constructor == Object;
  },

  isNull: function (value) {
    if (value == null) return true;
    if (isString(value) && value == "") return true;
    if (isNumber(value) && isNaN(value)) return true;

    return false;
  },

  isNotNull: function (value) {
    return !isNull(value);
  },
};

export const flystart = {
  updateAttr: function (params) {
    for (var i in params) {
      this.flyEntity.data.properties.attr[i] = params[i];
    }
  },
  flyEntity: null, //飞机实体（模型）
  stop: function () {
    this.viewer.trackedEntity = undefined;
    this.viewer.scene.preRender.removeEventListener(
      this.preRender_eventHandler,
      this
    );

    if (this.flyEntity) {
      this.viewer.entities.remove(this.flyEntity);
      this.flyEntity = null;
    }
    if (this.wallEntity) {
      this.viewer.entities.remove(this.wallEntity);
      this.wallEntity = null;
    }
    // mars3d.widget.disable(this.charsWidgetUri);
  },
  start: function (lineData, viewer) {
    this.viewer = viewer;
    this.isActivate = false;
    // console.log(lineData)
    var attr = lineData.properties.attr;

    //=====================计算飞行时间及坐标====================
    var property = new Cesium.SampledPositionProperty();
    var startTime = Cesium.JulianDate.fromDate(new Date()); //飞行开始时间
    var stopTime; //飞行结束时间

    var lonlats = lineData.geometry.coordinates;
    if (lonlats.length < 2) {
      toastr.error("路线无坐标数据，无法漫游！");
      return;
    }

    var speeds = lineData.properties.speed;
    var isSpeedArray = !isutil.isNumber(speeds);
    if (lonlats.length == 2) {
      //需要插值，否则穿地
      var centerPt = this.getPointForLineAlong(lonlats[0], lonlats[1], 0, 0.5);
      lonlats.splice(1, 0, centerPt);
      if (speeds && isSpeedArray) speeds.splice(1, 0, speeds[0]);
    }
    var defSpeed = 100; //无速度值时的 默认速度

    var alltimes = 0; //总时长,秒
    var alllen = 0; //总长度,千米

    var lastPoint;
    var arrLinePoint = [];
    for (var i = 0, length = lonlats.length; i < length; i++) {
      var lonlat = lonlats[i];
      var item = Cesium.Cartesian3.fromDegrees(
        lonlat[0],
        lonlat[1],
        lonlat[2] || 0
      );
      item.lonlat = lonlat;

      if (i == 0) {
        //起点
        var sTime = Cesium.JulianDate.addSeconds(
          startTime,
          alltimes,
          new Cesium.JulianDate()
        );
        item.time = sTime;
        property.addSample(sTime, item);
        lastPoint = item;
      } else if (i == lonlats.length - 1) {
        var speed = isSpeedArray
          ? speeds
            ? speeds[i - 1]
            : defSpeed
          : speeds || defSpeed;
        var len = Cesium.Cartesian3.distance(item, lastPoint) / 1000;
        var stepTime = (len / speed) * 3600;
        alltimes += stepTime;
        alllen += len;
        var sTime = Cesium.JulianDate.addSeconds(
          startTime,
          alltimes,
          new Cesium.JulianDate()
        );
        item.time = sTime;
        property.addSample(sTime, item);
      } else {
        //中间点，计算转弯处弧线
        var speed = isSpeedArray
          ? speeds
            ? speeds[i - 1]
            : defSpeed
          : speeds || defSpeed; //1千米/时 =  1/3.6 米/秒
        speed = speed * 0.8; //转弯处降速
        var arrBezier = this.getBezierSpline(
          lonlats[i - 1],
          lonlat,
          lonlats[i + 1]
        );
        for (var j = 0; j < arrBezier.length; j++) {
          var itemBezier = arrBezier[j];
          var len = Cesium.Cartesian3.distance(itemBezier, lastPoint) / 1000;
          var stepTime = (len / speed) * 3600;
          alltimes += stepTime;
          alllen += len;
          var sTime = Cesium.JulianDate.addSeconds(
            startTime,
            alltimes,
            new Cesium.JulianDate()
          );
          item.time = sTime;
          property.addSample(sTime, itemBezier);
          lastPoint = itemBezier;
        }
      }
      arrLinePoint.push(item);
    }

    this.arrLinePoint = arrLinePoint;
    stopTime = Cesium.JulianDate.addSeconds(
      startTime,
      alltimes,
      new Cesium.JulianDate()
    );

    //显示基本信息，名称、总长、总时间
    this.showAllInfo({
      name: attr.name,
      alllen: alllen * 1000,
      alltime: alltimes,
    });
    //=====================绑定clock timeline====================
    viewer.clock.startTime = startTime.clone();
    viewer.clock.stopTime = stopTime.clone();
    viewer.clock.currentTime = startTime.clone();
    viewer.clock.multiplier = 1; //飞行速度
    viewer.clock.shouldAnimate = true;

    if (attr.clockRange) viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    //到达终止时间后循环
    else viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; //到达终止时间后停止
    //viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED; //达到终止时间后继续读秒

    if (viewer.timeline) viewer.timeline.zoomTo(startTime, stopTime);
    else if (this.timeline) this.timeline.zoomTo(startTime, stopTime);
    //=====================构造飞行对象====================
    var entityAttr = {
      id: lineData.id,
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start: startTime,
          stop: stopTime,
        }),
      ]),
      position: property,
      orientation: new Cesium.VelocityOrientationProperty(property), //基于移动位置自动计算方位

      data: lineData,
    };

    if (attr.showLabel) {
      //是否显示注记
      entityAttr.label = {
        text: lineData.name,
        font: "14px Helvetica",
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: Cesium.Color.AZURE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 500000, 0.5),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          0.0,
          500000
        ),
      };
    }

    if (attr.showLine) {
      //是否显示路线
      entityAttr.path = {
        resolution: 1,
        material: new Cesium.Color.fromCssColorString(
          lineData.properties.style.color
        ).withAlpha(0.4),
        width: 1.5,
        leadTime: 0,
        trailTime: alltimes,
      };
    }
    //漫游对象
    switch (attr.point) {
      default: //必须有对象，否则viewer.trackedEntity无法跟随
        entityAttr.point = {
          color: new Cesium.Color.fromCssColorString("#ffffff").withAlpha(0.01),
          pixelSize: 1,
        };
        break;
      case "point":
        entityAttr.point = {
          color: new Cesium.Color.fromCssColorString(
            lineData.properties.style.color
          ).withAlpha(0.8),
          pixelSize: 6,
        };
        if (entityAttr.label)
          entityAttr.label.pixelOffset = new Cesium.Cartesian2(10, -30); //偏移量
        break;

      case "model_car": //汽车模型
        entityAttr.model = {
          uri: url + "/alldata/gltf/qiche.gltf",
          scale: 0.2,
          minimumPixelSize: 50,
        };
        if (entityAttr.label)
          entityAttr.label.pixelOffset = new Cesium.Cartesian2(70, -30); //偏移量
        break;
      case "model_air": //飞机模型
        entityAttr.model = {
          uri: url + "/alldata/gltf/feiji.glb",
          scale: 0.1,
          minimumPixelSize: 50,
        };
        if (entityAttr.label)
          entityAttr.label.pixelOffset = new Cesium.Cartesian2(60, -30); //偏移量
        break;
      //case "model_j10"://歼十模型
      //    entityAttr.model = {
      //        uri: '../data/gltf/j10/j10.gltf',
      //        scale: 50,
      //        minimumPixelSize: 50
      //    };
      //    if (entityAttr.label)
      //        entityAttr.label.pixelOffset = new Cesium.Cartesian2(60, -30); //偏移量
      //    break;
      case "model_weixin": //卫星模型
        entityAttr.model = {
          uri: url + "/alldata/gltf/weixin.gltf",
          scale: 1,
          minimumPixelSize: 100,
        };
        if (entityAttr.label)
          entityAttr.label.pixelOffset = new Cesium.Cartesian2(60, -30); //偏移量
        break;
    }

    this.flyEntity = viewer.entities.add(entityAttr);

    //插值，使折线边平滑 ,并且长距离下不穿地
    this.flyEntity.position.setInterpolationOptions({
      interpolationDegree: 2,
      interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
    });

    viewer.trackedEntity = this.flyEntity;

    this.isActivate = true;
    viewer.scene.preRender.addEventListener(this.preRender_eventHandler, this);
  },
  //实时监控事件
  scratch: new Cesium.Matrix4(),
  preRender_eventHandler: function preRender_eventHandler(e) {
    if (!this.isActivate || this.flyEntity == null) return;
    var attr = this.flyEntity.data.properties.attr;
    //视角处理
    switch (attr.cameraType) {
      default: //无
        if (this.viewer.trackedEntity != undefined)
          this.viewer.trackedEntity = undefined;

        if (this.flyEntity.model) this.flyEntity.model.show = true;
        break;

      case "gs": //跟随视角
        if (this.viewer.trackedEntity != this.flyEntity)
          this.viewer.trackedEntity = this.flyEntity;

        if (this.flyEntity.model) this.flyEntity.model.show = true;
        break;
      case "dy": //锁定第一视角
        if (this.viewer.trackedEntity != this.flyEntity)
          this.viewer.trackedEntity = this.flyEntity;

        this.getModelMatrix(
          this.viewer.trackedEntity,
          this.viewer.clock.currentTime,
          this.scratch
        );

        var transformX = attr.followedX; //距离运动点的距离（后方）
        var transformZ = attr.followedZ; //距离运动点的高度（上方）
        this.viewer.scene.camera.lookAtTransform(
          this.scratch,
          new Cesium.Cartesian3(-transformX, 0, transformZ)
        );

        if (this.flyEntity.model) this.flyEntity.model.show = transformZ != 0;

        break;
      case "sd": //锁定上帝视角
        if (this.viewer.trackedEntity != this.flyEntity)
          this.viewer.trackedEntity = this.flyEntity;

        this.getModelMatrix(
          this.viewer.trackedEntity,
          this.viewer.clock.currentTime,
          this.scratch
        );

        var transformZ = attr.followedZ; //距离运动点的高度（上方）
        this.viewer.scene.camera.lookAtTransform(
          this.scratch,
          new Cesium.Cartesian3(-1, 0, transformZ)
        );

        if (this.flyEntity.model) this.flyEntity.model.show = true;
        break;
    }

    //当前点
    var position = Cesium.Property.getValueOrUndefined(
      this.flyEntity.position,
      this.viewer.clock.currentTime,
      this.positionScratch
    );
    if (position) {
      //实时监控
      this.realTime(position);
    }
  },
  realTime: function (position) {
    var attr = this.flyEntity.data.properties.attr;

    var point = formatPositon(position);

    var time =
      (this.viewer.clock.currentTime.dayNumber -
        this.viewer.clock.startTime.dayNumber) *
        24 *
        60 *
        60 +
      this.viewer.clock.currentTime.secondsOfDay -
      this.viewer.clock.startTime.secondsOfDay; //已飞行时间

    var flyOk = this.getFlyOkPoints(position);
    //    this.updateCharsWidgeFlyOk(flyOk.len);//更新剖面图
    if (attr.showShadow) {
      //投影
      this.updateWall(flyOk.positions);
    }

    this.showRealTimeInfo({
      time: time,
      len: flyOk.len,
      x: point.x,
      y: point.y,
      z: point.z,
    });

    //if (window.parent && window.parent.postMessage) {
    //    point.type = "roam";
    //    window.parent.postMessage(point, 'http://localhost:8090/');
    //}

    //var height;
    //if (this.viewer.scene.sampleHeightSupported) {
    //    height = this.viewer.scene.sampleHeight(Cesium.Cartographic.fromCartesian(position), [this.flyEntity]);
    //}

    //求地面海拔
    var that = this;
    util.terrainPolyline({
      viewer: that.viewer,
      positions: [position, position],
      calback: function (raisedPositions, noHeight) {
        // console.log(raisedPositions, noHeight)
        if (!that.isActivate) return;
        if (
          raisedPositions == null ||
          raisedPositions.length == 0 ||
          noHeight
        ) {
          that.showHeightInfo({
            hbgd_str: null,
            ldgd_str: null,
            showHeightWarn: null,
            hasWarn: null,
          });
          return;
        }

        var hbgd = formatPositon(raisedPositions[0]).z; //地面高程
        var fxgd = point.z; //飞行高度
        var ldgd = fxgd - hbgd; //离地高度

        var hbgd_str = haoutil.str.formatLength(hbgd);
        var fxgd_str = haoutil.str.formatLength(fxgd);
        var ldgd_str = haoutil.str.formatLength(ldgd);

        var result = "漫游高程：" + fxgd_str;

        var hasWarn = false;
        if (attr.showHeightWarn && attr.warnHeight) {
          result += "\n离地距离：" + ldgd_str;
          if (ldgd <= attr.warnHeight) {
            hasWarn = true;
            result += "【低于报警高度】";
          }
        } else {
          result += "\n地面高程：" + hbgd;
        }

        if (that.flyEntity.label)
          that.flyEntity.label.text = that.flyEntity.data.name + "\n" + result;

        //界面显示
        that.showHeightInfo({
          hbgd_str: hbgd_str,
          ldgd_str: ldgd_str,
          showHeightWarn: attr.showHeightWarn,
          hasWarn: hasWarn,
        });
        //    console.log({
        //        hbgd_str: hbgd_str,
        //        ldgd_str: ldgd_str,
        //        showHeightWarn: attr.showHeightWarn,
        //        hasWarn: hasWarn
        //    })
      },
    });
  },

  //锁定视角计算
  matrix3Scratch: new Cesium.Matrix3(),
  positionScratch: new Cesium.Cartesian3(),
  orientationScratch: new Cesium.Quaternion(),
  getModelMatrix: function (entity, time, result) {
    if (entity == null) return result;

    var position = Cesium.Property.getValueOrUndefined(
      entity.position,
      time,
      this.positionScratch
    );
    if (!Cesium.defined(position)) {
      return undefined;
    }

    var orientation = Cesium.Property.getValueOrUndefined(
      entity.orientation,
      time,
      this.orientationScratch
    );
    if (!Cesium.defined(orientation)) {
      result = Cesium.Transforms.eastNorthUpToFixedFrame(
        position,
        undefined,
        result
      );
    } else {
      result = Cesium.Matrix4.fromRotationTranslation(
        Cesium.Matrix3.fromQuaternion(orientation, this.matrix3Scratch),
        position,
        result
      );
    }
    return result;
  },

  //显示剖面
  //    charsWidgetUri: 'widgets/roamChars/widget.js',
  //    charsCacheData: null,
  //    showHeightChars: function () {
  //        console.log("kkk")
  //        if (this.charsCacheData) {
  //            this.updateCharsWidge(this.charsCacheData);
  //        }
  //        else {
  //            var that = this;
  //            this.getTerrainHeight(function (data) {
  //                that.charsCacheData = data;
  //                that.updateCharsWidge(data);
  //            });
  //        }
  //    },
  //    updateCharsWidge: function (data) {
  //        console.log(data)
  //     //    mars3d.widget.activate({
  //     //        uri: this.charsWidgetUri,
  //     //        data: data
  //     //    });
  //    },
  //    updateCharsWidgeFlyOk: function (alllen) {
  //        var roamingJK = mars3d.widget.getClass(this.charsWidgetUri);
  //        if (roamingJK && roamingJK.isActivate) {
  //            roamingJK.changeFlyOk(alllen);
  //        }
  //    },
  //    getTerrainHeight: function (calback) {
  //        var that = this;
  //        var positions = this.arrLinePoint;
  //        var attr = this.flyEntity.data.properties.attr;

  //        var alllen = 0;
  //        var arrLength = [];
  //        var arrHbgd = [];
  //        var arrFxgd = [];
  //        var arrPoint = [];

  //        var arrBjgd;
  //        if (attr.showHeightWarn && attr.warnHeight)
  //            arrBjgd = [];

  //        var index = 0;
  //        function getLineFD() {
  //            index++;

  //            var arr = [positions[index - 1], positions[index]];
  //            util.terrainPolyline({
  //                viewer: that.viewer,
  //                positions: arr,
  //                calback: function (raisedPositions, noHeight) {
  //                    if (!that.isActivate) return;

  //                    var h1 = positions[index - 1].lonlat[2];
  //                    var h2 = positions[index].lonlat[2];
  //                    var hstep = (h2 - h1) / raisedPositions.length;

  //                    for (var i = 0; i < raisedPositions.length; i++) {
  //                        //已飞行长度
  //                        if (i != 0) {
  //                            alllen += Cesium.Cartesian3.distance(raisedPositions[i], raisedPositions[i - 1]);
  //                        }
  //                        arrLength.push(Number(alllen.toFixed(1)));

  //                        //坐标
  //                        var point = formatPositon(raisedPositions[i]);
  //                        arrPoint.push(point);

  //                        //海拔高度
  //                        var hbgd = noHeight ? 0 : point.z;
  //                        arrHbgd.push(hbgd);

  //                        //飞行高度
  //                        var fxgd = Number((h1 + hstep * i).toFixed(1));
  //                        arrFxgd.push(fxgd);

  //                        //报警高度
  //                        arrBjgd && arrBjgd.push(hbgd + attr.warnHeight);
  //                    }

  //                    if (index >= positions.length - 1) {
  //                        calback({
  //                            arrLength: arrLength,
  //                            arrFxgd: arrFxgd,
  //                            arrHbgd: arrHbgd,
  //                            arrPoint: arrPoint,
  //                            arrBjgd: arrBjgd
  //                        });
  //                    }
  //                    else {
  //                        getLineFD();
  //                    }
  //                }
  //            });
  //        }
  //        getLineFD();

  //    },

  //投影
  wallEntity: null,
  updateWall: function (positions) {
    var newposition = [];
    var minimumHeights = [];
    var maximumHeights = [];
    for (var i = 0; i < positions.length; i++) {
      newposition.push(positions[i].clone());
      var carto = Cesium.Cartographic.fromCartesian(positions[i]);
      minimumHeights.push(0);
      maximumHeights.push(carto.height);
    }
    this._wall_positions = newposition;
    this._wall_minimumHeights = minimumHeights;
    this._wall_maximumHeights = maximumHeights;

    if (!this.wallEntity) {
      var that = this;
      var wallattr = WallControl.attribute2Entity({
        style: { color: "#d7e600", outline: false, opacity: 0.5 },
      });
      wallattr.minimumHeights = new Cesium.CallbackProperty(function (time) {
        return that._wall_minimumHeights;
      }, false);
      wallattr.maximumHeights = new Cesium.CallbackProperty(function (time) {
        return that._wall_maximumHeights;
      }, false);
      wallattr.positions = new Cesium.CallbackProperty(function (time) {
        var position = Cesium.Property.getValueOrUndefined(
          that.flyEntity.position,
          that.viewer.clock.currentTime,
          that.positionScratch
        );
        that._wall_positions[that._wall_positions.length - 1] = position;

        return that._wall_positions;
      }, false);

      this.wallEntity = this.viewer.entities.add({
        wall: wallattr,
      });
    }
  },

  //获取已飞行完成的点
  getFlyOkPoints: function (position) {
    var arrnew = [];
    var alllen = 0;

    var thistime = this.viewer.clock.currentTime;
    var arr = this.arrLinePoint;
    for (var i = 0, length = arr.length; i < length; i++) {
      var item = arr[i];
      if (
        item.time.dayNumber > thistime.dayNumber ||
        item.time.secondsOfDay > thistime.secondsOfDay
      ) {
        var len = Cesium.Cartesian3.distance(
          position,
          i == 0 ? item : arr[i - 1]
        );
        alllen += len;
        break;
      }
      if (i > 0) {
        var len = Cesium.Cartesian3.distance(item, arr[i - 1]);
        alllen += len;
      }
      arrnew.push(item);
    }
    arrnew.push(position);

    return {
      positions: arrnew,
      len: alllen,
    };
  },
  //计算转弯
  getBezierSpline: function (pt1, pt2, pt3) {
    var npt1 = this.getPointForLineAlong(pt2, pt1, 300, 0.2);
    var npt2 = this.getPointForLineAlong(pt2, pt1, 200, 0.1);

    var npt3 = this.getPointForLineAlong(pt2, pt3, 200, 0.1);
    var npt4 = this.getPointForLineAlong(pt2, pt3, 300, 0.2);

    var line = turf.lineString([npt1, npt2, pt2, npt3, npt4]);
    var feature = turf.bezierSpline(line, { sharpness: 0.5 });

    var lonlats = [];
    var h2 = pt2[2];
    for (var i = 0; i < feature.geometry.coordinates.length; i++) {
      var item = feature.geometry.coordinates[i];
      lonlats.push(Number(item[0]));
      lonlats.push(Number(item[1]));
      lonlats.push(h2);
    }
    var positions = Cesium.Cartesian3.fromDegreesArrayHeights(lonlats);

    //this.viewer.entities.add({ polyline: { positions: positions,  width: 5,   } }); //test

    return positions;
  },
  //求在P1点到P2点的线上，距离P1点len米长度的点
  getPointForLineAlong: function (p1, p2, len, bl) {
    var point1 = Cesium.Cartesian3.fromDegrees(p1[0], p1[1], p1[2] || 0);
    var point2 = Cesium.Cartesian3.fromDegrees(p2[0], p2[1], p2[2] || 0);

    var alllen = Cesium.Cartesian3.distance(point1, point2); //米
    if (len == 0 || len >= alllen * bl) len = alllen * bl;

    var line = turf.lineString([p1, p2]);
    var along1 = turf.along(line, len / 1000, { units: "kilometers" });
    var jd = along1.geometry.coordinates[0];
    var wd = along1.geometry.coordinates[1];

    var h1 = p1[2];
    var h2 = p2[2];
    var height = h1 + ((h2 - h1) * len) / alllen;

    return [jd, wd, height];
  },

  //创建时间控制
  createTimeLine: function () {
    var viewerContainer = this.viewer._element;
    if (!this.viewer.animation) {
      // Animation
      var animationContainer = document.createElement("div");
      animationContainer.className = "cesium-viewer-animationContainer";
      viewerContainer.appendChild(animationContainer);
      var animation = new Cesium.Animation(
        animationContainer,
        new Cesium.AnimationViewModel(this.viewer.clockViewModel)
      );
      this.animation = animation;
    }
    if (!this.viewer.timeline) {
      // Timeline
      var timelineContainer = document.createElement("div");
      timelineContainer.className = "cesium-viewer-timelineContainer";
      timelineContainer.style.right = "0px";
      viewerContainer.appendChild(timelineContainer);
      var timeline = new Cesium.Timeline(timelineContainer, this.viewer.clock);
      timeline.addEventListener("settime", this.onTimelineScrubfunction, false);
      timeline.zoomTo(this.viewer.clock.startTime, this.viewer.clock.stopTime);
      this.timeline = timeline;
    }

    this.locationOldCss = $("#location_mars_jwd").css(["left", "bottom"]);
    $("#location_mars_jwd").css({ left: "170px", bottom: "25px" });

    this.legendOldCss = $(".distance-legend").css(["left", "bottom"]);
    $(".distance-legend").css({ left: "150px", bottom: "25px" });
  },
  onTimelineScrubfunction: function (e) {
    var clock = e.clock;
    clock.currentTime = e.timeJulian;
    clock.shouldAnimate = false;
  },
  removeTimeLine: function () {
    if (this.timeline)
      this.timeline.removeEventListener(
        "settime",
        this.onTimelineScrubfunction,
        false
      );

    try {
      var viewerContainer = this.viewer._element;
      if (this.animation) {
        viewerContainer.removeChild(this.animation.container);
        this.animation.destroy();
        this.animation = null;
      }
      if (this.timeline) {
        viewerContainer.removeChild(this.timeline.container);
        this.timeline.destroy();
        this.timeline = null;
      }
      $("#location_mars_jwd").css(this.locationOldCss);
      $(".distance-legend").css(this.legendOldCss);
    } catch (e) {
      console.log(e);
    }
  },
};
