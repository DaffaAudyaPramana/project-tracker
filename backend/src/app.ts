import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import router from "./routes";
import { errorHandler } from "./common/middleware/error.middleware";
import { notFoundHandler } from "./common/middleware/not-found.middleware";

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use(morgan("dev"));

app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
