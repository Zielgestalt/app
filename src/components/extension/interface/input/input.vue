<template>
  <component
    :is="componentName"
    :input-name="id"
    :name="name"
    :id="name"
    :value="value"
    :type="typeOrDefault"
    :length="lengthOrDefault"
    :readonly="readonly"
    :required="required"
    :loading="loading"
    :options="optionsWithDefaults"
    :new-item="newItem"
    :relation="relation"
    :fields="fields"
    :values="values"
    class="v-ext-input"
    @input="$emit('input', $event)"
    @setfield="$emit('setfield', $event)">
    <slot />
  </component>
</template>

<script>
import Vue from "vue";
import loadExtension from "../../../../helpers/load-extension";
import componentExists from "../../../../helpers/component-exists";
import InputFallback from "./input-fallback.vue";
import InputLoading from "./input-loading.vue";

export default {
  name: "v-ext-input",
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: null,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    length: {
      type: [String, Number],
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({})
    },
    newItem: {
      type: Boolean,
      default: false
    },
    relation: {
      type: Object,
      default: null
    },
    fields: {
      type: Object,
      default: null
    },
    values: {
      type: Object,
      default: null
    }
  },
  computed: {
    interfaces() {
      return this.$store.state.extensions.interfaces;
    },
    interface() {
      return this.interfaces && this.interfaces[this.id];
    },
    componentName() {
      return `input-${this.id}`;
    },
    typeOrDefault() {
      if (!this.interface) return null;
      return this.type ? this.type : Object.keys(this.interface.datatypes)[0];
    },
    lengthOrDefault() {
      if (!this.interface) return null;
      return this.length
        ? this.length
        : this.interface.datatypes[this.typeOrDefault];
    },
    optionsWithDefaults() {
      if (!this.interface) return {};

      const defaults = this.$lodash.mapValues(
        this.interface.options,
        settings => settings.default || null
      );

      return {
        ...defaults,
        ...this.options
      };
    }
  },
  watch: {
    id() {
      this.registerInterface();
    }
  },
  created() {
    this.registerInterface();
  },
  methods: {
    /**
     * Register the extension as component (if it hasn't been registered before yet)
     */
    registerInterface() {
      // If component already exists, do nothing
      if (componentExists(this.componentName)) return;

      // If the extension isn't known by the API (e.g. it's not in the store), register it with the
      //   fallback immediately
      if (!this.interface) {
        Vue.component(this.componentName, InputFallback);
        return;
      }

      const filePath = `${this.$api.url}/${this.interface.path.replace(
        "meta.json",
        "input.js"
      )}`;

      Vue.component(this.componentName, () => ({
        component: loadExtension(filePath),
        error: InputFallback,
        loading: InputLoading
      }));
    }
  }
};
</script>
