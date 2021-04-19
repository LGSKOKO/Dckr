<template>
  <div class="layout" id="minHeight">
    <Layout>
      <HeaderNav :head_active_name="head_active_name" v-on:changeView="changeView"></HeaderNav>
      <Layout :style="{padding: '40px 0',width:'1200px',margin:'auto'}">
        <Content :style="{padding: '24px 0', minHeight: '280px', background: '#fff'}">
          <Layout class="ivu-layout-has-sider">
            <SiderNav :sider_active_name="sider_active_name" :sider_open_name="sider_open_name"
                      v-on:changeView="changeView"></SiderNav>
            <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
              <router-view/>
            </Content>
          </Layout>
        </Content>
      </Layout>
      <Footer class="layout-footer-center">Create by &copy; ligensheng</Footer>
    </Layout>
  </div>
</template>

<script>
import HeaderNav from "@/components/Header";
import SiderNav from "@/components/Sider";

export default {
  components: {
    HeaderNav,
    SiderNav
  },
  watch: {
    sider_open_name: {
      handler() {
      },
      deep: true,
    }
  },
  mounted() {
    minHeight();
  },
  data() {
    return {
      sider_active_name: "0-1",
      sider_open_name: ['0'],
      head_active_name: '0',
    }
  },
  methods: {
    changeView(index) {
      this.sider_active_name = index + "-" + "1";
      this.sider_open_name.push(index.toString());
      this.head_active_name = index.toString();
    },

  }
}

//js设置最小高度
function minHeight() {
  let winHeight = 0;
  let innerHeight = window.innerHeight;
  let clientHeight = 0;
  if ((document.body) && (document.body.clientHeight)) {
    clientHeight = document.body.clientHeight ;
  }
  //通过Document对body进行检测，获取浏览器可视化高度
  if (document.documentElement && document.documentElement.clientHeight) {
    let height = document.documentElement.clientHeight;
    clientHeight = clientHeight > height ? clientHeight : height;
  }
  winHeight = clientHeight > innerHeight ? clientHeight : innerHeight;
  //DIV高度为浏览器窗口最小高度
  document.getElementById("minHeight").style.minHeight = winHeight + "px";
}

// window.onresize = minHeight; //窗口或框架被调整大小时执行

</script>

<style scoped>

.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.layout-footer-center {
  text-align: center;
}
</style>

