import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import auth from "./modules/auth/";
import extensions from "./modules/extensions";
import edits from "./modules/edits";
import permissions from "./modules/permissions";
import users from "./modules/users";
import relations from "./modules/relations";

import state from "./state";
import * as actions from "./actions";
import * as getters from "./getters";
import mutations from "./mutations";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production"; // eslint-disable-line no-undef

const persistedPaths = [
  "auth.token",
  "auth.url",
  "auth.env",
  "auth.projectName",
  "edits"
];

const store = new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  strict: debug,
  modules: {
    auth,
    extensions,
    edits,
    permissions,
    users,
    relations
  },
  plugins: [
    createPersistedState({
      key: "directus",
      paths: persistedPaths
    })
  ]
});

export default store;

export function resetState() {
  const initialStateCopy = JSON.parse(JSON.stringify(state));

  // don't reset the last used url:
  initialStateCopy.auth.url = store.state.auth.url;

  store.replaceState(JSON.parse(JSON.stringify(initialStateCopy)));
}
