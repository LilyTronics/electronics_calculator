/* Cache of the modules, prevent loading multiple times */

export const moduleCache = new Map();

export async function loadModule(module) {
  if (!moduleCache.has(module)) {
    var path = "../calculators/" + module;
    moduleCache.set(module, import(path));
  }
  return moduleCache.get(module);
}
