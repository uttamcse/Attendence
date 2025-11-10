const express = require("express");
const HttpMethods = require("./httpMethods");

const createRouter = (routes) => {
  const router = express.Router();
  routes.forEach((route) => {
    const { method, path, handlers } = route;
    router[method](path, ...handlers);
  });
  return router;
};

module.exports = {
  createRouter,
};