/* Renders the module content and applies proper styles */

export function render(container, mod)
{
    container.innerHTML = "";
    try
    {
        mod.render(container);
        applyStyles(container);
        return true;
    }
    catch (error)
    {
        debugLog("Error rendering view:", error)
    }
    return false;
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
