/* Renders the module content and applies proper styles */

import { debugLog } from "./logger.js";
import { debounce } from "./input_debounce.js";

export function render(container, mod)
{
    container.innerHTML = "";
    try
    {
        mod.render(container);
        applyDefaults(mod);
        applyStyles(container, mod);
        return true;
    }
    catch (error)
    {
        debugLog("Error rendering view:", error)
    }
    return false;
}

function applyDefaults(mod)
{
    // Apply default values from module or from local storage if they exist
    Object.entries(mod.defaults).forEach(([key, value]) => {
        let elm = document.getElementById(key);
        if (elm)
        {
            elm.value = value;
        }
        // Could be radio button group
        elm = document.querySelector(`input[name="${key}"][value="${value}"]`);
        if (elm)
        {
            // Click also fires the event
            elm.click();
        }
    });
}

function applyStyles(container, mod)
{
    // Tables
    document.querySelectorAll("table").forEach(elm => {
        elm.className = "w3-table";
    });
    // Inputs
    document.querySelectorAll("input").forEach(elm => {
        if (elm.type == "radio")
        {
            elm.className = "w3-radio";
            elm.addEventListener("input", mod.calculate);
        }
        else
        {
            elm.className = "w3-input w3-border w3-padding-small w3-round";
            elm.addEventListener("input", debounce(mod.calculate));
        }
    });
    // Select
    document.querySelectorAll("select").forEach(elm => {
        elm.className = "w3-select w3-border w3-padding-small w3-round";
        elm.addEventListener("input", mod.calculate);
    });
}
