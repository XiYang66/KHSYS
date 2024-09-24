const circle = (viewer, options) => {
  const id = `${options.id}`;
  const radius = options.radius || 100000;
  const material = options.color
    ? Cesium.Color.fromCssColorString(options.color)
    : Cesium.Color.RED.withAlpha(0.3);
  const outlineColor = options.outlineColor
    ? Cesium.Color.fromCssColorString(options.outlineColor)
    : Cesium.Color.RED;
  const onground = options.onground || false;
  const height = options.height || 0;
  const extrudedHeight = options.extrudedHeight || 0;
  const circle = viewer.entities.add({
    id,
    position: options.position,
    ellipse: {
      semiMinorAxis: radius,
      semiMajorAxis: radius,
      material,
      outline: true,
      outlineColor,
      heightReference: onground
        ? Cesium.HeightReference.CLAMP_TO_GROUND
        : Cesium.HeightReference.NONE,
      height,
      extrudedHeight,
    },
  });
  circle.battlefield = options.battlefield;
  circle.isDrawing = options.isDrawing;
  return circle;
};

export default circle;
