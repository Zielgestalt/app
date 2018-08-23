import Vue from "vue";
import lodash from "lodash";
import VueDraggable from "vuedraggable";
import VTooltip from "v-tooltip";
import VueTimeago from "vue-timeago";
import PortalVue from "portal-vue";
import axios from "axios";
import meta from "vue-meta";
import en from "date-fns/locale/en/";
import nl from "date-fns/locale/nl/";

import "./assets/global.scss";
import "./assets/tooltip.scss";
import "./assets/notyf.scss";
import "./globals";
import "./helpers/handle-focus";
import "./helpers/handle-drag";

// import "./registerServiceWorker";
import App from "./app.vue";
import router from "./router";
import { i18n } from "./lang/";
import store from "./store/";
import api from "./api";
import helpers from "./helpers";
import notify from "./notify";
import events from "./events/";

Vue.config.productionTip = false;

Object.defineProperties(Vue.prototype, {
  $lodash: { value: lodash },
  $api: { value: api },
  $notify: { value: notify },
  $axios: { value: axios }
});

Vue.use(events);
Vue.use(VTooltip, {
  defaultDelay: 500,
  defaultOffset: 2
});
Vue.use(PortalVue);
Vue.use(VueTimeago, {
  name: "v-timeago",
  locale: "en-US",
  locales: {
    en,
    nl
  }
});
Vue.use(meta);
Vue.component("draggable", VueDraggable);

/* eslint-disable no-new */
new Vue({
  render: h => h(App),
  router,
  i18n,
  store,
  api,
  helpers
}).$mount("#app");
