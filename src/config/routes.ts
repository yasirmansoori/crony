const ROUTES = {
  HEALTH: "/health",
  DOCS: {
    v1: "/api-docs/v1",
  },
  JOBS: {
    BASE: "/api/v1/jobs",
    CREATE: "/create",
    START: "/:id/start",
    STOP: "/:id/stop",
    LIST: "/",
    GET_LOGS: "/:id/logs",
    STATS: "/:id/stats",
  },
};

export default ROUTES;

/**
 * Routes configuration for the application.
 */
