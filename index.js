import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import usersRourter from "./router/users.router.js";
import auth from "./middleware/auth.js";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const app = express();

const Mongo_url = process.env.MONGO_URL;
export const client = new MongoClient(Mongo_url);
await client.connect();
console.log("Mongo is connected");

app.use(cors());
app.use(express.json());

//routes

app.use("/", usersRourter);

app.get("/", async function (req, res) {
  res.send("hello world skygoal");
});

//create Mobile api
app.post("/createmobile", async function (req, res) {
  const data = req.body;
  console.log(data);
  const result = await client
    .db("b42wd2")
    .collection("skymobile")
    .insertMany(data);
  res.send(result);
});
//getdata

app.get("/getmobile", auth, async function (req, res) {
  try {
    const mobiledata = await client
      .db("b42wd2")
      .collection("skymobile")
      .find({})
      .toArray();
    res.send(mobiledata);
  } catch (err) {
    res.status(401).send({ message: err });
  }
});

//add to cart

app.listen(PORT, () => {
  console.log(`App is listening in the Port ${PORT}`);
});
