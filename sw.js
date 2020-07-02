importScripts("/js/sw-utils.js");

const STATIC_CACHE = "STATIC-V4";
const DYNAMIC_CACHE = "DYNAMIC-V2";
const IMMUTABLE = "IMMUTABLE-V1";

const appShell = [
  "/",
  "/index.html",
  "/css/style.css",
  "img/favicon.ico",
  "img/avatars/hulk.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/spiderman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/wolverine.jpg",
  "js/app.js",
];

const appShellImmutable = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js",
];

self.addEventListener("install", (e) => {
  const cacheStatic = caches.open(STATIC_CACHE).then((c) => c.addAll(appShell));
  const immutableCache = caches
    .open(IMMUTABLE)
    .then((c) => c.addAll(appShellImmutable));
  console.log("Installing");

  e.waitUntil(Promise.all([cacheStatic, immutableCache]));
});

self.addEventListener("activate", (e) => {
  const resp = caches.keys().then((keys) => {
    keys.forEach((k) => {
      if (k !== STATIC_CACHE && k.includes("STATIC")) {
        return caches.delete(k);
      }
      if (k !== DYNAMIC_CACHE && k.includes("DYNAMIC")) {
        return caches.delete(k);
      }
    });
    console.log({ keys });
  });
  e.waitUntil(resp);
});

self.addEventListener("fetch", (e) => {
  caches.match(e.request).then((resp) => {
    if (resp) {
      console.log(resp);
      return resp;
    }
    return fetch(e.request).then((fetchRes) => {
      return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, fetchRes);
    });
  });
});
