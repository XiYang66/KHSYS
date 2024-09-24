const label = (viewer, options) => {
  const id = `${options.id}_label`;
  const text = options.text || "";
  const onground = options.onground || false;
  const label = viewer.entities.add({
    id,
    position: options.position,
    label: {
      text,
      font: "24px 楷体",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      heightReference: onground
        ? Cesium.HeightReference.CLAMP_TO_GROUND
        : Cesium.HeightReference.NONE,
      disableDepthTestDistance: 100000, //解决遮挡显示一半的问题
      scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
    },
  });
  label.battlefield = options.battlefield;
  label.isDrawing = options.isDrawing;
  return label;
};

export default label;
