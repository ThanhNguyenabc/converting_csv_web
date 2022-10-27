import { RequestHandler, Router } from "express";
import uploadRouter from "./uploadRoute";

const Routes: Array<RequestHandler> = [uploadRouter];

export default Routes;
