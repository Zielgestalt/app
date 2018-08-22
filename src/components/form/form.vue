<template>
  <v-error
    v-if="groupedFields.length === 0"
    :title="$t('no_fields')"
    :body="$t('no_fields_body')"
    icon="error_outline" />
  <form v-else class="v-form flex-group">
    <div
      v-for="field in groupedFields"
      :class="[
        isGroup(field) ? null : `col-${field.view_width || 4}`,
        isGroup(field) ? 'group' : 'field'
      ]"
      :key="field.field">
      <v-group
        v-if="isGroup(field)"
        :values="values"
        :field="field"
        :readonly="readonly"
        :batch-mode="batchMode"
        :active-fields="activeFields"
        @activate="activateField"
        @deactivate="deactivateField"
        @stage-value="$emit('stage-value', $event)" />
      <v-field
        v-else
        :field="field"
        :values="values"
        :fields="fields"
        :readonly="isReadonly(field)"
        :blocked="batchMode && !activeFields.includes(field.field)"
        :batch-mode="batchMode"
        @activate="activateField"
        @deactivate="deactivateField"
        @stage-value="$emit('stage-value', $event)" />
    </div>
  </form>
</template>

<script>
import VField from "./field.vue";
import VGroup from "./group.vue";
import VError from "../error.vue";
import { defaultFull } from "../../store/modules/permissions/defaults";

export default {
  name: "v-form",
  components: {
    VField,
    VGroup,
    VError
  },
  props: {
    fields: {
      type: Object,
      required: true
    },
    values: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    batchMode: {
      type: Boolean,
      default: false
    },
    permissions: {
      type: Object,
      default: () => defaultFull
    }
  },
  data() {
    return {
      activeFields: []
    };
  },
  computed: {
    collection() {
      return Object.values(this.fields)[0].collection;
    },
    groupedFields() {
      const fieldsArray = Object.values(this.fields).filter(
        field =>
          this.permissions.read_field_blacklist.includes(field.field) === false
      );

      const result = fieldsArray
        .filter(field => field.type.toLowerCase() === "group")
        .map(group => ({
          ...group,
          children: []
        }));

      const nonGroupFields = fieldsArray.filter(
        field => field.type.toLowerCase() !== "group"
      );

      nonGroupFields.forEach(field => {
        if (field.group != null) {
          const groupIndex = this.$lodash.findIndex(
            result,
            group => group.id === field.group
          );
          return result[groupIndex].children.push(field);
        }

        return result.push(field);
      });

      return result.filter(
        field => field.hidden_input === false || field.hidden_input === "0"
      );
    }
  },
  methods: {
    isGroup(field) {
      return field.children && Array.isArray(field.children);
    },
    activateField(field) {
      if (!this.batchMode) return;

      this.activeFields = [...this.activeFields, field];
    },
    deactivateField(field) {
      if (!this.batchMode) return;

      this.activeFields = this.activeFields.filter(
        activeField => activeField !== field
      );
      this.$emit("unstage-value", field);
    },
    isReadonly(field) {
      if (this.readonly) return true;
      if (field.readonly === true || field.readonly === "1") return true;
      if (this.permissions.write_field_blacklist.includes(field.field))
        return true;

      return false;
    }
  }
};
</script>

<style lang="scss">
.v-form {
  width: 100%;
  max-width: 680px;

  @media (min-width: 680px) {
    &.flex-group,
    .flex-group {
      display: flex;
      flex-wrap: wrap;
      & > * {
        flex-shrink: 0;
        flex-basis: 0;
      }
    }

    .col-1 {
      flex-basis: var(--width-small);
      margin-right: 20px;
    }

    .col-2 {
      flex-basis: var(--width-normal);
      margin-right: 20px;
    }

    .col-3 {
      flex-basis: var(--width-large);
      margin-right: 20px;
    }

    .col-4 {
      flex-basis: var(--width-x-large);
    }
  }

  .field,
  .group {
    margin-bottom: 40px;
  }

  .group {
    flex-basis: 100%;
  }
}
</style>
