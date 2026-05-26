/* Main application functions */

import { setRoute, getRoute, onRouteChange } from "./router.js";
import { moduleCache, loadModule } from "./module-cache.js";
import { calculators } from "../calculators/calculators.js";

const homeView = document.getElementById("homeView");
// const calcView = document.getElementById("calcView");
// const calcContainer = document.getElementById("calcContainer");
// const backBtn = document.getElementById("backBtn");
// const appTitle = document.getElementById("appTitle");

async function renderTiles()
{
  homeView.innerHTML = "";

  for (const entry of calculators)
  {
    const mod = await loadModule(entry.module);
    const meta = mod.meta;

    const tile = document.createElement("div");
    tile.classList.add("w3-card");
    tile.classList.add("w3-round");
    tile.classList.add("app-tile");
    tile.innerHTML = `
      <div class="w3-center w3-bold">${meta.name}</div>
      <div class="w3-center w3-small">${meta.desc ?? ""}</div>
    `;
    tile.addEventListener("click", () => setRoute(entry.module));
    homeView.appendChild(tile);
  }
}

// // 5) Render current route
// async function renderRoute() {
//   const id = getRoute(); // "" or "pcb-trace-width"

//   if (!id) {
//     // show home
//     homeView.classList.remove("hidden");
//     calcView.classList.add("hidden");
//     backBtn.classList.add("hidden");
//     appTitle.textContent = "Elektronica Calculators";
//     return;
//   }

//   // find module by id
//   for (const entry of calculators) {
//     const mod = await loadModule(entry.module);
//     if (mod.meta?.id === id) {
//       // show calculator
//       homeView.classList.add("hidden");
//       calcView.classList.remove("hidden");
//       backBtn.classList.remove("hidden");
//       appTitle.textContent = mod.meta.name;

//       // render calculator UI
//       mod.render(calcContainer);
//       return;
//     }
//   }

//   // unknown route -> go home
//   setRoute("");
// }

// // Back button
// backBtn.addEventListener("click", () => setRoute(""));

// Init application
await renderTiles();
// onRouteChange(renderRoute);
// renderRoute();
