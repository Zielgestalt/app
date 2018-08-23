import jwtPayload from "@rijk/jwt-payload";
import { mapKeys } from "lodash";
import formatTitle from "@directus/format-title";
import { i18n } from "../../../lang/";
import api from "../../../api";
import router from "../../../router";
import { resetState } from "../../index";
import {
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  REFRESH_TOKEN,
  REMOVE_AUTH_ERROR,
  LOGOUT,
  CHANGE_API
} from "../../mutation-types";
import { stopPolling } from "../../../polling";

const config = window.__DirectusConfig__; // eslint-disable-line
const urls = config
  ? mapKeys(config.api, (val, key) => (key.endsWith("/") ? key : key + "/"))
  : null;

function extractHostname(url) {
  let hostname;

  if (url.indexOf("://") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  hostname = hostname.split(":")[0];
  hostname = hostname.split("?")[0];

  return hostname;
}

export function login({ commit }, credentials) {
  commit(LOGIN_PENDING);

  const { url } = credentials;
  const parts = url.split("/");
  const env = parts.pop() || parts.pop();
  const newUrl = parts.join("/");

  return api
    .login({
      ...credentials,
      url: newUrl,
      env,
      persist: true
    })
    .then(info => {
      commit(LOGIN_SUCCESS, {
        ...info,
        projectName:
          urls[info.url + "/" + info.env + "/"] ||
          formatTitle(extractHostname(info.url))
      });
    })
    .catch(error => {
      commit(LOGIN_FAILED, error);
      throw error;
    });
}

export function loginSSO({ commit }, request_token) {
  commit(LOGIN_PENDING);

  /**
   * Yes this is a very hacky way of achieving this. It's just an alpha okay, take it easy.
   *
   * I have to refactor the auth flow quite a bit to accomodate for the project switcher modal too
   *   so I'm not too worried about hacking in this as a proof of concept.
   */
  const { url, env } = jwtPayload(request_token);
  api.url = url;
  api.env = env;

  return api
    .request(
      "POST",
      "/auth/access_token",
      {},
      {
        request_token
      }
    )
    .then(res => res.data)
    .then(({ token }) => {
      api.token = token;

      commit(LOGIN_SUCCESS, {
        env,
        url,
        token,
        projectName: config.api[url] || extractHostname(url)
      });
    });
}

export function refresh({ commit }, { token, url }) {
  commit(REFRESH_TOKEN, { token, url });
}

export function logout({ commit }, error) {
  return new Promise(resolve => {
    stopPolling();
    api.logout();
    resetState();
    i18n.locale = "en-US";
    router.push("/login");
    commit(LOGOUT, error);
    resolve();
  });
}

export function changeAPI({ commit, dispatch }, url) {
  dispatch("logout").then(() => {
    const parts = url.split("/");
    const env = parts.pop() || parts.pop();
    const newUrl = parts.join("/");

    commit(CHANGE_API, { url: newUrl, env });
  });
}

export function removeAuthError({ commit }) {
  commit(REMOVE_AUTH_ERROR);
}

export function clearAuth({ commit }) {
  commit(LOGOUT);
}
