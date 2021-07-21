import { MongoClient } from "mongodb";
import { getSession } from "next-auth/client";

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    default:
      return res.status(200).json({
        route: "api/comments/[postSlug]",
        msg: "Add comment to a post",
      });
  }
}

async function handleGet(req, res) {
  const { postSlug } = req.query;
  const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.mmt7s.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;
  let client;
  try {
    client = await MongoClient.connect(connectionString);
  } catch (error) {
    return res.status(400).json({ msg: "Can't connect to database" });
  }

  try {
    const result = client
      .db()
      .collection("comments")
      .find({ post: postSlug })
      .sort({ timestamp: -1 });

    const comments = await result.toArray();

    client.close();
    return res.status(201).json(comments);
  } catch (error) {
    client.close();
    return res.status(400).json({ msg: "Couldn't connect with database" });
  }
}

async function handlePost(req, res) {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ msg: "Not authenticated" });

  const { comment } = req.body;
  const { postSlug } = req.query;

  const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.mmt7s.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;
  let client;
  try {
    client = await MongoClient.connect(connectionString);
  } catch (error) {
    return res.status(400).json({ msg: "Can't connect to database" });
  }

  const userEmail = session.user.email;

  const newComment = {
    post: postSlug,
    email: userEmail,
    content: comment,
    timestamp: new Date(),
  };

  try {
    const result = await client
      .db()
      .collection("comments")
      .insertOne(newComment);
    client.close();
    return res.status(201).json({
      msg: "Comment added successfully!",
      comment: { id: result.insertedId.toString(), ...newComment },
    });
  } catch (error) {
    client.close();
    return res
      .status(400)
      .json({ msg: "Couldn't add message. Please try again!" });
  }
}
