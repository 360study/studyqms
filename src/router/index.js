/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from "vue";
import VueRouter from "vue-router";
import store  from "../store";
import { Store } from "vuex";

Vue.use(VueRouter);
export const routes = [
  {
    path: "/",
    component: () => import("@/views/index/index"),
    hidden: true,
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/register",
    component: () => import("@/views/register/index"),
    hidden: true,
  },
  {
    path: "/error/401",
    name: "401",
    component: () => import("@/views/error/401"),
    hidden: true,
  },
  {
    path: "/error/404",
    name: "404",
    component: () => import("@/views/error/404"),
    hidden: true,
  },
];
const router = new VueRouter({
  routes: routes,
});


let isRedirecting = false //用于控制重复路由的标志，false表示第一次请求

router.beforeEach((to, from, next) => {  
  if (to.path == "/login") return next()
  else {
    if (typeof store === 'object') {
      console.log('成功')
      console.log(store)
      let user = store.state.user
      console.log('store')  // store 导入成功  
      if (user.accessToken) {
        if (!isRedirecting) {
          isRedirecting = true
          if (to.path == "/login")
            next('/')
          else
            next()
        }
        else {
          isRedirecting = false
          next(false)
        }
      }
      else {
      
        if (!isRedirecting) {
          isRedirecting = true
          next('/login')
        }
        else {
          isRedirecting = false
          next(false)
        }
      }
    }
    else {
      isRedirecting = false
      next(false)
    }
  }
})

router.afterEach(() => {
  // 清除标记
  isRedirecting = false  
})



export function resetRouter() {
  location.reload()
}

export default router;
