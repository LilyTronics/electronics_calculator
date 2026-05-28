/* Cache of the modules, prevent loading multiple times */

import { debugLog } from "./logger.js";

export const moduleCache = new Map();

export async function loadModule(module_id)
{
    if (!moduleCache.has(module_id))
    {
        const path = "../calculators/" + module_id + ".js";
        debugLog("Loading module from:", path)
        const mod = await import(path);
        if (checkModule(mod, path))
        {
            // Module valid
            debugLog("Add module:", mod)
            moduleCache.set(module_id, mod);
        }
    }
    return moduleCache.get(module_id);
}

function checkModule(mod, path)
{
    const checks = [
        [mod?.meta, "No meta data"],
        [mod.meta?.name, "No name in meta data"],
        [mod.meta?.description, "No description in meta data"],
        [mod?.render, "No render function"],
        [typeof mod.render === "function", "Property render is not a function"],
        [mod?.defaults, "No defaults"],
        [mod?.calculate, "No calculate function"],
        [typeof mod.calculate === "function", "Property calculate is not a function"],
    ];

    for (const [condition, msg] of checks)
    {
        if (!condition)
        {
            console.error(`${msg} in module: ${path}`);
            return false;
        }
    };
    return true;
}
