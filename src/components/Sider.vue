<template>
  <Sider hide-trigger :style="{background: '#fff'}">
    <Menu :active-name="sider_active_name" theme="light" width="auto" :open-names="sider_open_name">
      <Submenu name="1">
        <template slot="title">
          <Icon type="logo-buffer" />
          Docker
        </template>
        <MenuItem name="1-1" @click.native="linkToView('createDockerfile','1')">向导式构建</MenuItem>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          <Icon type="ios-keypad"></Icon>
          Compose
        </template>
        <MenuItem name="2-1" @click.native="linkToView('createDockerCompose','2')">向导式构建</MenuItem>
      </Submenu>
      <Submenu name="3">
        <template slot="title">
          <Icon type="md-boat" />
          Kubernetes
        </template>
        <MenuItem name="3-1" @click.native="linkToView('createKubernetes','3')">向导式构建</MenuItem>
      </Submenu>
      <Submenu name="4">
        <template slot="title">
          <Icon type="logo-freebsd-devil" />
          Rancher
        </template>
        <MenuItem name="4-1" @click.native="linkToView('createRancher','4')">向导式构建</MenuItem>
      </Submenu>
    </Menu>
  </Sider>
</template>

<script>
export default {
  name: "siderNav",
  props: {
    sider_active_name: String,
    sider_open_name: Array,
  },
  methods: {
    linkToView(viewName,index) {
      this.$emit('changeView',index);
      this.$router.push('/' + viewName);
    },
  }
}
</script>

<style scoped>

</style>