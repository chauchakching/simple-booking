"use strict";

if (typeof browser == "undefined") {
  // `browser` is not defined in Chrome, but Manifest V3 extensions in Chrome
  // also support promises in the `chrome` namespace, like Firefox. To easily
  // test the example without modifications, polyfill "browser" to "chrome".
  globalThis.browser = chrome;
}

function getRadioGroupValue(name) {
  return Array.from(document.querySelectorAll(`input[name=${name}]`)).find(
    (dom) => dom.checked
  )?.value;
}
function setRadioGroupValue(name, value) {
  const dom = Array.from(document.querySelectorAll(`input[name=${name}]`)).find(
    (dom) => dom.value === value
  );
  if (dom) {
    console.log("set checked to true", dom);
    dom.checked = true;
  }
}

async function init() {
  /**
   * Register checkbox "checkbox_aggressive_pre_click"
   */
  const checkbox_aggressive_pre_click_dom = document.getElementById(
    "checkbox_aggressive_pre_click"
  );
  checkbox_aggressive_pre_click_dom.checked = (
    await browser.storage.local.get("checkbox_aggressive_pre_click")
  ).checkbox_aggressive_pre_click;
  checkbox_aggressive_pre_click_dom.onchange = async () => {
    await browser.storage.local.set({
      checkbox_aggressive_pre_click: checkbox_aggressive_pre_click_dom.checked,
    });
  };

  /**
   * Register radio "countdown_type"
   */
  const countdown_type_doms = document.querySelectorAll(
    "[name=countdown_type]"
  );
  setRadioGroupValue(
    "countdown_type",
    (await browser.storage.local.get("radio_countdown_type"))
      .radio_countdown_type
  );
  Array.from(countdown_type_doms).forEach((dom) => {
    dom.onchange = async () => {
      console.log("radio onchange()");
      await browser.storage.local.set({
        radio_countdown_type: getRadioGroupValue("countdown_type"),
      });
    };
  });
}
init();
