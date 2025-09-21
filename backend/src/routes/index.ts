import { Application } from "express";
import searchRouter from "./search";
import inforRouter from "./infor";
import viewRouter from "./view";
import aiRouter from "./ai";

const router = (app: Application) => {
  app.use("/search", searchRouter);
  app.use("/infor", inforRouter);
  app.use("/view", viewRouter);
  app.use("/ai", aiRouter);
};

export default router;
