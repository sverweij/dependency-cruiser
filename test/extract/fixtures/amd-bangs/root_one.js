require([
  "fs",
  "../../../node_modules/commander/index",
  "./shared",
  "./excitingpolyfill.js!./hurray",
  "./one_only_one",
  "json!./somedata.json",
  "whuups!doesnotexist",
], function (fs, cmdr, shared, hurray, one_only_one, some_data, doesnotexist) {
  // do stuff
});
