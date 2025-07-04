const express = require("express");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { createSheet } = require("../controllers/resourceController");
const resourceRouter = express.Router();

resourceRouter.post("/createSheet", adminMiddleware, createSheet);
// resourceRouter.get("/",userMiddleware,getSheet);
// resourceRouter.get("/:id",userMiddleware,getSheetById);

module.exports = resourceRouter;
