const polygon = (viewer, options) => {
  const id = `${options.id}`;
  const material = options.color
    ? Cesium.Color.fromCssColorString(options.color)
    : Cesium.Color.RED.withAlpha(0.3);
  const outlineColor = options.outlineColor
    ? Cesium.Color.fromCssColorString(options.outlineColor)
    : Cesium.Color.RED;
  const height = options.height || 0;
  const extrudedHeight = options.extrudedHeight || 0;
  const onground = options.onground || false;
  const hierarchy = options.hierarchy || [];
  const polygon = viewer.entities.add({
    id,
    polygon: {
      hierarchy,
      material,
      heightReference: onground
        ? Cesium.HeightReference.CLAMP_TO_GROUND
        : Cesium.HeightReference.NONE,
      height,
      extrudedHeight,
      outline: true,
      outlineColor,
    },
  });
  polygon.battlefield = options.battlefield;
  polygon.isDrawing = options.isDrawing;
  return polygon;
};

export default polygon;
