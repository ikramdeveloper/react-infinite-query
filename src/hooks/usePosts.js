import { useState, useEffect } from "react";

import { getPostsPerPage } from "../api";

const usePosts = (pageNum = 1) => {
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError({});

    const controller = new AbortController();
    const { signal } = controller;

    getPostsPerPage(pageNum, { signal })
      .then((data) => {
        setResult((prev) => [...prev, ...data]);
        setHasNextPage(Boolean(data.length));
      })
      .catch((err) => {
        if (signal.aborted) return;
        setIsError(true);
        setError({ message: err.message });
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [pageNum]);

  return { result, isLoading, isError, error, hasNextPage };
};

export default usePosts;
