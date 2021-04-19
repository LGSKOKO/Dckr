import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/index',
  },
  {
    path: '/index',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/createDockerfile',
    name: 'CreateDockerfile',
    component: () => import( '../views/CreateDockerfile.vue')
  },
  {
    path: '/createDockerCompose',
    name: 'CreateDockerCompose',
    component: () => import('../views/CreateDockerCompose')
  },
  {
    path: '/createKubernetes',
    name: 'CreateKubernetes',
    component: () => import( '../views/CreateKubernetes.vue')
  },
  {
    path: '/createRancher',
    name: 'CreateRancher',
    component: () => import('../views/CreateRancher.vue')
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
