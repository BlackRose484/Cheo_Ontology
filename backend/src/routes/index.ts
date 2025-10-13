import { Application } from "express";
import searchRouter from "./search";
import inforRouter from "./infor";
import viewRouter from "./view";
import aiRouter from "./ai";
import cacheRouter from "./cache";
import pingRouter from "./ping";
import contributionRouter from "./contribution";

const router = (app: Application) => {
  app.use("/search", searchRouter);
  app.use("/infor", inforRouter);
  app.use("/view", viewRouter);
  app.use("/ai", aiRouter);
  app.use("/cache", cacheRouter);
  app.use("/ping", pingRouter);
  app.use("/contribution", contributionRouter);
};

export default router;
