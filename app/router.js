// router.js
export function getRoute() {
  // "#pcb-trace-width" -> "pcb-trace-width"
  return location.hash.replace(/^#/, "");
}

export function setRoute(id) {
  // set "#"
  location.hash = id ? `#${id}` : "";
}

export function onRouteChange(cb) {
  window.addEventListener("hashchange", cb);
}
