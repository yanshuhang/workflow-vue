import Vue from 'vue'
import Router from 'vue-router'
import Board from '@/components/Board'
import ws from '@/components/Ws'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Board',
      component: Board
    },
    {
      path: '/ws',
      name: 'ws',
      component: ws
    }
  ]
})
