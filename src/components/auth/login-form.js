import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useState } from "react";
import { signIn } from "next-auth/client";
import Notification from "../ui/notification";

const useStyles = makeStyles((theme) => ({
  paper: {
    background: "#fff",
    // marginTop: theme.spacing(8),
    padding: theme.spacing(8),
    borderRadius: theme.spacing(0.5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  overlay: {
    position: "fixed",
    zIndex: "100",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: " rgba(0, 0, 0, 0.8)",
  },
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

export default function SignIn({ toggleAuthForm, setNotification }) {
  const classes = useStyles();

  const [formData, setFormData] = useState({ email: "", password: "" });

  function handleChange(e) {
    e.stopPropagation();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setNotification({
      status: "pending",
      title: "Pending",
      message: "Logging in...",
    });
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      setFormData({ email: "", password: "" });

      if (result.error) throw result.error;

      toggleAuthForm();
      setNotification({
        status: "success",
        title: "Success",
        message: "Logged in successfully!",
      });
    } catch (err) {
      setNotification({
        status: "error",
        title: "Error",
        message: err,
      });
    }
  }

  const { email, password } = formData;

  return (
    <div className={classes.overlay} onClick={(e) => toggleAuthForm(e, null)}>
      <Container
        component="main"
        maxWidth="sm"
        className={classes.container}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="off"
              value={email}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={handleChange}
              autoComplete="off"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={(e) => toggleAuthForm(e, "register")}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}
