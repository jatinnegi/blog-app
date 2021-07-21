import classes from "./post-comments.module.css";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import { deepOrange } from "@material-ui/core/colors/";
import { makeStyles } from "@material-ui/core/styles/";
import { useEffect, useState } from "react";
import Notification from "../../ui/notification";
import { useSession } from "next-auth/client";
import PostComment from "./post-comment";

const useStyles = makeStyles((theme) => ({
  textarea: {
    marginBottom: theme.spacing(2),
  },
}));

export default function PostComments({ postSlug }) {
  const materialClasses = useStyles();
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [notification, setNotification] = useState();
  const [session, loading] = useSession();

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  useEffect(() => {
    fetch(`/api/comments/${postSlug}`)
      .then((res) => res.json())
      .then((data) => {
        setPostComments([...data]);
      });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const body = JSON.stringify({ comment });
    setNotification({
      status: "pending",
      title: "Pending",
      message: "Sending comment to database...",
    });
    try {
      const response = await fetch(`/api/comments/${postSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Something went wrong");

      setNotification({
        status: "success",
        title: "Success",
        message: "Comment added successfully!",
      });

      setPostComments([data.comment, ...postComments]);
      setComment("");
    } catch (err) {
      setNotification({
        status: "error",
        title: "Error",
        message: err.message,
      });
    }
  }

  function handleChange(e) {
    e.preventDefault();
    setComment(e.target.value);
  }

  function handleCommentInputClick(e) {
    e.preventDefault();
    if (!session)
      setNotification({
        status: "error",
        title: "Error",
        message: "Login first to comment",
      });
  }

  return (
    <>
      <div className={classes.container}>
        <h1>Post Comments</h1>
        <form onSubmit={handleSubmit}>
          <TextField
            id="outlined-multiline-static"
            label="Your comment..."
            multiline
            rows={8}
            fullWidth
            className={materialClasses.textarea}
            variant="outlined"
            value={comment}
            disabled={session ? false : true}
            onChange={handleChange}
            onClick={handleCommentInputClick}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={session ? false : true}
          >
            Add Comment
          </Button>
        </form>
        <div className={classes.comments}>
          {postComments.length > 0 ? (
            <>
              <h4>All Comments ({postComments.length})</h4>
              {postComments.map((comment) => (
                <PostComment
                  key={comment._id}
                  user={comment.email}
                  date={comment.timestamp}
                  content={comment.content}
                />
              ))}
            </>
          ) : (
            <h3>No Comments Yet</h3>
          )}
        </div>
      </div>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
    </>
  );
}
