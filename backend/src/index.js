const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/userAuth");
const redisClient = require("./config/redis");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");
const cors = require("cors");
const postRouter = require("./routes/postRoutes");
// const resourceRouter = require("./routes/resourceRouter");
// console.log("Hello")

app.use(
  cors({
    origin: "https://proj12-one.vercel.app",
    credentials: true, // allow cookies/auth headers
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);
app.use("/discuss", postRouter);
app.get("/", (_req, res) => {
  return res.status(200).json({ message: "everything fine" });
});
// app.use("/resource", resourceRouter);
const InitalizeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB Connected");

    app.listen(process.env.PORT, () => {
      console.log("Server listening at port number: " + process.env.PORT);
    });
  } catch (err) {
    console.log("Error: " + err);
  }
};

InitalizeConnection();
