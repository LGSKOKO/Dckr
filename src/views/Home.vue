<template>
  <Card style="width:950px;background:#f6f6f6;">
    <div>
      <h1 style="text-align: center">Dckr——容器配置及编排的向导式构建工具</h1>
      <p style="text-align:center">
        Tips:Tab键跳转下一个输入框，Shit+Tab键返回上一个，Enter键有彩蛋
      </p>
      <div style="position: relative;height: 400px">
        <img src="../../public/favicon.jpg" alt="logo"  class="image">
      </div>
    </div>

  </Card>

</template>

<script>
import headerNav from '../components/Header.vue';
import siderNav from '../components/Sider.vue';

export default {
  name: 'Home',
  components: {
    headerNav,
    siderNav
  },
  data() {
    return {}
  },
}
</script>

<style scoped>
.image {
  height: 100%;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>