import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./styles/font-awesome-4.7.0/css/font-awesome.css";
import Vuex from "vuex";
import store from "./store";
import Vab from "@/utils/vab";



Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(Vab);


Vue.config.productionTip = false;
Vue.use(VXETable);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
