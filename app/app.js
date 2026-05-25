// app.js
import { setRoute, getRoute, onRouteChange } from "./router.js";

// 1) Lijst van calculators (1 regel toevoegen = nieuwe tile)
const registry = [
  { path: "../calculators/pcb-trace-width.js" }
];

// 2) Cache: modules maar 1x laden
const moduleCache = new Map();

async function loadCalcModule(path) {
  if (!moduleCache.has(path)) {
    moduleCache.set(path, import(path));
  }
  return moduleCache.get(path);
}

// 3) UI refs
const homeView = document.getElementById("homeView");
const calcView = document.getElementById("calcView");
const tileGrid = document.getElementById("tileGrid");
const calcContainer = document.getElementById("calcContainer");
const backBtn = document.getElementById("backBtn");
const appTitle = document.getElementById("appTitle");

// 4) Render tiles from registry
async function renderTiles() {
  tileGrid.innerHTML = "";

  for (const entry of registry) {
    const mod = await loadCalcModule(entry.path);
    const meta = mod.meta;

    const tile = document.createElement("button");
    tile.className = "tile";
    tile.type = "button";
    tile.innerHTML = `
      <div class="tileIcon">${meta.icon ?? "🧮"}</div>
      <div class="tileTitle">${meta.name}</div>
      <div class="tileDesc">${meta.desc ?? ""}</div>
      <div class="tileCat">${meta.category ?? ""}</div>
    `;
    tile.addEventListener("click", () => setRoute(meta.id));
    tileGrid.appendChild(tile);
  }
}

// 5) Render current route
async function renderRoute() {
  const id = getRoute(); // "" or "pcb-trace-width"

  if (!id) {
    // show home
    homeView.classList.remove("hidden");
    calcView.classList.add("hidden");
    backBtn.classList.add("hidden");
    appTitle.textContent = "Elektronica Calculators";
    return;
  }

  // find module by id
  for (const entry of registry) {
    const mod = await loadCalcModule(entry.path);
    if (mod.meta?.id === id) {
      // show calculator
      homeView.classList.add("hidden");
      calcView.classList.remove("hidden");
      backBtn.classList.remove("hidden");
      appTitle.textContent = mod.meta.name;

      // render calculator UI
      mod.render(calcContainer);
      return;
    }
  }

  // unknown route -> go home
  setRoute("");
}

// Back button
backBtn.addEventListener("click", () => setRoute(""));

// Init
await renderTiles();
onRouteChange(renderRoute);
renderRoute();
