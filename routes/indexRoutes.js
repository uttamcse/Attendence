const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");
const { getHomeInfo } = require("../controllers/indexController");

const routes = [
  {
    method: HttpMethods.GET,
    path: "/",
    handlers: [getHomeInfo],
  },
];

const router = createRouter(routes);

module.exports = router;