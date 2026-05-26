/* Cache of the modules, prevent loading multiple times */

export const moduleCache = new Map();

export async function loadModule(module_id)
{
  if (!moduleCache.has(module_id))
  {
    var path = "../calculators/" + module_id + ".js";
    moduleCache.set(module_id, import(path));
  }
  return moduleCache.get(module_id);
}
