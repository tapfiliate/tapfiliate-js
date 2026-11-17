const scriptSrc = "https://script.tapfiliate.com/tapfiliate.js";

// Names that JavaScript itself and module loaders probe on any object. Forwarding them as tapfiliate.js
// methods made Tap look like a promise (`then`) or like a transpiled ES module (`__esModule`).
const notTapMethods = new Set(["then", "__esModule", "toJSON", "constructor"]);

// On the server (Next.js, Nuxt and other server-side rendering) there is no page to track: do nothing.
function inBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

// The queue tapfiliate.js replays when it loads. Created on the first call, so calls made before init() are
// kept instead of failing. `npm` marks it as ours, unlike the queue of a Tapfiliate snippet already on the page.
function tapQueue() {
  if (!window.__tap) {
    window.TapfiliateObject = "__tap";
    window.__tap = function() {
      (window.__tap.q = window.__tap.q || []).push(arguments);
    };
    window.__tap.npm = true;
  }
  return window.__tap;
}

const handler = {
  get: function(target, name) {
    if (Object.prototype.hasOwnProperty.call(target, name)) return target[name];
    if (typeof name !== "string" || notTapMethods.has(name)) return undefined;
    return (...args) => {
      if (!inBrowser()) return;
      tapQueue()(name, ...args);
    };
  }
};

const target = {
  init: (accountId, createOptions, createCallback, detectOptions = {}, detectCallback) => {
    if (!inBrowser()) return;

    // Already set up: by a Tapfiliate snippet on the page, by an earlier init(), or tapfiliate.js has loaded
    // (it replaces the queue with its own function).
    if (window.__tap && (!window.__tap.npm || window.__tap.npmInitialized)) return;

    var tap = tapQueue();
    tap.npmInitialized = true;

    // create and detect go before the calls queued earlier: tapfiliate.js replays the queue in order, and a
    // conversion takes the account id from create.
    tap.q = tap.q || [];
    // `integration` tells Tapfiliate the account tracks through this package; it stays when other create options are
    // passed (1.1.0 and earlier dropped it then), and an explicit `integration` still wins.
    var options = Object.assign({ integration: "npm-module" }, createOptions);
    tap.q.unshift(["create", accountId, options, createCallback], ["detect", detectOptions, detectCallback]);

    var script = document.createElement("script");
    script.src = scriptSrc;
    script.type = "text/javascript";
    script.async = true;

    document.getElementsByTagName("head")[0].appendChild(script);

    // Ad blockers routinely block the script. 1.0.2 stayed silent; an uncaught error here would flood
    // every site's error monitoring once ^1.0.2 picks up this version, so it is a warning.
    script.addEventListener("error", function() {
      console.warn(`${this.src} failed to load.`);
    });
  }
};

var Tap = new Proxy(target, handler);

export default Tap;
