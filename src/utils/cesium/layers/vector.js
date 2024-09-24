// 加载kml图层
const addKMLDataSource = async (viewer, url) => {
  let dataSource = await Cesium.KmlDataSource.load(url, {
    camera: viewer.scene.camera,
    canvas: viewer.scene.canvas,
  });
  viewer.dataSources.add(dataSource);
  viewer.flyTo(dataSource);
  return dataSource;
};

// 删除kml图层
const removeKMLDataSource = (viewer, layer) => {
  viewer.dataSources.remove(layer);
};

export { addKMLDataSource, removeKMLDataSource };
