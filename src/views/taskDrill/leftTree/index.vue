<template>
  <div class="leftTree">

    <div class="titleBox">
      <el-image :src="titleIcon" fit="cover" />
      <span>场景列表</span>
    </div>

    <div class="contentBox">
      <div class="search">
        <el-input v-model="state.searchForm.name" style="width: 75%" placeholder="请输入关键字" clearable />
        <el-image :src="search" fit="cover" />
        <el-image :src="add" fit="cover" />
      </div>
      <el-scrollbar height="calc(100% - 32px)">
        <el-tree default-expand-all :data="treeData" show-checkbox node-key="id" :props="defaultProps">
          <template #default="{ node, data }">
            <span class="tree-node">
              <span class="label" @contextmenu="handleClickRight($event, node.label)" @click="handleClick">{{ node.label
              }}</span>
              <div class="image">
                <el-image :src="connection" style="height: 16px;" fit="cover" />
                <el-image :src="addone" style="height: 16px;margin: 0 5px;" fit="none" />
                <el-image :src="Delete" style="height: 16px;" fit="cover" />
              </div>
            </span>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>


    <div class="contextmenuContainer" v-show="menuVisible">
      <div :style="contextMenuStyle" class="context-menu">
        <ul>
          <li @click="handleOptionClick('satellite')">卫星概况</li>
          <li @click="handleOptionClick('scene')">场景概况</li>
          <li @click="handleOptionClick('prop')">属性</li>
        </ul>
      </div>
    </div>

    <popup style="position: fixed; top: 20%; left: 30%;"></popup>
  </div>
</template>

<script lang="ts" setup>
// 引入vue3的api
import { ref, reactive, onMounted, defineExpose, onBeforeUnmount } from "vue"
import $bus from '@/utils/mitter'
import popup from '@/components/popup/index.vue'

import titleIcon from '@/assets/image/titleIcon.png'
import search from '@/assets/image/search.png'
import add from '@/assets/image/add.png'

import connection from '@/assets/image/connection.png';
import addone from '@/assets/image/add-one.png';
import Delete from '@/assets/image/delete.png';


const treeData = reactive([
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-122222'
          },
          {
            id: 10,
            label: 'Level three 1-1-2'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1'
      },
      {
        id: 6,
        label: 'Level two 2-2'
      }
    ]
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1'
      },
      {
        id: 8,
        label: 'Level two 3-2'
      },
      {
        id: 8,
        label: 'Level two 3-2'
      },
      {
        id: 8,
        label: 'Level two 3-2'
      },
      {
        id: 8,
        label: 'Level two 3-2'
      }
    ]
  }
]);
const state = reactive({
  searchForm: {
    name: '',
  }
})
const defaultProps = {
  children: 'children',
  label: 'label'
};
// 定义变量
let data = ref(0);

// 生命周期
onMounted(() => {
  $bus.emit('contextmenu/closePopup')
})
// 定义方法
const fun1 = () => {

}
let menuVisible = ref(false), menuX = ref(0), menuY = ref(0)
let contextMenuStyle = ref({ top: "0px", left: "0px" })
const handleClickRight = (e, v) => { // 显示自定义菜单 // 点击页面其他地方时隐藏菜单
  e.preventDefault()
  console.log(v);
  menuVisible.value = true;
  menuX.value = e.clientX;
  menuY.value = e.clientY;
  contextMenuStyle.value = {
    top: `${e.clientY}px`,
    left: `${e.clientX}px`,
  };

}
const handleClick = () => {
  menuVisible.value = false;
}
const contextmenu = window.addEventListener('click', () => {
  menuVisible.value = false;
});
onBeforeUnmount(() => {
  window.removeEventListener('click', contextmenu);
})

const handleOptionClick = (type) => {
  menuVisible.value = false;
  $bus.emit('contextmenu/openPopup', type)
}
//暴露方法
defineExpose({})
</script>

<style lang="scss" scoped>
.leftTree {
  pointer-events: auto;
  width: 350px;
  height: 98%;

  .contentBox {
    .search {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .el-image {
        cursor: pointer;
      }
    }
  }
}

.contextmenuContainer {}

.context-menu {
  position: fixed;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.context-menu ul {
  list-style: none;
  margin: 0;
  padding: 10px;
}

.context-menu li {
  padding: 8px 12px;
  cursor: pointer;
}

.context-menu li:hover {
  background-color: #eee;
}
</style>