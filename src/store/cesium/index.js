
import { defineStore } from 'pinia'

const CesiumStore = defineStore('cesium',{
    // 状态
    state: () => ({
        viewer: null,//视图
    }),
    // 方法
    actions: {
        // 设置viewer
        SET_VIEWER(viewer) {
            this.viewer = viewer;
        }
    },
})
export default CesiumStore;
