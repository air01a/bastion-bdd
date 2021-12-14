<template id="listUsers">
  <select
    v-model="selectedUser"
    v-on:input="$emit('input', $event.target.value)"
  >
    <option
      v-for="value in options"
      v-bind:key="value.user_id"
      v-bind:value="value.user_id"
    >
      {{ value.user_mail }}
    </option>
  </select>
</template>

<script>
import { get_all_users } from "../modules/admin.js";

export default {
  props: {
    selectedUser: Number,
  },
  data() {
    return { options: {} };
  },
  created() {
    get_all_users().then((res) => {
      this.options = res;
    });
  },
  template: "#listUsers",
};
</script>

