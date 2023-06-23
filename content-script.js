let delayedClickTimer = null;
let selectedDom = null;
const context = {
  enableClickInterceptor: true,
};

const EARLY_CLICK_SECONDS = 10;

const TRIGGER_TIME = {
  hour: 8,
  minute: 0,
  second: 0,
};
const getTriggerTime = () => {
  const then = new Date();

  then.setHours(TRIGGER_TIME.hour);
  then.setMinutes(TRIGGER_TIME.minute);
  then.setSeconds(TRIGGER_TIME.second);
  then.setMilliseconds(0);
  return then;
};

function getMillisUntil8am() {
  const now = new Date();
  const then = getTriggerTime();

  if (now >= then) {
    then.setDate(now.getDate() + 1);
  }

  const diff = then.getTime() - now.getTime();
  return diff;
}

const checkAllAncestors = (event, check, cb) => {
  let target = event.target;
  while (target !== this) {
    if (check(target)) {
      return cb(target);
    }
    target = target.parentNode;
  }
};

console.log(browser.storage);

document.body.addEventListener(
  "click",
  function (event) {
    // console.log("document click event listener...");

    // console.log("event.target", event.target);

    if (!context.enableClickInterceptor) {
      return;
    }

    checkAllAncestors(
      event,
      (target) => target.classList.contains("bookingBlock"),
      // (target) => true,
      async (target) => {
        try {
          // console.log("is .bookingBlock DOM !");
          event.preventDefault();
          event.stopImmediatePropagation();

          console.log("intercepted click");

          if (delayedClickTimer) {
            clearTimeout(delayedClickTimer);
          }

          const isClickingSameSlot = selectedDom === event.target;

          const { checkbox_aggressive_pre_click } =
            await browser.storage.local.get("checkbox_aggressive_pre_click");

          const timeTil8amInMs = getMillisUntil8am();
          const autoClickTime = (() => {
            if (isClickingSameSlot) {
              return 0;
            }
            if (checkbox_aggressive_pre_click) {
              return timeTil8amInMs - EARLY_CLICK_SECONDS * 1000;
            }
            return timeTil8amInMs;
          })();
          console.log(`auto click after ${autoClickTime / 1000}s...`);
          console.log(new Date(new Date().valueOf() + autoClickTime));

          // let background.js know when to call api
          browser.storage.local.set({
            autoSendTime: isClickingSameSlot
              ? new Date(new Date().valueOf() + 3000)
              : new Date(getTriggerTime()).valueOf(),
          });

          delayedClickTimer = setTimeout(() => {
            console.log("setTimeout trigger click!", new Date());
            context.enableClickInterceptor = false;
            event.target.click();
            setTimeout(() => {
              context.enableClickInterceptor = true;
            }, 0);
          }, autoClickTime);

          try {
            if (selectedDom) {
              selectedDom.style.color = "black";
            }
          } catch (e) {}
          selectedDom = event.target;
          selectedDom.style.color = checkbox_aggressive_pre_click
            ? "red"
            : "orange";
        } catch (e) {
          console.log("got error in click event listener", e);
        }
      }
    );
  },
  true
);

console.log("registered content-scripts.js");
