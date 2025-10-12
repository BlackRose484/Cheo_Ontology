import http from "../utils/http";

export interface PingResponse {
  message: string;
  timestamp: string;
}

// Simple ping function
export const pingServer = async (): Promise<PingResponse> => {
  const response = await http.get<PingResponse>("/ping");
  return response.data;
};
