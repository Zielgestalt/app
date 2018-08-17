import store from "./store/";
import { loadLanguageAsync, availableLanguages } from "./lang/";
import { STORE_HYDRATED, HYDRATING_FAILED } from "./store/mutation-types";
import { startPolling } from "./polling";
import startIdleTracking from "./idle";

export default function hydrateStore() {
  return (
    Promise.all([
      store.dispatch("latency"),
      store.dispatch("getCurrentUser"),
      store.dispatch("getCollections"),
      store.dispatch("getSettings"),
      store.dispatch("getAllExtensions"),
      store.dispatch("getBookmarks"),
      store.dispatch("getUsers")
    ])
      // Getting permissions relies on the current user and collection info
      // that's why it's being called after the others are done
      .then(() => store.dispatch("getPermissions"))
      .then(() => {
        // Set accent color
        const customColor = store.state.settings.color;
        if (customColor) {
          document.documentElement.style.setProperty(
            "--accent",
            `var(--${customColor}-600)`
          );
        }

        if (availableLanguages.includes(store.state.currentUser.locale)) {
          loadLanguageAsync(store.state.currentUser.locale);
        }

        store.commit(STORE_HYDRATED, new Date());

        startPolling();
        startIdleTracking(store);
      })
      .catch(error => {
        store.commit(HYDRATING_FAILED, error);
        console.error(error); // eslint-disable-line no-console
      })
  );
}
