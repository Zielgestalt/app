<template>
  <div v-if="error">
    <v-header />
    <v-error
      v-if="error"
      icon="error_outline"
      color="warning"
      :title="$t('server_trouble')"
      :body="$t('server_trouble_copy')" />
  </div>

  <div class="settings-permissions" v-else>
    <v-header :breadcrumb="breadcrumb">

      <template slot="buttons">
        <v-header-button
          v-if="!isNew && !isSystem"
          :loading="removing"
          :label="$t('delete')"
          icon="close"
          color="danger"
          @click="confirmRemove = true" />
        <v-header-button
          :disabled="!editing"
          :loading="saving"
          :label="$t('save')"
          icon="check"
          color="action"
          @click="save" />
      </template>

    </v-header>

    <template v-if="$route.params.id != 1">
      <h2 class="style-1">{{ $t("permissions") }}</h2>
      <v-permissions
        :loading="!(permissions && statuses)"
        :permissions="permissions"
        :statuses="statuses"
        :fields="permissionFields"
        @input="setPermission" />
    </template>

    <h2 class="style-1">{{ $t("role_settings") }}</h2>
    <v-form
      v-if="fields && role"
      :fields="fields"
      :values="role"
      collection="directus_roles"
      @stage-value="stageValue" />

    <portal to="modal" v-if="confirmRemove">
      <v-confirm
        color="danger"
        :message="$t('delete_role_are_you_sure', { name: role.name })"
        :confirm-text="$t('delete')"
        :loading="removing"
        @cancel="confirmRemove = false"
        @confirm="remove" />
    </portal>
  </div>
</template>

<script>
import { keyBy, mapValues } from "lodash";
import formatTitle from "@directus/format-title";
import api from "../../api";
import VPermissions from "../../components/permissions/permissions.vue";
import { defaultNone } from "../../store/modules/permissions/defaults";

