// 添加高程
const addTerrainProvider = async (viewer, url) => {
  // Cesium 1.107 版本之后
  // const terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(
  //   url,
  //   {
  //     requestWaterMask: true,//请求水域遮罩数据
  //     requestVertexNormals: true,//请求顶点法线数据
  //   }
  // );
  // Cesium 1.107 版本之前
  const terrainProvider = await Cesium.CesiumTerrainProvider(
    {
      url,
      requestWaterMask: true,//请求水域遮罩数据
      requestVertexNormals: true,//请求顶点法线数据
    }
  );
  viewer.terrainProvider = terrainProvider;

};

// 清除高程
const removeTerrainProvider = async (viewer) => {
  viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
}

export { addTerrainProvider, removeTerrainProvider };
