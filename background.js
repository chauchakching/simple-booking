const sleep = (n) => new Promise((resolve) => setTimeout(resolve, n));

function getAutoSendSleepTime(targetDate) {
  var now = new Date();

  if (now >= targetDate) {
    targetDate.setDate(now.getDate() + 1);
  }

  var diff = targetDate.getTime() - now.getTime();
  return diff;
}

async function listener(details) {
  const url = new URL(details.url);
  console.log("onBeforeRequest api", url);

  const { checkbox_aggressive_pre_click } = await browser.storage.local.get(
    "checkbox_aggressive_pre_click"
  );

  if (!checkbox_aggressive_pre_click) {
    return {};
  }

  if (url.pathname === "/api/myorder/meAddFacilityBookingToCart") {
    const targetDate = (await browser.storage.local.get("autoSendTime"))
      ?.autoSendTime;
    if (!targetDate) return;
    const sleepTime = getAutoSendSleepTime(new Date(targetDate));
    console.log(`Caught the api! Gonna wait for ${sleepTime / 1000}s...`);
    await sleep(sleepTime);
    console.log("Click!", new Date());
  }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {
    urls: [
      // "https://member.scaa.org.hk/*",
      "https://member.scaa.org.hk/api/myorder/meAddFacilityBookingToCart",
    ],
    types: ["xmlhttprequest"],
  },
  ["blocking"]
);
