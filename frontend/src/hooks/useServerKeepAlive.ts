import { useEffect, useRef } from "react";
import { pingServer } from "../apis/ping";

export const useServerKeepAlive = (intervalMinutes: number = 10) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const performPing = async () => {
    try {
      console.log("🏓 Pinging server to keep it alive...");
      const response = await pingServer();
      console.log("✅ Server ping successful:", response.message);
    } catch (error) {
      console.error("❌ Server ping failed:", error);
    }
  };

  useEffect(() => {
    // Perform initial ping
    performPing();

    // Set up interval for regular pings
    const intervalMs = intervalMinutes * 60 * 1000; // Convert minutes to milliseconds

    console.log(
      `⏰ Setting up server keep-alive ping every ${intervalMinutes} minutes`
    );

    intervalRef.current = setInterval(() => {
      performPing();
    }, intervalMs);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        console.log("🛑 Cleaning up server keep-alive interval");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [intervalMinutes]);

  // Return manual ping function in case needed
  return { ping: performPing };
};
