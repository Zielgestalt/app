<template>
  <div class="header">
    <div class="row">
      <div class="cell">{{ $t("collection") }}</div>
      <div class="cell">
        <button type="button" v-tooltip="$t('click_to_toggle_all_none')" class="cell" @click="$emit('toggle-all', 'create')">{{ $t("create") }}</button>
      </div>
      <div class="cell">
        <button type="button" v-tooltip="$t('click_to_toggle_all_none')" class="cell" @click="$emit('toggle-all', 'read')">{{ $t("read") }}</button>
      </div>
      <div class="cell">
        <button type="button" v-tooltip="$t('click_to_toggle_all_none')" class="cell" @click="$emit('toggle-all', 'update')">{{ $t("update") }}</button>
      </div>
      <div class="cell">
        <button type="button" v-tooltip="$t('click_to_toggle_all_none')" class="cell" @click="$emit('toggle-all', 'delete')">{{ $t("delete") }}</button>
      </div>
      <div class="cell">
        <button type="button" v-tooltip="$t('click_to_toggle_all_none')" class="cell" @click="$emit('toggle-all', 'comment')">{{ $t("comment") }}</button>
      </div>
      <div class="cell">{{ $t("explain") }}</div>
      <div class="cell">{{ $t("fields") }}</div>
      <div class="cell">{{ $t("allowed_statuses") }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  border-bottom: 1px solid var(--lightest-gray);

  .cell {
    text-transform: uppercase;
    font-size: 10px;
    color: var(--gray);
    font-weight: 700;
  }

  button {
    transition: color var(--fast) var(--transition);
  }

  button:hover {
    transition: none;
    color: var(--dark-gray);
  }
}
</style>
