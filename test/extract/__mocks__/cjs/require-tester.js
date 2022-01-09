// you can find things like this in UMD and AMD wrappers
var weHaveARequireAlready = typeof require == "function" && require;

if (typeof require === "function") {
  // do interesting stuff
}

doStuff(typeof require === "function");
