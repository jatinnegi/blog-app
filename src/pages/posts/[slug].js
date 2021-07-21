import PostContent from "../../components/posts/post-detail/post-content";
import PostComments from "../../components/posts/post-detail/post-comments";
import Head from "next/head";
import { getPostsFiles, getPostData } from "../../../lib/posts-util";

export default function PostDetailPage({ post, slug }) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
      </Head>
      <PostContent post={post} />
      <PostComments postSlug={slug} />
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
      slug,
    },
    revalidate: 600,
  };
}
