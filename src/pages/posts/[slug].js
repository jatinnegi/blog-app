import PostContent from "../../components/posts/post-detail/post-content";
import { getPostsFiles, getPostData } from "../../../lib/posts-util";
import Head from "next/head";

export default function PostDetailPage({ post }) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
      </Head>
      <PostContent post={post} />
    </>
  );
}

export function getStaticPaths() {
  const postFiles = getPostsFiles();
  const slugs = postFiles.map((posts) => posts.replace(/\.md$/, ""));
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export function getStaticProps(context) {
  const { slug } = context.params;

  const post = getPostData(slug);

  return {
    props: {
      post,
    },
    revalidate: 600,
  };
}
