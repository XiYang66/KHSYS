import * as Cesium from 'cesium';

// 加载影像服务
const addImageryProvider = (viewer, url) => {
  let imageryProvider = new Cesium.UrlTemplateImageryProvider({
    url,
    maximumLevel:0,
    minimumLevel:18,
  });
  let layer = viewer.imageryLayers.addImageryProvider(imageryProvider);
  return layer;
};
// 清除影像服务
const removeImageryProvider = (viewer, layer) => {
  let layerIndex = viewer.imageryLayers.indexOf(layer);
  viewer.imageryLayers.remove(viewer.imageryLayers.get(layerIndex));
};

export { addImageryProvider, removeImageryProvider };
