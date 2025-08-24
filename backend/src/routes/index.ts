import { Application } from "express";
import searchRouter from "./search";
import inforRouter from "./infor";
import viewRouter from "./view";

const router = (app: Application) => {
  app.use("/search", searchRouter);
  app.use("/infor", inforRouter);
  app.use("/view", viewRouter);
};

export default router;
