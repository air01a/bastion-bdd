<template>
  <div class="container">
    <h1 class="mt-4 text-center">Administration</h1>
    <div id="home" role="main">
      <ul id="tiles-panel">
        <li>
          <router-link class="tile-square" :to="{ path: '/admin/rights' }">
            <h1>Manage Rights</h1>
            <img alt="" src="img/rights.png" />
            <p>Create, delete, modify rights</p>
          </router-link>
        </li>
        <li>
          <router-link class="tile-square" :to="{ path: '/admin/users' }">
            <h1>Manage User</h1>
            <img alt="" src="img/user.png" />
            <p>Create, delete, modify users</p>
          </router-link>
        </li>
        <li>
          <router-link class="tile-square" :to="{ path: '/admin/database' }">
            <h1>Manage Database</h1>
            <img alt="" src="img/database.png" />
            <p>Create, delete, modify database</p>
          </router-link>
        </li>
        <li>
          <router-link class="tile-square" :to="{ path: '/admin/dbusers' }">
            <h1>Manage DB Users</h1>
            <img alt="" src="img/databaseuser.png" />
            <p>Create, delete, modify users in database</p>
          </router-link>
        </li>
        <li>
          <router-link class="tile-square" :to="{ path: '/admin/active' }">
            <h1>See Active Connections</h1>
            <img alt="" src="img/connections.png" />
            <p>See active connections</p>
          </router-link>
        </li>
      </ul>
    </div>
    <div>&nbsp;</div>
    <router-link :to="{ path: '/' }">Back</router-link>
  </div>
</template>

<script>
export default {
  name: "Administration",
  data: () => ({}),
  created() {},
  methods: {},
};
</script>




<style scoped>
* {
  -moz-box-sizing: border-box;
}

a {
  outline: 0 none;
  color: #0000ee;
}

div#home[role="main"] ul#tiles-panel {
  margin: 25px auto;
  width: 1125px;
}
ul,
ol {
  margin: 1em 0;
  padding: 0 0 0 40px;
}

div#home[role="main"] ul#tiles-panel li {
  display: inline-block;
  list-style: none outside none;
  margin: 0 8px 8px 0;
  vertical-align: top;
}

.tile-square {
  -moz-box-sizing: border-box;
  background: none repeat scroll 0 0 #f0f1f4;
  border-bottom: 3px solid #7b4f9d;
  display: inline-block;
  height: 176px;
  text-decoration: none;
  vertical-align: top;
  width: 176px;
}

.tile-square h1 {
  color: #253340;
  display: block;
  font-family: "Segoe UI", Segoe, "Trebuchet MS", Tahoma, Geneva, sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 148%;
  margin: 0;
  padding: 10px;
  text-decoration: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;
}

.tile-square img {
  #left: 50%;
  margin: 5px 0 10px -25px;
  position: relative;
}

.tile-square p {
  color: #6a747e;
  font-family: "Segoe UI", Segoe, "Trebuchet MS", Tahoma, Geneva, sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 148%;
  margin: 0;
  padding: 0 10px;
  text-align: center;
}
</style>