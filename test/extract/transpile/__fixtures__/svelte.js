import "svelte/internal/disclose-version";
import "svelte/internal/flags/legacy";
import * as $ from "svelte/internal/client";
import "./page.css";

var root = $.from_html(
  `<article><!> <section><h2>Pages in Storybook</h2> <img src="./my.png" alt="my alt"/></section></article>`,
);

export default function _unknown_($$anchor, $$props) {
  $.push($$props, false);

  let user = $.prop($$props, "user", 8, null);
  let onLogin = $.prop($$props, "onLogin", 8);
  const onLogout = {};
  var article = root();
  var node = $.child(article);

  Header(node, {
    get user() {
      return user();
    },
    get onLogin() {
      return onLogin();
    },
    onLogout,
  });

  $.next(2);
  $.reset(article);
  $.append($$anchor, article);
  $.bind_prop($$props, "onLogout", onLogout);
  return $.pop({ onLogout });
}
