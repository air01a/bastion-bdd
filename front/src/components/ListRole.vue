<template id="listRole">
  <select
    v-model="selectedRole"
    v-on:input="$emit('input', $event.target.value)"
  >
    <option
      v-for="value in options"
      v-bind:value="value.db_user_role"
      v-bind:key="value.db_user_role"
    >
      {{ value.db_user_role }}
    </option>
  </select>
</template>

<script>
import { get_all_roles } from "../modules/admin.js";

export default {
  props: {
    selectedRole: Number,
  },
  data() {
    return { options: {} };
  },
  created() {
    get_all_roles().then((res) => {
      this.options = res;
    });
  },
  template: "#listRole",
};
</script>

