/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
export const routes = [
  {
    path: "/",
    component: () => import("@/views/index/index"),
    hidden: true,
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

export function resetRouter() {
  location.reload();
}

export default router;
