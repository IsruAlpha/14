import { httpRouter } from "convex/server";
import { polar } from "./polar";

const http = httpRouter();

// Register the webhook handler at /polar/events
polar.registerRoutes(http);

export default http;
