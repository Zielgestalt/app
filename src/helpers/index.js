import Vue from "vue";
import convertRange from "convert-range";
import formatTitle from "@directus/format-title";
import micromustache from "micromustache";
import mousetrap from "mousetrap";
import shortid from "shortid";
import { enableBodyScroll, disableBodyScroll } from "body-scroll-lock";
import snarkdown from "snarkdown";
import date from "./date";
import componentExists from "./component-exists";
import formatFilters from "./format-filters";

const helpers = {
  formatTitle,
  date,
  convertRange,
  micromustache,
  shortid,
  componentExists,
  formatFilters,
  enableBodyScroll,
  disableBodyScroll,
  snarkdown,
  mousetrap
};

const helpersPlugin = {
  install(Vue) {
    // eslint-disable-line no-shadow
    Vue.prototype.$helpers = helpers;
  }
};

Vue.use(helpersPlugin);

export default helpers;
