const { MongoClient } = require("mongodb");

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      return handlePost(req, res);
    default:
      return res.status(200).json({
        endpoint: "/api/contact",
        description: "Api endpoint for contacts",
      });
  }
}

async function handlePost(req, res) {
  const { email, name, message } = req.body;

  if (
    !email ||
    !email.includes("@") ||
    !name ||
    name.trim() === "" ||
    !message ||
    message.trim() === ""
  )
    return res.status(422).json({ msg: "Invalid inputs" });

  const newMessage = { email, message, name };
  let client;

  const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.mmt7s.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;

  try {
    client = await MongoClient.connect(connectionString);
  } catch (error) {
    return res.status(500).json({ msg: "Could not connect to database" });
  }

  const db = client.db();

  try {
    const result = await db.collection("messages").insertOne(newMessage);
    newMessage._id = result.insertedId;
  } catch (error) {
    client.close();
    return res.status(500).json({ msg: "Storing message failed!" });
  }

  client.close();

  return res
    .status(201)
    .json({ msg: "Successfully stored message!", message: newMessage });
}
