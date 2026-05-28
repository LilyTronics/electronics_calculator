/* Main application functions */

import { debugLog } from "./logger.js";
import { setRoute, getRoute, onRouteChange } from "./router.js";
import { moduleCache, loadModule } from "./module-cache.js";
import { render } from "./render.js";
import { calculators } from "../calculators/calculators.js";

const homeView = document.getElementById("homeView");
const calculatorView = document.getElementById("calculatorView");
const calculatorTitle = document.getElementById("calculatorTitle");
const backButton = document.getElementById("backButton");
const calculatorDescription = document.getElementById("calculatorDescription");
const calculatorInput = document.getElementById("calculatorInput");


// Render the tiles for the home screen
async function renderTiles()
{
    homeView.innerHTML = "";

    debugLog("Create tiles");
    for (const entry of calculators)
    {
        debugLog("Load module:", entry.module);
        const mod = await loadModule(entry.module);
        if (mod)
        {
            debugLog("Meta:", mod.meta);
            const tile = document.createElement("div");
            tile.classList.add("w3-card");
            tile.classList.add("w3-round");
            tile.classList.add("app-tile");
            tile.classList.add("w3-hover-theme-light");
            tile.innerHTML = `
                <div class="w3-center w3-bold">${mod.meta.name}</div>
                <div class="w3-center w3-small">${mod.meta.description ?? ""}</div>
            `;
            tile.addEventListener("click", () => setRoute(entry.module));
            debugLog("Add tile:", tile);
            homeView.appendChild(tile);
        }
    }
}

// Render the page according to the route
async function renderRoute()
{
    const id = getRoute();

    debugLog("Route:", id);

    // find module by id
    for (const entry of calculators)
    {
        if (id === entry.module)
        {
            debugLog("Loading:", entry.module);
            const mod = await loadModule(entry.module);
            if (mod)
            {
                debugLog("Module:", mod)

                // Hide tiles, show calculator
                homeView.classList.add("w3-hide");
                calculatorView.classList.remove("w3-hide");

                calculatorTitle.textContent = mod.meta.name;
                calculatorDescription.textContent = mod.meta.description + ".";

                debugLog("Render UI");
                if (render(calculatorInput, mod))
                {
                    mod.calculate();
                    return;
                }
            }
        }
    }

    debugLog("Not a calculator, show tiles");
    homeView.classList.remove("w3-hide");
    calculatorView.classList.add("w3-hide");
}

// Back button
backButton.addEventListener("click", () => setRoute(""));

// Init application
await renderTiles();
onRouteChange(renderRoute);
renderRoute();
