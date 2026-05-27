/* Cache of the modules, prevent loading multiple times */

import { debugLog } from "./logger.js";

export const moduleCache = new Map();

export async function loadModule(module_id)
{
  if (!moduleCache.has(module_id))
  {
    const path = "../calculators/" + module_id + ".js";
    debugLog("Loading module from:", path)
    moduleCache.set(module_id, import(path));
  }
  return moduleCache.get(module_id);
}
