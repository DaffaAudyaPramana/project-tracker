import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import router from "./routes";
import { errorHandler } from "./common/middleware/error.middleware";
import { notFoundHandler } from "./common/middleware/not-found.middleware";
import { requestLogger } from "./common/middleware/logger.middleware";
import { openapiSpec } from "./config/openapi";

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use(requestLogger);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
