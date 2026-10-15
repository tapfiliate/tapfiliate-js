// Names that JavaScript itself and module loaders probe on any object. Forwarding them as tapfiliate.js
// methods made Tap look like a promise (`then`) or like a transpiled ES module (`__esModule`).
const notTapMethods = new Set(["then", "__esModule", "toJSON", "constructor"]);

const handler = {
  get: function(target, name) {
    if (Object.prototype.hasOwnProperty.call(target, name)) return target[name];
    if (typeof name !== "string" || notTapMethods.has(name)) return undefined;
    return (...args) => {
      window.__tap(name, ...args);
    };
  }
};

const target = {
  init: (accountId, createOptions = { integration: "npm-module" }, createCallback, detectOptions = {}, detectCallback) => {
    if (window.__tap) return;

    (function(t, a, p) {
      t.TapfiliateObject = a;
      t[a] = t[a] || function() {
        (t[a].q = t[a].q || []).push(arguments);
      };
    })(window, "__tap");

    var script = document.createElement("script");
    script.src = "https://script.tapfiliate.com/tapfiliate.js";
    script.type = "text/javascript";
    script.async = true;

    document.getElementsByTagName("head")[0].appendChild(script);

    // Ad blockers routinely block the script. 1.0.2 stayed silent; an uncaught error here would flood
    // every site's error monitoring once ^1.0.2 picks up this version, so it is a warning.
    script.addEventListener("error", function() {
      console.warn(`${this.src} failed to load.`);
    });

    window.__tap("create", accountId, createOptions, createCallback);
    window.__tap("detect", detectOptions, detectCallback);
  }
};

var Tap = new Proxy(target, handler);

export default Tap;
