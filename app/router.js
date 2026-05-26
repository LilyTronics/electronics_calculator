/* Router functions */

export function getRoute()
{
  // "#route-name" -> "route-name"
  return location.hash.replace(/^#/, "");
}

export function setRoute(id)
{
  // set "#"
  location.hash = id ? `#${id}` : "";
}

export function onRouteChange(cb)
{
  window.addEventListener("hashchange", cb);
}
