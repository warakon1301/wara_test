import express from "express";
import authen from "./authen/authen.router";
const router = express.Router();

router.use("/authen",authen)

export default router;
