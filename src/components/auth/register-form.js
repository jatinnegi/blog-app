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
  error: {
    // border: "1px solid red",
  },
}));

export default function SignUp({ toggleAuthForm, setNotification }) {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    email: null,
    password: null,
    password2: null,
  });

  function handleChange(e) {
    e.stopPropagation();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const body = JSON.stringify({ email, password, password2 });

    try {
      const response = await fetch("/api/auth/signup", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body,
      });
      const data = await response.json();

      if (!response.ok && data.errors) throw data.errors;
      else {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        if (result.errors) console.log(result.errors);
        else {
          setFormData({ email: "", password: "", password2: "" });
          toggleAuthForm(null, null);
          setNotification({
            status: "success",
            title: "Success",
            message: "Accounted created successfully!",
          });
        }
      }
    } catch (err) {
      setValidationErrors(err);
    }
  }

  const { email, password, password2 } = formData;

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
            Sign up
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={validationErrors.email ? true : false}
              helperText={validationErrors.email ? validationErrors.email : ""}
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
              error={validationErrors.password ? true : false}
              helperText={
                validationErrors.password ? validationErrors.password : ""
              }
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={handleChange}
              autoComplete="off"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={validationErrors.password2 ? true : false}
              helperText={
                validationErrors.password2 ? validationErrors.password2 : ""
              }
              name="password2"
              label="Confirm Password"
              type="password"
              id="password2"
              value={password2}
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
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={(e) => toggleAuthForm(e, "login")}
                >
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}
