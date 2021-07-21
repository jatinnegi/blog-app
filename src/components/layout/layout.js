import MainNavigation from "./main-navigation";

export default function Layout(props) {
  return (
    <>
      <MainNavigation />
      <main style={{ paddingTop: "6rem" }}>{props.children}</main>
    </>
  );
}
