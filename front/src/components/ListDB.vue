<template id="listDB">
  <select v-model="selectedDB" v-on:input="$emit('input', $event.target.value)">
    <option
      v-for="value in options"
      v-bind:value="value.id"
      v-bind:key="value.id"
    >
      {{ value.db_name }}
    </option>
  </select>
</template>

<script>
import { get_all_db } from "../modules/admin.js";

export default {
  props: {
    selectedDB: Number,
  },
  data() {
    return { options: {} };
  },
  created() {
    get_all_db().then((res) => {
      this.options = res;
    });
  },
  template: "#listDB",
};
</script>

