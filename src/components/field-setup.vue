<template>
  <v-modal
    :title="$t('create_field')"
    :tabs="tabs"
    :active-tab="activeTab"
    :buttons="buttons"
    @tab="activeTab = $event"
    @next="nextTab"
    @close="$emit('close')">

    <template slot="interface">
      <h1 class="style-0">{{ $t("choose_interface") }}</h1>
      <p v-if="interfaceName">
        {{ $t("currently_selected", { thing: interfaces[interfaceName].name}) }}
      </p>
      <p v-else>
        {{ $t("select_interface_below" )}}
      </p>
      <div class="interfaces">
        <article
          v-for="ext in interfaces"
          :key="ext.id"
          :class="{ active: interfaceName === ext.id }"
          class="interface"
          @click="interfaceName = ext.id">
          <div class="header">
            <i class="material-icons">text_fields</i>
          </div>
          <div class="body">
            <h2>{{ ext.name }}</h2>
            <p>Directus Team</p>
          </div>
        </article>
      </div>
    </template>

    <template slot="schema" v-if="interfaceName">
      <h1 class="style-0">{{ $t("name_field", { field: $helpers.formatTitle(interfaceName).toLowerCase() }) }}</h1>
      <p>{{ $t("intelligent_defaults") }}</p>
      <form @submit.prevent class="schema">
        <div class="name">
          <label>{{ $t("name") }}<i v-tooltip="$t('required')" class="material-icons required">star</i> <v-input type="text" v-model="field" :placeholder="$t('db_name')" /></label>
          <label>{{ $t("display_name") }} <v-input type="text" disabled :value="displayName" :placeholder="$t('auto_generated')" /></label>
        </div>
        <label>{{ $t("note") }} <v-input type="text" v-model="note" :placeholder="$t('add_note')" /></label>
        <details class="advanced">
          <summary>{{ $t("show_advanced_options") }}</summary>
          <div class="advanced-form">
            <label>
              {{ $t("datatype") }}
              <v-simple-select v-model="type">
                <option v-for="(defaultLength, datatype) in availableDatatypes" :key="datatype" :value="datatype">
                  {{ datatype }}
                </option>
              </v-simple-select>
            </label>
            <label>{{ $t("length") }} <v-input type="number" v-model="length" /></label>
            <label>{{ $t("default") }} <v-input type="text" v-model="default_value" placeholder="NULL"/></label>
            <label>{{ $t("validation") }} <v-input type="text" v-model="validation" :placeholder="$t('regex')"/></label>
            <label class="toggle"><v-toggle v-model="required" /> {{ $t("required") }} </label>
            <label class="toggle"><v-toggle v-model="readonly" /> {{ $t("readonly") }} </label>
            <label class="toggle"><v-toggle v-model="unique" /> {{ $t("unique") }}</label>
            <label class="toggle"><v-toggle v-model="hidden_input" /> {{ $t("hidden_input") }}</label>
            <label class="toggle"><v-toggle v-model="hidden_list" />{{ $t("hidden_list") }}</label>
          </div>
        </details>
      </form>
    </template>

    <template slot="relationship" v-if="selectedInterfaceInfo">
      <h1 class="style-0">{{ $t('relationship_setup') }}</h1>
      <p>{{ $t('relationship_setup_copy', { relationship: $t(selectedInterfaceInfo.relationship) }) }}</p>

      <form class="m2o" @submit.prevent v-if="selectedInterfaceInfo.relationship === 'm2o'">
        <p class="this title">{{ $t('this_collection') }}</p>
        <v-simple-select class="this collection" disabled :value="collectionInfo.collection">
          <option :value="collectionInfo.collection" checked>{{ collectionInfo.collection }}</option>
        </v-simple-select>
        <v-simple-select class="this field" disabled :value="field">
          <option :value="field" checked>{{ field }}</option>
        </v-simple-select>

        <i class="material-icons">arrow_back</i>

        <p class="related title">{{ $t('related_collection') }}</p>
        <v-simple-select class="related collection" v-model="relationship.collection_b">
          <option
            v-for="({ collection }) in collections"
            :key="collection"
            :value="collection">{{ collection }}</option>
        </v-simple-select>
        <v-simple-select class="related field" v-model="relationship.field_b">
          <option
            v-for="({ field }) in fields(relationship.collection_b)"
            :key="field"
            :value="field">{{ field }}</option>
        </v-simple-select>
      </form>

      <form @submit.prevent v-else-if="selectedInterfaceInfo.relationship === 'o2m'">
      </form>

      <form @submit.prevent v-else-if="selectedInterfaceInfo.relationship === 'm2m'">
      </form>
    </template>

    <template slot="options">
      <h1 class="style-0">{{ $t('almost_done_options') }}</h1>
      <p>{{ $t('almost_done_copy') }}</p>
      <form @submit.prevent v-if="selectedInterfaceInfo" class="options">
        <div
          v-for="(option, optionID) in interfaceOptions.regular"
          class="options"
          :key="optionID">
          <label :for="optionID">{{ option.name }}</label>
          <p v-html="$helpers.snarkdown(option.comment)" />
          <v-ext-input
            :id="option.interface"
            :name="optionID"
            :type="option.type"
            :length="option.length"
            :readonly="option.readonly"
            :required="option.required"
            :loading="option.loading"
            :options="option.options"
            :value="options[optionID] || option.default"
            :fields="selectedInterfaceInfo.options"
            :values="options"
            @input="$set(options, optionID, $event)" />
        </div>

        <details v-if="Object.keys(interfaceOptions.advanced).length > 0" class="advanced">
          <summary>{{ $t("show_advanced_options") }}</summary>
          <div
            v-for="(option, optionID) in interfaceOptions.advanced"
            class="options"
            :key="optionID">
            <label :for="optionID">{{ option.name }}</label>
            <p v-html="$helpers.snarkdown(option.comment)" />
            <v-ext-input
              :id="option.interface"
              :name="optionID"
              :type="option.type"
              :length="option.length"
              :readonly="option.readonly"
              :required="option.required"
              :loading="option.loading"
              :options="option.options"
              :value="options[optionID] || option.default"
              :fields="selectedInterfaceInfo.options"
              :values="options"
              @input="$set(options, optionID, $event)" />
          </div>
        </details>
      </form>
    </template>

  </v-modal>
