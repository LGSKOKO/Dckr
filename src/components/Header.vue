<template>
  <Header>
    <Menu mode="horizontal" theme="dark" :active-name="head_active_name">
      <div class="layout-logo-img"  @click="linkToIndex"><img src="../../public/favicon.jpg" alt="产品图标" style="height: 50px;"></div>
      <div class="layout-logo-text" @click="linkToIndex"><h1>Dckr</h1></div>
      <div class="layout-nav">
        <MenuItem name="1">
          <div @click="linkToView('createDockerfile',1)">
            <Icon type="logo-buffer"/>
            <span> Docker</span>
          </div>
        </MenuItem>
        <MenuItem name="2">
          <div @click="linkToView('createDockerCompose',2)">
            <Icon type="ios-keypad"></Icon>
            <span> Compose</span>
          </div>
        </MenuItem>
        <MenuItem name="3">
          <div @click="linkToView('createKubernetes',3)">
            <Icon type="md-boat"/>
            <span> Kubernetes</span>
          </div>
        </MenuItem>
        <MenuItem name="4">
          <div @click="linkToView('createRancher',4)">
            <Icon type="logo-freebsd-devil"/>
            <span> Rancher</span>
          </div>
        </MenuItem>
      </div>
    </Menu>
  </Header>
</template>

<script>

export default {
  name: "headerNav",
  props: {
    head_active_name: String,
  },
  methods: {
    linkToIndex(){
      this.$router.push("/index");
    },
    linkToView(viewName, index) {
      this.$emit('changeView', index);
      this.$router.push('/' + viewName);
    },
  }
}
</script>

<style scoped>
.layout-logo-img {
  width: 70px;
  height: 50px;
  color: white;
  border-radius: 3px;
  float: left;
  position: relative;
  left: 20px;
  padding-top: 8px;
  cursor: pointer;
}

.layout-logo-text {
  width: 80px;
  height: 50px;
  color: white;
  border-radius: 3px;
  float: left;
  position: relative;
  left: 1px;
  padding-top: 10px;
  cursor: pointer;
}

.layout-nav {
  width: 500px;
  margin: 0 auto;
  margin-right: 5px;
}
</style>