/* Renders the module content and applies proper styles */

import { debugLog } from "./logger.js";

export function render(container, mod)
{
    container.innerHTML = "";
    try
    {
        mod.render(container);
        applyStyles(container);
        applyDefaults(mod);
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
            elm.checked = true;
        }
    });
}

function applyStyles(container)
{
    // Sections
    document.querySelectorAll("section").forEach(elm => {
        elm.className = "w3-section w3-border w3-round-large";
    });
    // Tables
    document.querySelectorAll("table").forEach(elm => {
        elm.className = "w3-table";
    });
    // Inputs
    document.querySelectorAll("input").forEach(elm => {
        if (elm.type == "radio")
        {
            elm.className = "w3-radio";
        }
        else
        {
            elm.className = "w3-input w3-border w3-padding-small w3-round";
        }
    });
    // Select
    document.querySelectorAll("select").forEach(elm => {
        elm.className = "w3-select w3-border w3-padding-small w3-round";
    });
}
