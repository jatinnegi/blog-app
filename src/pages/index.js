import Hero from "../components/home-page/hero";
import FeaturedPosts from "../components/home-page/featured-posts";
import { getFeaturedPosts } from "../../lib/posts-util";
import Head from "next/head";

export default function HomePage({ posts }) {
  return (
    <>
      <Head>
        <title>Max&apos;s Blog</title>
        <meta
          name="description"
          cotent="I post about programming and web development"
        />
      </Head>
      <Hero />
      <FeaturedPosts posts={posts} />
    </>
  );
}

export function getStaticProps() {
  const featuredPosts = getFeaturedPosts();
  return {
    props: {
      posts: featuredPosts,
    },
  };
}
