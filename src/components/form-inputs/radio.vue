<template>
  <div class="v-radio">
    <input
      :id="id"
      :name="name"
      :checked="shouldBeChecked"
      :value="value"
      type="radio"
      @change="updateInput">
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script>
export default {
  model: {
    prop: "modelValue",
    event: "change"
  },
  props: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      required: true
    }
  },
  computed: {
    shouldBeChecked() {
      return this.modelValue === this.value;
    }
  },
  methods: {
    updateInput() {
      this.$emit("change", this.value);
    }
  }
};
</script>

<style scoped>
input {
  opacity: 0;
  position: absolute;
}

label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

label::before {
  content: "radio_button_unchecked";
  direction: ltr;
  display: inline-block;
  font-family: "Material Icons";
  font-size: 24px;
  font-style: normal;
  font-weight: normal;
  letter-spacing: normal;
  line-height: 1;
  text-transform: none;
  white-space: nowrap;
  word-wrap: normal;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
  margin-right: 5px;
}

input:hover + label {
  color: var(--accent);
}

input:checked + label::before {
  content: "radio_button_checked";
  color: var(--accent);
}

input:checked + label {
  color: var(--accent);
}
</style>
