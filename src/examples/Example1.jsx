import { useState, useRef, useCallback } from "react";

import usePosts from "../hooks/usePosts";
import Post from "../Post";

const Example1 = () => {
  const [pageNum, setPageNum] = useState(1);

  const { result, isLoading, isError, hasNextPage, error } = usePosts(pageNum);

  const intObserver = useRef();

  const lastPostRef = useCallback(
    (post) => {
      if (isLoading) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          console.log("We are near the last post");
          setPageNum((prev) => prev + 1);
        }
      });

      if (post) intObserver.current.observe(post);
    },
    [isLoading, hasNextPage]
  );

  if (isError) {
    return <p className="center">{error.message}</p>;
  }

  const content = result.map((post, index) => {
    if (result.length === index + 1) {
      return <Post key={post.id} post={post} ref={lastPostRef} />;
    }
    return <Post key={post.id} post={post} />;
  });

  return (
    <div>
      <h1 id="top">
        &infin; Infinite Query &amp; Scroll <br /> &infin; Ex.1 - React only
      </h1>
      {content}
      {isLoading && <p className="center">Loading posts...</p>}
      <p className="center">
        <a href="#top">Back to Top</a>
      </p>
    </div>
  );
};
export default Example1;
