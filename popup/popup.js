"use strict";

if (typeof browser == "undefined") {
  // `browser` is not defined in Chrome, but Manifest V3 extensions in Chrome
  // also support promises in the `chrome` namespace, like Firefox. To easily
  // test the example without modifications, polyfill "browser" to "chrome".
  globalThis.browser = chrome;
}

const checkbox_aggressive_pre_click_dom = document.getElementById(
  "checkbox_aggressive_pre_click"
);
checkbox_aggressive_pre_click_dom.onchange = async () => {
  await browser.storage.local.set({
    checkbox_aggressive_pre_click: checkbox_aggressive_pre_click_dom.checked,
  });
};

async function init() {
  checkbox_aggressive_pre_click_dom.checked = (
    await browser.storage.local.get("checkbox_aggressive_pre_click")
  ).checkbox_aggressive_pre_click;
}
init();
