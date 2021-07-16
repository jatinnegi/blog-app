import classes from "./hero.module.css";
import Image from "next/image";

export default function Hero() {
  return (
    <section className={classes.hero}>
      <div className={classes.image}>
        <Image
          src="/images/site/max.png"
          alt="An image showing Max"
          height={300}
          width={300}
        />
      </div>
      <h1>Hi, Iam Max!</h1>
      <p>
        I blog about web developement - especially frontend frameworks like
        Angular and React.
      </p>
    </section>
  );
}
