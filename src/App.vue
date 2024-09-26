<template>
  <!-- 标题 -->
  <div class="top">
    <span class="titleText">
      考核实验室软件系统
    </span>
    <div class="time">{{ state.date }} {{ state.time }} {{ state.week }}</div>
  </div>

  <!-- 路由区 -->
  <div class="routers">
    <li v-for="item in routerList" :class="item.meta.index == state.active ? 'acitve' : ''" @click="routerClick(item)">
      {{
      item.name }}</li>
  </div>
  <!-- 内容 -->
  <div class="content">
    <KeepAlive>
      <router-view />
    </KeepAlive>
  </div>
  <!-- cesium 底球 -->
  <CesiumBall />

</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, onMounted, onBeforeMount, watch } from 'vue';
import CesiumBall from '@/components/cesiumBall/index.vue'

import { getDateTime } from '@/utils'
const router = useRouter();
const route = useRoute();
let routerList: any = reactive([]);

routerList = router.options.routes;
const state = reactive({
  active: null,
  date: null,
  time: null,
  week: null,
})
watch(route, (vlaue) => {
  state.active = vlaue.meta.index
})
onBeforeMount(() => {
  getTime()
})
onMounted(() => {
  setInterval(() => {
    getTime()
  }, 1000);
});
// 获取当前时间
const getTime = () => {
  let { date, time, week } = getDateTime()
  state.date = date
  state.time = time
  state.week = week
}

const routerClick = (item) => {
  router.push(item.path)
  state.active = item.meta.index
}

</script>
<style scoped lang="scss">
.top {
  background: rgba(255, 192, 203, 0.4);
  height: 62px;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background: url("@/assets/image/标题bg.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .titleText {
    display: inline-block;
    background: linear-gradient(180deg, #FFFFFF 28.88%, #56ADFF 78.33%);
    font-family: PangMenZhengDao;
    font-size: 32px;
    letter-spacing: 10px;
    text-align: center;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .time {
    position: absolute;
    right: 20px;
    font-family: 壹心畅游体;
    font-size: 16px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);

  }
}

.routers {
  display: flex;
  position: fixed;
  z-index: 999;
  left: 0;
  top: 62px;
  justify-content: space-around;
  width: 100%;
  height: 38px;

  li {
    margin: 0 2px;
    font-size: 14px;
    cursor: pointer;
    font-family: PangMenZhengDao;
    box-sizing: border-box;
    padding: 5px 10px;
    font-size: 24px;
    font-weight: 400;
    color: #E0F0FF;

    background: url("@/assets/image/button.png") no-repeat;
    background-size: 100% 100%;

    &.acitve,
    &:hover {
      background: url("@/assets/image/buttonActive.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}

.content {
  position: fixed;
  bottom: 0;
  z-index: 999;
  width: 100%;
  height: calc(100% - 62px - 38px);
  padding: 15px;
  box-sizing: border-box;
  /* 使上面的盒子不拦截点击事件 */
  pointer-events: none;
}
</style>
