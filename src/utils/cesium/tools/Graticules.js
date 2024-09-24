export class Graticules {
  constructor(viewer, options) {
    let color = options?.color ?? "#ffffff";
    let alpha = options?.alpha ?? 0.5;
    let width = options?.width ?? 0.5;
    this.viewer = viewer;
    this.labels = [];
    this.lines = this.viewer.scene.primitives.add(
      new Cesium.PolylineCollection()
    );
    this.color = Cesium.Color.fromCssColorString(color).withAlpha(alpha);
    this.width = width;
    // 隐藏默认的经纬网格
    this.viewer.scene.globe.showGroundAtmosphere = false;
    this.viewer.scene.globe.showWaterEffect = false;
  }
  // 绘制经线
  drawLongLines() {
    for (let lon = -180; lon <= 180; lon += 10) {
      const positions = [];
      for (let lat = -90; lat <= 90; lat += 1) {
        const cartographic = Cesium.Cartographic.fromDegrees(lon, lat);
        const position =
          this.viewer.scene.globe.ellipsoid.cartographicToCartesian(
            cartographic
          );
        positions.push(position);
      }
      this.lines.add({
        positions: positions,
        width: this.width,
        material: new Cesium.Material({
          fabric: {
            type: "Color",
            uniforms: {
              color: this.color,
            },
          },
        }),
      });
      this.labels.push(
        this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(lon, 360),
          label: {
            text: lon.toString() + "°",
            font: "12px sans-serif",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          },
        })
      );
    }
  }
  // 绘制纬线
  drawLatLines() {
    // 计算纬度线的位置
    for (let lat = -90; lat <= 90; lat += 10) {
      const positions = [];
      for (let lon = -180; lon <= 180; lon += 1) {
        const cartographic = Cesium.Cartographic.fromDegrees(lon, lat);
        const position =
          this.viewer.scene.globe.ellipsoid.cartographicToCartesian(
            cartographic
          );
        positions.push(position);
      }
      this.lines.add({
        positions: positions,
        width: this.width,
        material: new Cesium.Material({
          fabric: {
            type: "Color",
            uniforms: {
              color: this.color,
            },
          },
        }),
      });
      this.labels.push(
        this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(180, lat),
          label: {
            text: lat.toString() + "°",
            font: "12px sans-serif",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            clampToGround: true,
          },
        })
      );
    }
  }
  render() {
    this.drawLongLines();
    this.drawLatLines();
    return this.lines;
  }
  clear() {
    this.lines.removeAll();
    this.clearLabel();
  }
  destroy() {
    this.lines.destroy();
    this.clearLabel();
  }
  clearLabel() {
    this.labels.forEach((item) => {
      this.viewer.entities.remove(item);
    });
  }
}
