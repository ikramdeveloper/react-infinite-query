import { useRef, useCallback } from "react";
import { useInfiniteQuery } from "react-query";

import { getPostsPerPage } from "../api";
import Post from "../Post";

const Example2 = () => {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    status,
    error,
  } = useInfiniteQuery(
    "/posts",
    ({ pageParam = 1 }) => getPostsPerPage(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
    }
  );

  const intObserver = useRef();

  const lastPostRef = useCallback(
    (post) => {
      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          console.log("we are near the last post");
          fetchNextPage();
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (status === "error")
    return <p className="center">Error: {error.message}</p>;

  const content = data?.pages?.map((pg) => {
    return pg.map((post, index) => {
      if (pg.length === index + 1) {
        return <Post key={post.id} post={post} ref={lastPostRef} />;
      }
      return <Post key={post.id} post={post} />;
    });
  });

  return (
    <div>
      <h1 id="top">
        &infin; Infinite Query &amp; Scroll <br /> &infin; Ex.1 - React only
      </h1>
      {content}
      {isFetchingNextPage && <p className="center">Loading posts...</p>}
      <p className="center">
        <a href="#top">Back to Top</a>
      </p>
    </div>
  );
};
export default Example2;
