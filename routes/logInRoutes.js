const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");
const {  
  createAccount,
  loginAccount,
  logoutAccount,
  refreshAccessToken,

 } = require("../controllers/logInController");

// OTP routes
const routes = [
    {
      method: HttpMethods.POST,
      path: "/create",
      handlers: [createAccount],
    },
    {
      method: HttpMethods.POST,
      path: "/login",
      handlers: [loginAccount],
    },
     {
      method: HttpMethods.POST,
      path: "/logout",
      handlers: [logoutAccount],
    },
    {
      method: HttpMethods.POST,
      path: "/token/refresh",
      handlers: [refreshAccessToken],
    },
  ];
  
  const router = createRouter(routes);
  
  module.exports = router;