<template>
  <details
    :open="open"
    :class="type"
    class="v-details">
    <summary>{{ title }}</summary>
    <div class="content">
      <slot />
    </div>
  </details>
</template>

<script>
export default {
  name: "v-details",
  props: {
    title: {
      type: String,
      default: null
    },
    open: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "group",
      validator(val) {
        return ["group", "break"].includes(val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.v-details {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 30px;

  summary {
    border-top: 1px solid var(--lighter-gray);
    border-bottom: 1px solid var(--lighter-gray);
    margin-bottom: 20px;
    font-size: 18px;
    color: var(--gray);
    list-style-type: none;
    font-weight: 400;
    cursor: pointer;
    transition: var(--fast) var(--transition);

    background-color: var(--white);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    padding: 10px;
    border: 0;

    &::after {
      content: "keyboard_arrow_right";
      direction: ltr;
      display: inline-block;
      font-family: "Material Icons";
      font-size: 24px;
      color: var(--gray);
      font-style: normal;
      font-weight: normal;
      letter-spacing: normal;
      line-height: 1;
      text-transform: none;
      white-space: nowrap;
      word-wrap: normal;
      -webkit-font-feature-settings: "liga";
      -webkit-font-smoothing: antialiased;
      transition: var(--fast) var(--transition);
      width: 24px;
      height: 24px;
      float: right;
    }

    &::-webkit-details-marker {
      display: none;
    }

    &:hover,
    .user-is-tabbing &:focus {
      color: var(--darker-gray);
      &::after {
        color: var(--darker-gray);
      }
    }
  }

  .content {
    padding-bottom: 30px;
  }

  &.group {
    border: 1px solid var(--lighter-gray);
    border-radius: 3px;

    .content {
      padding: 20px;
    }

    summary {
      border: 0;
      margin-bottom: 0;
      padding-left: 20px;
      padding-right: 20px;
    }
  }

  &[open] {
    summary::after {
      transform: rotate(90deg);
    }
  }
}
</style>
