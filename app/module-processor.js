/* Process the module */

import { debugLog } from "./logger.js";
import { debounce } from "./input_debounce.js";


export function renderInput(mod, containerInput, containerOutput)
{
    containerInput.innerHTML = "";
    try
    {
        mod.renderInput(containerInput);
        applyStyles(containerInput);
        applyDefaults(mod);
        applyEventHandler(mod, containerInput, containerOutput);
        return true;
    }
    catch (error)
    {
        debugLog("Error rendering view:", error)
    }
    return false;
}

export function processor(mod, containerInput, containerOutput)
{
    try
    {
        const results = mod.calculate(containerInput);
        mod.renderResults(results, containerOutput);
    }
    catch (error)
    {
        debugLog("Error processing module:", error)
    }
}

function applyStyles(container)
{
    // Tables
    container.querySelectorAll("table").forEach(elm => {
        elm.className = "w3-table";
    });
    // Inputs
    container.querySelectorAll("input").forEach(elm => {
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
    container.querySelectorAll("select").forEach(elm => {
        elm.className = "w3-select w3-border w3-padding-small w3-round";
    });
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

function applyEventHandler(mod, containerInput, containerOutput)
{
    containerInput.querySelectorAll("input, select").forEach(elm => {
        elm.addEventListener("input", debounce((e) => processor(mod, containerInput, containerOutput)));
    });
}
