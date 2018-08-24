<template>
  <transition name="slide">
    <div class="v-modal">
      <div
        :class="actionRequired ? null : 'pointer'"
        class="modal-mask"
        @click="actionRequired ? null : $emit('close')" />
      <div class="modal-wrapper">
        <aside
          ref="modal"
          class="modal-container"
          :class="{ 'full-size': fullSize }"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          role="dialog"
          @keydown.esc="actionRequired ? null : $emit('close')">
          <focus-lock>
            <div role="document">
              <div
                id="modal-description"
                class="screen-reader-offscreen">
                {{ $t('dialog_beginning') }} {{ actionRequired ? null : $t('esc_cancel') }}
              </div>
              <header v-if="title">
                <h1
                  id="modal-title"
                  class="style-1">{{ title }}</h1>
                <button
                  v-if="!actionRequired"
                  @click="$emit('close')"><i class="material-icons">close</i></button>
              </header>

              <div class="tabs" v-if="tabs">
                <button
                  v-for="(info, id) in tabs"
                  :key="id"
                  :class="{ active: activeTab === id }"
                  :disabled="info.disabled"
                  @click="$emit('tab', id)">{{ info.text }}</button>
              </div>

              <div class="body">
                <template v-if="tabs">
                  <div
                    v-for="(info, id) in tabs"
                    :key="`tab-${id}`"
                    class="tab"
                    v-show="activeTab === id">
                    <slot :name="id" />
                  </div>
                </template>

                <slot v-else />
              </div>
              <div class="footer" :class="{ 'action-required': actionRequired }">
                <button
                  v-if="!actionRequired"
                  @click="$emit('close')">{{ $t('cancel') }}</button>
                <v-button
                  v-for="(button, id) in buttons"
                  class="confirm"
                  :key="id"
                  :loading="button.loading || false"
                  :disabled="button.disabled || false"
                  @click="$emit(id)">{{ button.text }}</v-button>
              </div>
            </div>
          </focus-lock>
        </aside>
      </div>
    </div>
  </transition>
</template>

<script>
import FocusLock from "vue-focus-lock";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

export default {
  name: "v-modal",
  components: {
    FocusLock
  },
  props: {
    actionRequired: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    },
    buttons: {
      type: Object,
      default: () => ({})
    },
    tabs: {
      type: Object,
      default: null
    },
    activeTab: {
      type: String,
      default: null
    },
    fullSize: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    disableBodyScroll(this.$refs.modal);
  },
  beforeDestroy() {
    enableBodyScroll(this.$refs.modal);
  }
};
</script>

<style lang="scss" scoped>
.v-modal {
  display: table;
  position: fixed;
  z-index: 500;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: var(--darkest-gray);
  opacity: 0.9;

  &.pointer {
    cursor: pointer;
  }
}

.modal-wrapper {
  position: relative;
  display: table-cell;
  vertical-align: middle;
  pointer-events: none;
  opacity: 1;
  z-index: +1;
}

.modal-container {
  position: relative;
  margin: 0 auto;
  width: 90%;
  max-width: 660px;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  transition: inherit;
  pointer-events: painted;
  cursor: default;
  overflow: hidden;

  &.full-size {
    max-width: none;
    width: calc(100% - 40px);
    margin: 20px;
  }

  h1 {
    color: var(--darker-gray);
    line-height: 24px; /* match close icon */
  }

  header,
  .footer {
    padding: 20px 30px;
  }

  header,
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer.action-required {
    justify-content: flex-end;
  }

  header {
    border-bottom: 1px solid var(--lightest-gray);
    position: sticky;
    top: 0;
    height: 60px;
  }

  .body {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    max-height: 70vh;
    position: relative;
    background-color: var(--body-background);
  }

  .footer {
    border-top: 1px solid var(--lightest-gray);
    height: 60px;
  }

  button:not(.confirm) {
    transition: var(--fast) var(--transition);
    color: var(--light-gray);

    &:hover {
      color: var(--dark-gray);
    }
  }
}

.screen-reader-offscreen {
  position: absolute;
  left: -99999px;
}

.slide-enter-active,
.slide-enter-active .modal-container {
  transition: var(--slow) var(--transition-in);
}

.slide-leave-active,
.slide-leave-active .modal-container {
  transition: var(--medium) var(--transition-out);
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
}

.tabs {
  display: flex;
  padding: 0;
  list-style: none;
  justify-content: center;
  border-bottom: 1px solid var(--lightest-gray);
  position: sticky;
  top: 0;
  background-color: var(--white);
  z-index: +1;

  button {
    flex-grow: 1;
    flex-shrink: 1;
    max-width: 120px;
    flex-basis: 120px;
    height: 50px;
    position: relative;
    color: var(--gray);

    text-decoration: none;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    position: relative;

    &:hover {
      color: var(--darker-gray);
    }

    &::after {
      content: "";
      display: block;
      width: 100%;
      position: absolute;
      height: 3px;
      bottom: -2px;
      background-color: var(--accent);
      transform: scaleY(0);
      transition: transform var(--fast) var(--transition-out);
    }

    &.active {
      color: var(--accent);

      &::after {
        transform: scaleY(1);
        transition: transform var(--fast) var(--transition-in);
      }
    }

    &[disabled] {
      &:hover {
        color: var(--lighter-gray);
      }

      color: var(--lighter-gray);
      cursor: not-allowed;
    }
  }
}

.tab {
  padding: 30px;
}
</style>
