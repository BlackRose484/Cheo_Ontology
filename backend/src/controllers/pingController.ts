import { Request, Response } from "express";

export class PingController {
  // Simple ping endpoint - Hi -> Hello
  static async ping(req: Request, res: Response): Promise<void> {
    console.log("Ping - Pong");
    try {
      res.status(200).json({
        message: "Hello",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Ping failed:", error);
      res.status(500).json({
        message: "Error",
        timestamp: new Date().toISOString(),
      });
    }
  }
}
