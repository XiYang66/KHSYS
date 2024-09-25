
<template>
  <div class="top">
    <div class="left">
      <li v-for="item in routerList.filter(ite => ite.meta.position == 'left')"
        :class="item.meta.index == state.active ? 'acitve' : ''" @click="routerClick(item)">{{ item.name }}</li>
    </div>
    <span class="titleText">
      考核实验室软件系统
    </span>
    <div class="right">
      <li v-for="item in routerList.filter(ite => ite.meta.position == 'right')"
        :class="item.meta.index == state.active ? 'acitve' : ''" @click="routerClick(item)">{{ item.name }}</li>
    </div>
  </div>
  <div class="content" style="background-color: rgb(7, 247, 147);">
    <router-view />
  </div>
  
  <!-- <CesiumBall /> -->
  
  
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, onMounted } from 'vue';
import CesiumBall from '@/components/cesiumBall/index.vue'
const router = useRouter();
const route = useRoute();
let routerList: any = reactive([]);

routerList = router.options.routes;
const state = reactive({
  active: 1,
})
onMounted(() => {
});

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
  background: url("@/assets/image/大标题.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .left,
  .right {
    display: flex;
    font-family: PangMenZhengDao;
    color: #FFFFFF;

    li {
      margin: 0 2px;
      font-size: 14px;
      cursor: pointer;

      &.acitve,
      &:hover {
        color: #56ADFF;
      }
    }
  }

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
}

.content {
  position: fixed;
  bottom: 0;
  z-index: 999;
  width: 100%;
  height: calc(100% - 62px);

  /* 使上面的盒子不拦截点击事件 */
  //pointer-events: none;
}
</style>
