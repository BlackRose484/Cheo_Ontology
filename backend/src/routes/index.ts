import { Application } from "express";
import searchRouter from "./search";
import inforRouter from "./infor";

const router = (app: Application) => {
  app.use("/search", searchRouter);
  app.use("/infor", inforRouter);
};

export default router;
