import { validateEmail, hashPassword } from "../../../../lib/helpers";
import { MongoClient } from "mongodb";

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      return handlePost(req, res);
    default:
      return res.status(200).json({
        route: "api/auth/signup",
        description: "api route to create new users",
      });
  }
}

async function handlePost(req, res) {
  const { email, password, password2 } = req.body;
  let validationErrors = {};

  if (!validateEmail(email)) validationErrors.email = "Invalid email";
  if (!password || password.trim() === "" || password.length < 8)
    validationErrors.password = "Password should be atleast 8 characters long";
  if (password !== password2)
    validationErrors.password2 = "Passwords don't match";

  if (Object.keys(validationErrors).length > 0)
    return res.status(422).json({ errors: validationErrors });

  const hashedPassword = await hashPassword(password);

  const newUser = { email, password: hashedPassword };
  let client;

  const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.mmt7s.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;

  try {
    client = await MongoClient.connect(connectionString);
  } catch (error) {
    return res.status(500).json({ msg: "Could not connect to database" });
  }

  const db = client.db();
  let result;

  const userExists = await db.collection("users").findOne({ email });

  if (userExists) {
    client.close();
    return res
      .status(422)
      .json({ errors: { email: "User with this email already exists" } });
  }

  try {
    result = await db.collection("users").insertOne(newUser);
  } catch (error) {
    client.close();
    return res.status(500).json({ msg: "Storing message failed!" });
  }

  client.close();

  return res
    .status(201)
    .json({ msg: "User created", id: result.insertedId.toString() });
}
