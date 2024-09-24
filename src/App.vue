<template>
  <div class="top">
    <span class="titleText">
      考核实验室软件系统
    </span>
  </div>
  <div class="content">
    <router-view />
  </div>

  <CesiumBall/>

</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, onMounted } from 'vue';
import CesiumBall from '@/views/cesiumBall/index.vue'
const router = useRouter();
const route = useRoute();
let routerList: any = reactive([]);

routerList = router.options.routes;

onMounted(() => {
});
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
  justify-content: center;

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
  pointer-events: none;
}
</style>
