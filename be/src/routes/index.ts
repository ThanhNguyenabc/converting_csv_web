import { RequestHandler, Router } from "express";
import uploadRouter from "./upload";

const Routes: Array<RequestHandler> = [uploadRouter];

export default Routes;
