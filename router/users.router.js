import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import { createUsers, getUserByName } from "../service/users.service.js";
const router = express.Router();

async function generateHashedPassword(password) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(salt);
  console.log(hashedPassword);
  return hashedPassword;
}
//Signup
router.post("/signup", async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const userFromDb = await getUserByName(email);
    console.log(userFromDb);
    if (userFromDb) {
      res.status(401).send({ message: "email already exists" });
    } else if (password.length < 8) {
      res
        .status(400)
        .send({ message: "Password must be at least 8 characters" });
    } else {
      const hashedPassword = await generateHashedPassword(password);
      const result = await createUsers({
        name: name,
        email: email,
        password: hashedPassword,
      });
      res.status(200).send(result);
    }
  } catch (err) {
    console.log(err);
  }
});

//login

router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    const userFromDb = await getUserByName(email);
    console.log(userFromDb);
    if (!userFromDb) {
      res.status(401).send({ message: "Invalid credentials" });
    } else {
      const storedDBPassword = userFromDb.password;
      const isPasswordCheck = await bcrypt.compare(password, storedDBPassword);
      console.log(isPasswordCheck);
      if (isPasswordCheck) {
        const token = jwt.sign({ id: userFromDb._id }, process.env.SECRET_KEY);
        res.status(200).send({ message: "successful login", token: token });
      } else {
        res.status(401).send({ message: "Invalid credentials" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});
export default router;
