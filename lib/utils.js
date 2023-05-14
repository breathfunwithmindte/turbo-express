const Middleware = require("./types/Middleware");
const Route = require("./types/Route");

/**
 * @param {String} current_path 
 * @param {Route[]} routes 
 * @returns {Route | null}
 */
module.exports.matching_route = (current_path, routes) => {

  const path_parts = current_path.split("/").filter(f => f !== "");
  let samelength = routes.filter(f=> f.size === path_parts.length && !f.useMinlength)
  let curr = null;
  for (let index = 0; index < samelength.length; index++) {
    let ok = true;
    path_parts.map((p, i) => {
      if(samelength[index].path_parts[i].startsWith(":")) return;
      if(p !== samelength[index].path_parts[i]) ok = false;
    });
    if(ok) { curr = samelength[index]; break; }
  }
  if(curr) curr.setCurrentPathParts(path_parts);
  return curr;

}


/**
 * @param {String} current_path 
 * @param {Route[]} routes 
 * @returns {Route | null}
 */
 module.exports.matching_nonexact_route = (current_path, routes) => {

  const path_parts = current_path.split("/").filter(f => f !== "");
  let nonexactroutes = routes.filter(f => f.useMinlength && f.size < path_parts.length).sort((a, b) => b.size - a.size);
  let globalnotfound = routes.find(f => f.size === 1 && f.path_parts[0] === "*");
  if(globalnotfound) { nonexactroutes.push(globalnotfound); }
  let curr = null;
  for (let index = 0; index < nonexactroutes.length; index++) {
    let ok = true;
    path_parts.map((p, i) => {
      if(i === path_parts.length - 1) return;
      if(i > nonexactroutes[index].path_parts.length - 2) return // route.path_parts are smaller in length than current path;
      if(nonexactroutes[index].path_parts[i].startsWith(":")) return; // dynamic route
      if(p !== nonexactroutes[index].path_parts[i]) ok = false;
    });
    if(ok) { curr = nonexactroutes[index]; break; }
  }
  if(curr) curr.setCurrentPathParts(path_parts);
  return curr;

}


/**
 * @param {String[]}        current_path 
 * @param {Boolean}         current_useMinLength 
 * @param {Number}          current_length
 * @param {Middleware[]}    middlewares
 * @returns {Middleware[]}
 */
 module.exports.matching_route_middlewares = (current_path_parts, current_useMinLength, current_length, middlewares) => 
 {
  const matchedMiddlewares = []
  for (let m = 0; m < middlewares.length; m++) {
    if(middlewares[m].useMinlength === false) 
    {
      if(current_useMinLength) continue;
      if(middlewares[m].size !== current_length) continue;
      let checker = true;
      for (let i = 0; i < current_path_parts.length; i++) {
        if(current_path_parts[i].startsWith(":") && middlewares[m].path_parts[i].startsWith(":")) continue;
        if(current_path_parts[i] !== middlewares[m].path_parts[i]) {
          checker = false;
          break;
        }
      }
      if(checker) {matchedMiddlewares.push(middlewares[m]); }

    } else 
    {
      if(current_useMinLength) 
      {
        if( !(middlewares[m].size <= current_length) ) continue;
        let checker = true;
        for (let i = 0; i < middlewares[m].size; i++) {
          if(current_path_parts[i].startsWith(":") && middlewares[m].path_parts[i].startsWith(":")) continue;
          if(current_path_parts[i] !== middlewares[m].path_parts[i]) {
            checker = false;
            break;
          }
        }
        if(checker) {matchedMiddlewares.push(middlewares[m]); }
      } else 
      {
        if( !(middlewares[m].size < current_length) ) continue;
        let checker = true;
        for (let i = 0; i < middlewares[m].size; i++) {
          if(current_path_parts[i].startsWith(":") && middlewares[m].path_parts[i].startsWith(":")) continue;
          if(current_path_parts[i] !== middlewares[m].path_parts[i]) {
            checker = false;
            break;
          }
        }
        if(checker) {matchedMiddlewares.push(middlewares[m]); }
      }
    }
  }
  return matchedMiddlewares;
}