</template>

<script>
export default {
  name: "v-field-setup",
  props: {
    fieldInfo: {
      type: Object,
      required: true
    },
    collectionInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeTab: "interface",
      id: null,
      sort: null,
      saving: false,

      field: null,
      type: null,
      interfaceName: null,
      options: {},
      translation: {},
      readonly: false,
      required: false,
      unique: false,
      note: null,
      hidden_input: false,
      hidden_list: false,
      length: null,
      default_value: null,
      validation: null,

      relationship: {
        collection_a: this.collectionInfo.collection,
        field_a: null,
        collection_b: null,
        field_b: null,
        junction_collection: null,
        junction_key_a: null,
        junction_key_b: null
      }
    };
  },
  computed: {
    interfaces() {
      return this.$store.state.extensions.interfaces;
    },
    selectedInterfaceInfo() {
      if (!this.interfaceName) return null;

      return Object.assign({}, this.interfaces[this.interfaceName]);
    },
    relational() {
      if (!this.selectedInterfaceInfo) return null;

      return this.selectedInterfaceInfo.relationship != null;
    },
    interfaceOptions() {
      if (!this.selectedInterfaceInfo) return null;
      const options = this.selectedInterfaceInfo.options;
      const regular = this.$lodash.pickBy(options, opt => !opt.advanced);
      const advanced = this.$lodash.pickBy(
        options,
        opt => opt.advanced === true
      );

      return { regular, advanced };
    },
    collections() {
      return this.$store.state.collections;
    },
    schemaDisabled() {
      return !(this.interfaceName && this.interfaceName.length > 0);
    },
    optionsDisabled() {
      return this.schemaDisabled === true || !this.field;
    },
    displayName() {
      if (!this.field) return "";
      return this.$helpers.formatTitle(this.field);
    },
    availableDatatypes() {
      if (!this.interfaceName) return {};

      return this.interfaces[this.interfaceName].datatypes;
    },
    buttons() {
      let disabled = false;

      if (this.activeTab === "interface" && !this.interfaceName) {
        disabled = true;
      }

      if (this.activeTab === "schema" && !this.field) {
        disabled = true;
      }

      return {
        next: {
          disabled,
          text:
            this.activeTab === "options" ||
            (this.activeTab === "schema" && this.hasOptions === false)
              ? this.$t("save")
              : this.$t("next"),
          loading: this.saving
        }
      };
    },
    tabs() {
      const relational =
        this.selectedInterfaceInfo && this.selectedInterfaceInfo.relationship;

      const tabs = {
        interface: {
          text: this.$t("interface")
        },
        schema: {
          text: this.$t("schema"),
          disabled: !(this.interfaceName && this.interfaceName.length > 0)
        }
      };

      if (relational) {
        tabs.relationship = {
          text: this.$t("relationship"),
          disabled: this.schemaDisabled === true || !this.field
        };
      }

      if (
        this.interfaceName &&
        Object.keys(this.selectedInterfaceInfo.options).length > 0
      ) {
        let disabled = false;

        if (relational) {
          disabled = this.relationship === null;
        } else {
          disabled = this.schemaDisabled === true || !this.field;
        }

        tabs.options = {
          text: this.$t("options"),
          disabled
        };
      }

      return tabs;
    },
    hasOptions() {
      if (
        this.interfaceName &&
        Object.keys(this.interfaces[this.interfaceName].options).length > 0
      )
        return true;

      return false;
    }
  },
  created() {
    this.useFieldInfo();

    // Set the defaults for the relationship picker
    this.relationship.collection_b = Object.keys(this.collections)[0];
    this.relationship.field_b = Object.keys(
      this.fields(this.relationship.collection_b)
    )[0];
  },
  watch: {
    fieldInfo() {
      this.useFieldInfo();
    },
    interfaceName() {
      this.type = Object.keys(this.availableDatatypes)[0];
    },
    field(val) {
      this.field = val
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "_") // Replace spaces with _
        .replace(/[^\w_]+/g, "") // Remove all non-word chars
        .replace(/__+/g, "_") // Replace multiple _ with single _
        .replace(/^_+/, "") // Trim _ from start of text
        .replace(/_+$/, ""); // Trim _ from end of text

      this.relationship.field_a = this.field;
    },
    type(datatype) {
      this.length = this.availableDatatypes[datatype];
    }
  },
  methods: {
    nextTab() {
      switch (this.activeTab) {
        case "interface":
          this.activeTab = "schema";
          break;
        case "schema":
          if (this.hasOptions === false) {
            this.saveField();
          }
          if (this.selectedInterfaceInfo.relationship) {
            this.activeTab = "relationship";
          } else {
            this.activeTab = "options";
          }
          break;
        case "relationship":
          this.activeTab = "options";
          break;
        case "options":
        default:
          this.saveField();
          break;
      }
    },
    fields(collection) {
      return this.collections[collection].fields;
    },
    saveField() {
      const fieldInfo = {
        id: this.id,
        sort: this.sort,
        field: this.field,
        type: this.type,
        interface: this.interfaceName,
        default_value: this.default_value,
        options: this.options,
        readonly: this.readonly,
        required: this.required,
        unique: this.unique,
        note: this.note,
        hidden_input: this.hidden_input,
        hidden_list: this.hidden_list,
        length: this.length,
        validation: this.validation
      };

      this.saving = true;

      this.$emit("save", fieldInfo);
    },
    useFieldInfo() {
      if (!this.fieldInfo) return;

      Object.keys(this.fieldInfo).forEach(key => {
        if (this.fieldInfo[key] != null) this[key] = this.fieldInfo[key];
      });

      // 'interface' is a reserved word in JS, so we need to work around that
      this.interfaceName = this.fieldInfo.interface;
    }
  }
};
</script>

