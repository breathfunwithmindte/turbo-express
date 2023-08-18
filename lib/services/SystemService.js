/**
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 *
 * @PerfecTEvolutioN
 * @MikeKarypidis
 * @project - TurboExpress
 * @name Middleware
 * @namespace TurboExpress::services::SystemService
 * @license - MIT
 * @copyright - ©2022 PerfectEvolution Corporation;
 * @author - Mike Karypidis
 * @version - 1.0.0
 * @link - https://turboserverjs.org
 * @github - https://github.com/breathfunwithmindte/turbo-server.git
 *
 * -->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>-->>
 */

const RequestInterface = require("../types/RequestInterface");
const ResponseInterface = require("../types/ResponseInterface");
const Route = require("../types/Route");
const { Log, matching_route } = require("../utils");


module.exports = class SystemService
{

  /**
   * @typedef {Object} NoactionRoute
   * @property {String} method
   * @property {String} path 
   * 
   * @param {import("../TurboServer")} instance
   * @param {RequestInterface} req 
   * @param {ResponseInterface} res
   * @param {NoactionRoute[]} routes_props
   */
  static match_route (instance, req, res, routes_props, prefix = "", current_url)
  {
    const routes = [];
    routes_props.map(r => routes.push(new Route(prefix + r.path, r.method, [], [], [])))

    const r = matching_route(current_url || req.url(), routes);

    // console.log(current_url || req.url(), routes)

    if(!r) return null;

    const newreq = new instance.Request(req.IncomingMessage, r, req.instance);
    const newres = new instance.Response(res.OutgoingMessage, r, res.instance);
    
    newreq.state = req.state;

    return { req: newreq, res: newres  }

  }

  static loop_any_method ()
  {

  }

}