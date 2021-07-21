import Logo from "./logo";
import Link from "next/link";
import { useSession, signOut } from "next-auth/client";
import classes from "./main-navigation.module.css";
import { useEffect, useState } from "react";
import LoginForm from "../auth/login-form";
import RegisterForm from "../auth/register-form";
import Notification from "../ui/notification";

export default function MainNavigation() {
  const [session, loading] = useSession();
  const [authForm, setAuthForm] = useState(null);
  const [notification, setNotification] = useState(null);

  function toggleAuthForm(e, state) {
    if (e) e.preventDefault();
    setAuthForm(state);
  }

  useEffect(() => {
    if (authForm) document.body.style.overflow = "hidden";
    else document.body.style.overflowY = "scroll";
  }, [authForm]);

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  function handleLogout(e) {
    e.preventDefault();
    signOut({ redirect: false });
    setNotification({
      status: "success",
      title: "Success",
      message: "Logged out successfully!",
    });
  }

  return (
    <>
      <header className={classes.header}>
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
        <nav>
          <ul>
            <li>
              <Link href="/posts">Posts</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            {!loading && !session && (
              <li>
                <Link href="#">
                  <a onClick={(e) => toggleAuthForm(e, "login")}>Login</a>
                </Link>
              </li>
            )}
            {!loading && session && (
              <li>
                <Link href="#">
                  <a onClick={handleLogout}>Logout</a>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      {authForm === "login" && (
        <LoginForm
          toggleAuthForm={toggleAuthForm}
          setNotification={setNotification}
        />
      )}
      {authForm === "register" && (
        <RegisterForm
          toggleAuthForm={toggleAuthForm}
          setNotification={setNotification}
        />
      )}
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
