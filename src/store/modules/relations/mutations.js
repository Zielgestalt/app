import Vue from "vue";
import { forEach } from "lodash";
import { SET_RELATIONS } from "../../mutation-types";

export default {
  [SET_RELATIONS](state, relations) {
    forEach(relations, (relation, i) => {
      Vue.set(state, i, relation);
    });
  }
};
