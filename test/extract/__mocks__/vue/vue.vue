<template>
  <div id="app"></div>
</template>

<script lang="ts">
import * as sub from "./sub";
import * as thing from "./javascriptThing";
import type {Ka, Ching} from "./sub/kaching";
import * as path from "path";

export default {
  name: 'app',
  mounted: function () {
    console.log(sub.version, thing(2), '=== 8', path.delimiter);
  }
}
</script>

<style>
@import 'coolstyles'
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
