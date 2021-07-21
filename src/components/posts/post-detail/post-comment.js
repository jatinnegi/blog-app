import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendar } from "@fortawesome/free-solid-svg-icons/";
import classes from "./post-comment.module.css";

export default function PostComment({ user, date, content }) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formattedDate = new Date(date).toLocaleString("en-US", {
    timeZone,
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div className={classes.comment}>
      <div className={classes.comment_user}>
        <FontAwesomeIcon icon={faUser} />
        <span>{user}</span>
      </div>
      <div className={classes.comment_timestamp}>
        <FontAwesomeIcon icon={faCalendar} />
        <span>{formattedDate}</span>
      </div>
      <div className={classes.comment_content}>{content}</div>
    </div>
  );
}
