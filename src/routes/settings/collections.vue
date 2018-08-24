<template>
  <div class="collections">
    <v-header :breadcrumb="breadcrumb">
      <template slot="buttons">
        <v-header-button
          icon="add"
          key="add"
          color="action"
          :label="$t('new')"
          @click="addNew = true" />
      </template>
    </v-header>
    <v-error
      v-if="items.length === 0"
      :title="$t('no_collections')"
      :body="$t('no_collections_body')"
      icon="error_outline" />

    <div class="table">
      <div class="header">
        <div class="row">
          <div class="cell">{{ $t('collection') }}</div>
          <div class="cell">{{ $t('note') }}</div>
        </div>
      </div>
      <div class="body">
        <router-link
          v-for="collection in items"
          :key="collection.collection"
          class="row"
          :to="collection.__link__">
          <div class="cell">{{ collection.name }}</div>
          <div class="cell">{{ collection.note }}</div>
          <button
            v-if="collection.managed"
            class="managed"
            @click.prevent.stop="toggleManage(collection)">{{ $t('dont_manage') }}</button>
          <button
            v-else
            class="not-managed"
            @click.prevent.stop="toggleManage(collection)">{{ $t('manage') }}</button>
        </router-link>
      </div>
    </div>

    <portal to="modal" v-if="addNew">
      <v-prompt
        v-model="newName"
        safe
        :confirm-text="$t('create')"
        :message="$t('create_collection')"
        :placeholder="$t('enter_collection_name')"
        :loading="adding"
        @cancel="addNew = false"
        @confirm="add" />
    </portal>

    <portal to="modal" v-if="dontManage">
      <v-confirm
        :message="$t('dont_manage_copy', { collection: dontManage.name })"
        color="danger"
        :confirm-text="$t('dont_manage')"
        @cancel="dontManage = null"
        @confirm="stopManaging" />
    </portal>
  </div>
</template>

<script>
export default {
  name: "settings-collections",
  metaInfo() {
    return {
      title: `${this.$t("settings")} | ${this.$t(
        "settings_collections_fields"
      )}`
    };
  },
  data() {
    return {
      addNew: false,
      newName: "",
      adding: false,

      dontManage: null
    };
  },
  computed: {
    items() {
      const collections = this.$store.state.collections || {};

      return Object.values(collections)
        .filter(
          collection => collection.collection.startsWith("directus_") === false
        )
        .map(collection => ({
          ...collection,
          name: this.$t(`collections-${collection.collection}`),
          __link__: `/settings/collections/${collection.collection}`
        }));
    },
    breadcrumb() {
      return [
        {
          name: this.$t("settings"),
          path: "/settings",
          color: "warning"
        },
        {
          name: this.$t("collections_and_fields"),
          path: "/settings/collections"
        }
      ];
    }
  },
  methods: {
    add() {
      this.adding = true;

      const id = this.$helpers.shortid.generate();
      this.$store.dispatch("loadingStart", { id });

      this.$api
        .createCollection({
          collection: this.newName,
          hidden: 0,
          fields: [
            {
              type: "INT",
              field: "id",
              interface: "primary-key",
              auto_increment: true,
              primary_key: true,
              length: 15
            }
          ]
        })
        .then(res => res.data)
        .then(collection => {
          this.$store.dispatch("loadingFinished", id);
          this.$store.dispatch("addCollection", collection);
          this.$router.push(`/settings/collections/${this.newName}`);
        })
        .catch(error => {
          this.$store.dispatch("loadingFinished", id);
          this.$events.emit("error", {
            notify: this.$t("something_went_wrong_body"),
            error
          });
        });
    },
    toggleManage(collection) {
      if (collection.managed) {
        this.dontManage = collection;
      } else {
        return this.$api
          .updateItem("directus_collections", collection.collection, {
            managed: true
          })
          .then(() => {
            return this.$store.dispatch("getCollections");
          })
          .catch(error => {
            this.$events.emit("error", {
              notify: this.$t("something_went_wrong_body"),
              error
            });
          });
      }
    },
    stopManaging() {
      return this.$api
        .updateItem("directus_collections", this.dontManage.collection, {
          managed: false
        })
        .then(() => {
          return this.$store.dispatch("getCollections");
        })
        .then(() => {
          this.dontManage = null;
        })
        .catch(error => {
          this.$events.emit("error", {
            notify: this.$t("something_went_wrong_body"),
            error
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.collections {
  padding-bottom: var(--page-padding-bottom);
}

.table {
  background-color: var(--white);
  position: relative;

  .row {
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid var(--lightest-gray);
    box-sizing: content-box;
    height: 40px;
  }

  .cell {
    flex-shrink: 0;
    flex-basis: 200px;
    padding-right: 20px;
    position: relative;
    overflow: hidden;
    max-height: 100%;
  }

  .header {
    position: relative;
    top: 0;
    height: var(--header-height);

    .row {
      height: 100%;
    }
  }

  a {
    text-decoration: none;

    &:hover {
      background-color: var(--highlight);
    }
  }

  button {
    border-radius: var(--border-radius);
    padding: 5px 10px;
    position: absolute;
    right: 20px;

    &.managed {
      background-color: var(--lightest-gray);
      color: var(--light-gray);

      &:hover {
        background-color: var(--danger);
        color: var(--white);
      }
    }

    &.not-managed {
      background-color: var(--accent);
      color: var(--white);

      &:hover {
        background-color: var(--accent-dark);
        color: var(--white);
      }
    }
  }
}
</style>
