<template>
  <div class="project-switcher">
    <div
      :class="{
        slow: $store.getters.signalStrength == 1,
        disconnected: $store.getters.signalStrength == 0
      }"
      v-tooltip.left="{
        content: $store.state.auth.url + `<br>${$t('latency')}: ${$n(Math.round($store.state.latency[$store.state.latency.length - 1].latency))}ms`,
        boundariesElement: 'body'
      }">
      <v-signal class="icon" />
      <span class="no-wrap">{{ $store.state.auth.projectName }}</span>
      <i v-if="Object.keys(urls).length > 1" class="material-icons chevron">arrow_drop_down</i>
      <select v-if="Object.keys(urls).length > 1" :value="currentUrl" @change.prevent="changeUrl">
        <option
          v-for="(name, url) in urls"
          :key="name + url"
          :value="url"
          :checked="url === currentUrl || url + '/' === currentUrl">{{ name }}</option>
      </select>
    </div>
  </div>
</template>

<script>
import VSignal from "../../signal.vue";

export default {
  name: "project-switcher",
  components: {
    VSignal
  },
  data() {
    return {
      active: false
    };
  },
  computed: {
    urls() {
      return this.$lodash.mapKeys(
        window.__DirectusConfig__.api,
        (val, key) => (key.endsWith("/") === false ? key + "/" : key)
      );
    },
    currentUrl() {
      return (
        this.$store.state.auth.url + "/" + this.$store.state.auth.env + "/"
      );
    }
  },
  methods: {
    changeUrl(event) {
      const newUrl = event.target.value;
      this.$store.dispatch("changeAPI", newUrl);
    }
  }
};
</script>

<style lang="scss" scoped>
.project-switcher > div {
  height: calc(
    var(--header-height) + 1px
  ); /* Force border bottom to be aligned with listing headers */
  width: 100%;
  border-bottom: 1px solid var(--lightest-gray);
  display: flex;
  align-items: center;
  color: var(--accent);
  margin-bottom: 10px;
  position: relative;

  &.slow {
    color: var(--warning);
    svg {
      fill: var(--warning);
    }
    i {
      color: var(--warning);
    }
  }

  &.disconnected {
    color: var(--danger);
    svg {
      fill: var(--danger);
    }
    i {
      color: var(--danger);
    }
  }

  svg {
    fill: var(--accent);
  }

  i {
    color: var(--accent);
  }

  span {
    flex-grow: 1;
    line-height: 24px;
    text-align: left;
  }
}

.icon {
  width: 15px;
  height: 18px;
  margin-right: 10px;
  color: var(--light-gray);
  fill: var(--light-gray);
}

.form {
  margin: 20px auto;
}

select {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style>
