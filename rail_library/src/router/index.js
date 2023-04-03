import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login/index.vue'),
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import(/* webpackChunkName: "layout" */ '../layout'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/home/index.vue'),
      },
      {
        path: '/contractInformation',
        name: 'contractInformation',
        component: () =>
          import(/* webpackChunkName: "contractInformation" */ '../views/contractInformation'),
      },
      {
        path: '/personalHomepage',
        name: 'personalHomepage',
        component: () =>
          import(/* webpackChunkName: "personalHomepage" */ '../views/personalHomepage'),
        meta: {
          title: '应用详情',
        },
      },
      {
        path: '/personalContract',
        name: 'personalContract',
        component: () =>
          import(
            /* webpackChunkName: "personalContract" */ '../views/personalHomepage/personalContract'
          ),
      },
      {
        path: '/contractApproval',
        name: 'contractApproval',
        component: () =>
          import(/* webpackChunkName: "contractApproval" */ '../views/contractApproval'),
      },
      // 实习协议合同模板
      {
        path: '/internshipAgreement',
        name: 'internshipAgreement',
        component: () =>
          import(/* webpackChunkName: "internshipAgreement" */ '../views/internshipAgreement'),
      },
      // 保密协议合同模板
      {
        path: '/confidentialityAgreement',
        name: 'confidentialityAgreement',
        component: () =>
          import(
            /* webpackChunkName: "confidentialityAgreement" */ '../views/confidentialityAgreement'
          ),
      },
      // 项目合同模板
      {
        path: '/projectAontract',
        name: 'projectAontract',
        component: () =>
          import(/* webpackChunkName: "projectAontract" */ '../views/projectAontract'),
      },
      // 劳动合同模板
      {
        path: '/laborContract',
        name: 'laborContract',
        component: () => import(/* webpackChunkName: "laborContract" */ '../views/laborContract'),
      },
      // 用户信息
      {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import(/* webpackChunkName: "userInfo" */ '../views/userInfo'),
      },
      // 起草实习合同详情
      {
        path: '/internship',
        name: 'internship',
        component: () =>
          import(/* webpackChunkName: "internship" */ '../views/contractDetails/internship.vue'),
      },
      // 起草劳动合同详情
      {
        path: '/labour',
        name: 'labour',
        component: () =>
          import(/* webpackChunkName: "labour" */ '../views/contractDetails/labour.vue'),
      },
      // 起草保密协议详情
      {
        path: '/secrecy',
        name: 'secrecy',
        component: () =>
          import(/* webpackChunkName: "secrecy" */ '../views/contractDetails/secrecy.vue'),
      },
      // 起草项目合同详情
      {
        path: '/project',
        name: 'project',
        component: () =>
          import(/* webpackChunkName: "project" */ '../views/contractDetails/project.vue'),
      },
      // 预警系统
      {
        path: '/earlyWarningSystem',
        name: 'earlyWarningSystem',
        component: () =>
          import(/* webpackChunkName: "earlyWarningSystem" */ '../views/earlyWarningSystem'),
      },
      // 自定义合同
      {
        path: '/richTextEditor',
        name: 'richTextEditor',
        component: () => import(/* webpackChunkName: "richTextEditor" */ '../views/richTextEditor'),
      },
      // 自定义合同详情
      {
        path: '/richtext',
        name: 'richtext',
        component: () =>
          import(/* webpackChunkName: "richtext" */ '../views/contractDetails/richtexteditor'),
      },
    ],
  },
  {
    path: '/map',
    name: 'map',
    component: () => import(/* webpackChunkName: "map" */ '../views/map/index.vue'),
  },
  {
    path: '/map2D',
    name: 'map2D',
    component: () => import(/* webpackChunkName: "map" */ '../views/map/map2D.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