<style lang="scss" scoped>
.style-0 {
  max-width: 80%;
  margin-bottom: 30px;
}

p {
  line-height: 2;
  max-width: 70%;
}

.interfaces {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin-top: 30px;

  article {
    display: block;
    background-color: var(--white);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    flex-basis: 160px;
    flex-shrink: 0;
    overflow: hidden;
    transition: box-shadow var(--fast) var(--transition-out);
    cursor: pointer;

    .header {
      background-color: var(--lighter-gray);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px 0;
      transition: background-color var(--fast) var(--transition-out);

      i {
        font-size: 48px;
        color: var(--white);
      }
    }

    &.active {
      .header {
        background-color: var(--accent);
        transition: background-color var(--fast) var(--transition-in);
      }
    }

    .body {
      padding: 10px;
    }

    h2 {
      margin: 0;
      font-size: 13px;
    }

    p {
      text-transform: uppercase;
      font-weight: 700;
      color: var(--lighter-gray);
      font-size: 11px;
    }

    &:hover {
      box-shadow: var(--box-shadow-accent);
      transform: translateY(-1px);
      transition: box-shadow var(--fast) var(--transition-in);
    }
  }
}

form.schema {
  margin-top: 30px;

  label:not(.toggle) {
    > *:last-child {
      margin-top: 10px;
    }
  }

  .name {
    margin-bottom: 20px;
  }

  .advanced-form,
  .name {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr;

    .toggle {
      display: flex;
      align-items: center;
      text-transform: capitalize;
      font-size: 1rem;

      > *:first-child {
        margin-right: 10px;
      }
    }
  }
}

form.options {
  > div {
    margin-top: 30px;
  }
}

summary {
  color: var(--accent);
  cursor: pointer;
  text-align: center;
  margin: 30px 0;
  text-transform: capitalize;

  &:hover {
    color: var(--accent-dark);
  }

  &::-webkit-details-marker {
    display: none;
  }
}

.no-results {
  margin: 20px auto;
  min-height: 0;
}

.required {
  color: var(--accent);
  vertical-align: super;
  font-size: 7px;
}

.m2o {
  margin-top: 40px;
  display: grid;
  grid-template-areas:
    "this_title x rel_title"
    "this_collection x rel_collection"
    "this_field icon rel_field";
  grid-template-columns: 1fr 20px 1fr;
  grid-gap: 10px 0;
  justify-content: center;
  align-items: center;

  .this.title {
    grid-area: this_title;
  }

  .this.collection {
    grid-area: this_collection;
  }

  .this.field {
    grid-area: this_field;
  }

  .related.title {
    grid-area: rel_title;
  }

  .related.collection {
    grid-area: rel_collection;
  }

  .related.field {
    grid-area: rel_field;
  }

  i {
    grid-area: icon;
    font-size: 20px;
    color: var(--light-gray);
  }
}
</style>
