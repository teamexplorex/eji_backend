import express from "express";
import HomeController from "../controllers/home.js";

export const router = express.Router();

router.get("/", HomeController.getHomeData);

