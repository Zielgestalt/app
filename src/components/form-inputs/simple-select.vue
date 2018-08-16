<template>
  <div class="v-simple-select">
    <select @change="$emit('input', $event.target.value)" :value="value" :disabled="disabled">
      <option disabled selected="value == null" value="">{{ placeholder || "--" }}</option>
      <slot />
    </select>
    <div class="preview">
      <template v-if="value">{{ value }}</template>
      <span class="placeholder" v-else>{{ placeholder || "--" }}</span>
      <i class="material-icons">arrow_drop_down</i>
    </div>
  </div>
</template>

<script>
export default {
  name: "v-simple-select",
  props: {
    value: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.v-simple-select {
  position: relative;

  .preview {
    height: var(--input-height);
    border: var(--input-border-width) solid var(--lighter-gray);
    border-radius: var(--border-radius);
    background-color: var(--white);
    display: flex;
    align-items: center;
    padding-left: 10px;

    i {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      user-select: none;
      pointer-events: none;
    }
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

  select:hover + .preview {
    border-color: var(--light-gray);
  }

  select:focus + .preview {
    border-color: var(--accent);
  }

  select[disabled] {
    cursor: not-allowed;

    & + .preview {
      background-color: var(--lightest-gray);
      border-color: var(--lighter-gray);
      color: var(--light-gray);
    }
  }
}
</style>
