import Routes from "be-api/routes";
import express from "express";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const PORT = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(express.json());
    server.use("/api", Routes);

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, () => {
      console.log(`> Ready  on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("error = ", error));
