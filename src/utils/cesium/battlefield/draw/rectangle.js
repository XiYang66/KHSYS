const rectangle = (viewer, options) => {
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
  const coordinates = options.coordinates || [];
  const rectangle = viewer.entities.add({
    id,
    rectangle: {
      coordinates,
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
  rectangle.battlefield = options.battlefield;
  rectangle.isDrawing = options.isDrawing;
  return rectangle;
};

export default rectangle;
