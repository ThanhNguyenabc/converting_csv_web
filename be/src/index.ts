import express from "express";
import cors from "cors";
import Routes from "routes";
const app = express();

const hostName = process.env.HOST;
const port = process.env.PORT;

app.use(cors());
app.use(express.static("public/build"));
app.use(express.json());
app.use(Routes);
app.listen(port, () => {
  console.log(`Listening on http://${hostName}:${port}`);
});