export default {
  name: "settings-permissions",
  metaInfo() {
    if (!this.role) return;

    return {
      title: `${this.$t("settings")} | ${this.$helpers.formatTitle(
        this.role.name
      )} ${this.$t("permissions")}`
    };
  },
  components: {
    VPermissions
  },
  data() {
    return {
      role: null,
      error: null,

      saving: false,

      roleEdits: {},

      confirmRemove: false,
      removing: false,

      fields: {},

      permissionsLoading: false,
      savedPermissions: {},
      permissionEdits: {},
      permissionFields: {},

      statuses: null
    };
  },
  computed: {
    isNew() {
      return this.$route.params.id === "+";
    },
    isSystem() {
      if (!this.role) return false;

      if (this.role.id === 1 || this.role.id === 2) return true;

      return false;
    },
    collections() {
      return this.$store.state.collections;
    },
    breadcrumb() {
      if (!this.role) return [];

      if (this.isNew) {
        return [
          {
            name: this.$t("settings"),
            path: "/settings",
            color: "warning"
          },
          {
            name: this.$t("roles"),
            path: "/settings/roles"
          },
          {
            name: this.$t("creating_role"),
            path: "/settings/roles/+"
          }
        ];
      }

      return [
        {
          name: this.$t("settings"),
          path: "/settings",
          color: "warning"
        },
        {
          name: this.$t("roles"),
          path: "/settings/roles"
        },
        {
          name: this.$helpers.formatTitle(this.role.name),
          path: `/settings/roles/${this.role.id}`
        }
      ];
    },
    editing() {
      return (
        Object.keys(this.roleEdits).length > 0 ||
        Object.keys(this.permissionEdits).length > 0
      );
    },
    permissions() {
      if (!this.statuses) return null;
      if (!this.collections) return null;

      const defaultPermissions = {};

      Object.keys(this.collections).forEach(collection => {
        const defaultPermission = Object.assign({}, defaultNone);

        defaultPermission.collection = collection;

        if (this.statuses[collection] == null) {
          defaultPermissions[collection] = defaultPermission;
          defaultPermissions[collection].$create = defaultPermission;
          return;
        }

        Object.keys(this.statuses[collection].mapping).forEach(status => {
          if (!defaultPermissions[collection]) {
            defaultPermissions[collection] = {};
          }

          defaultPermissions[collection][status] = {
            ...defaultPermission,
            status
          };
        });

        defaultPermissions[collection].$create = defaultPermission;
      });

      return this.$lodash.merge(
        {},
        defaultPermissions,
        this.savedPermissions,
        this.permissionEdits
      );
    }
  },
  beforeRouteEnter(to, from, next) {
    const { id } = to.params;

    const isNew = id === "+";

    if (isNew) {
      return api
        .getFields("directus_roles")
        .then(res => res.data)
        .then(fieldsArray => {
          next(vm => {
            const fields = keyBy(
              fieldsArray.map(field => ({
                ...field,
                name: formatTitle(field.field)
              })),
              "field"
            );

            vm.$data.fields = fields;
            vm.$data.role = mapValues(fields, field => field.default_value);
          });
        })
        .catch(error => {
          next(vm => {
            vm.$data.error = error;
          });
        });
    }

    return Promise.all([api.getRole(+id), api.getFields("directus_roles")])
      .then(([roleRes, fieldsRes]) => ({
        role: roleRes.data,
        fields: keyBy(
          fieldsRes.data.map(field => ({
            ...field,
            name: formatTitle(field.field)
          })),
          "field"
        )
      }))
      .then(({ role, fields }) => {
        next(vm => {
          vm.$data.role = role;
          vm.$data.fields = fields;
        });
      })
      .catch(error => {
        next(vm => {
          vm.$data.error = error;
        });
      });
  },
  created() {
    this.loadPermissions();
  },
  watch: {
    $route() {
      this.loadPermissions();
    }
  },
  methods: {
    stageValue({ field, value }) {
      this.roleEdits = {
        ...this.roleEdits,
        [field]: value
      };
    },
    save() {
      this.saving = true;

      const id = this.$helpers.shortid.generate();
      this.$store.dispatch("loadingStart", { id });

      this.saveRole()
        .then(this.savePermissions)
        .then(() => {
          this.$store.dispatch("loadingFinished", id);
          this.saving = false;
          this.$router.push("/settings/roles");
        })
        .catch(error => {
          this.$store.dispatch("loadingFinished", id);
          this.$events.emit("error", {
            notify: this.$t("something_went_wrong_body"),
            error
          });
        });
    },
    saveRole() {
      if (Object.keys(this.roleEdits).length === 0) return Promise.resolve();

      if (this.isNew) {
        return this.$api.createRole(this.roleEdits);
      }

      return this.$api.updateRole(this.role.id, this.roleEdits);
    },
    savePermissions() {
      if (Object.keys(this.permissionEdits).length === 0)
        return Promise.resolve();

      // We have to split up all the edits in updates and to-be-created items
      // because they need to be send to the API with a different HTTP Method
      // (PATCH vs POST)
      //
      // If the parent permission of the edit has an ID field, it exists in the DB

      let create = [];
      let update = [];

      Object.keys(this.permissionEdits).forEach(collection => {
        if (this.statuses[collection]) {
          Object.keys(this.permissionEdits[collection]).forEach(status => {
            const id =
              (this.savedPermissions[collection] &&
                this.savedPermissions[collection][status] &&
                this.savedPermissions[collection][status].id) ||
              null;

            if (id) {
              update.push({
                id,
                ...this.permissionEdits[collection][status]
              });
            } else {
              create.push({
                collection,
                status,
                role: this.role.id,
                ...this.permissionEdits[collection][status]
              });
            }
          });
        } else {
          if (this.permissionEdits[collection].$create) {
            const id =
              (this.savedPermissions[collection] &&
                this.savedPermissions[collection].$create &&
                this.savedPermissions[collection].$create.id) ||
              null;

            if (id) {
              update.push({
                id,
                ...this.permissionEdits[collection].$create
              });
            } else {
              create.push({
                collection,
                status: "$create",
                role: this.role.id,
                ...this.permissionEdits[collection].$create
              });
            }

            this.$delete(this.permissionEdits[collection], "$create");

            if (Object.keys(this.permissionEdits[collection]) === 0) return;
          }

          const id =
            (this.savedPermissions[collection] &&
              this.savedPermissions[collection].id) ||
            null;

          if (id) {
            update.push({
              id,
              ...this.permissionEdits[collection]
            });
          } else {
            create.push({
              collection,
              role: this.role.id,
              ...this.permissionEdits[collection]
            });
          }
        }
      });

      return Promise.all([
        create.length > 0
          ? this.$api.createPermissions(create)
          : Promise.resolve(),
        update.length > 0
          ? this.$api.updatePermissions(update)
          : Promise.resolve()
      ]);
    },
    remove() {
      if (this.isSystem) return;

      this.removing = true;

      const id = this.$helpers.shortid.generate();
      this.$store.dispatch("loadingStart", { id });

      return this.$api
        .deleteRole(this.role.id)
        .then(() => {
          this.$store.dispatch("loadingFinished", id);
          this.removing = false;
          this.$router.push("/settings/roles");
        })
        .catch(error => {
          this.$store.dispatch("loadingFinished", id);
          this.$events.emit("error", {
            notify: this.$t("something_went_wrong_body"),
            error
          });
        });
    },
    loadPermissions() {
      if (this.isNew) return;

      this.permissionsLoading = true;

      const id = this.$helpers.shortid.generate();
      this.$store.dispatch("loadingStart", { id });

      return Promise.all([
        this.$api.getAllFields(),
        this.$api.getPermissions({
          "filter[role][eq]": this.$route.params.id,
          limit: -1
        })
      ])
        .then(([fieldsRes, permissionsRes]) => ({
          fields: fieldsRes.data,
          permissions: permissionsRes.data
        }))
        .then(({ fields, permissions }) => {
          this.$store.dispatch("loadingFinished", id);
          const savedPermissions = {};

          permissions.forEach(permission => {
            if (permission.status == null) {
              savedPermissions[permission.collection] = {
                ...permission
              };
            } else {
              if (!savedPermissions[permission.collection])
                savedPermissions[permission.collection] = {};
              savedPermissions[permission.collection][permission.status] = {
                ...permission
              };
            }
          });

          this.permissionsLoading = false;
          this.savedPermissions = savedPermissions;

          this.statuses = this.$lodash.keyBy(
            fields
              .filter(field => field.type.toLowerCase() === "status")
              .map(field => ({
                mapping: field.options.status_mapping,
                collection: field.collection
              })),
            "collection"
          );

          this.permissionFields = this.$lodash.mapValues(
            this.$lodash.groupBy(fields, "collection"),
            array => this.$lodash.keyBy(array, "field")
          );
        })
        .catch(error => {
          this.$store.dispatch("loadingFinished", id);
          this.$events.emit("error", {
            notify: this.$t("something_went_wrong_body"),
            error
          });
        });
    },
    setPermission(value) {
      if (Array.isArray(value)) {
        return value.forEach(permission => this.stagePermission(permission));
      }

      return this.stagePermission(value);
    },
    stagePermission({ collection, permission, value, status = null }) {
      if (status === null) {
        return this.$set(this.permissionEdits, collection, {
          ...(this.permissionEdits[collection] || {}),
          [permission]: value
        });
      }

      if (this.permissionEdits[collection] == null) {
        this.$set(this.permissionEdits, collection, {});
      }

      return this.$set(this.permissionEdits, collection, {
        ...(this.permissionEdits[collection] || {}),
        [status]: {
          ...(this.permissionEdits[collection][status] || {}),
          [permission]: value
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.settings-permissions {
  padding: var(--page-padding);
  padding-bottom: var(--page-padding-bottom);
}

h2 {
  margin-bottom: 20px;

  &:not(:first-of-type) {
    margin-top: 60px;
  }
}
</style>
