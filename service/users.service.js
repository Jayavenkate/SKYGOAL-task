import { client } from "../index.js";
export async function getUserByName(email) {
  return await client
    .db("b42wd2")
    .collection("skygoal")
    .findOne({ email: email });
}

export async function createUsers(data) {
  return await client.db("b42wd2").collection("skygoal").insertOne(data);
}
