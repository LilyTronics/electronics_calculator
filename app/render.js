/* Renders the module content and applies proper styles */

export function render(container, mod)
{
    container.innerHTML = "";
    try
    {
        mod.render(container);
        return true;
    }
    catch (error)
    {
        debugLog("Error rendering view:", error)
    }
    return false;
}
