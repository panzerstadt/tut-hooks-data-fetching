import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "./index.module.css";

const useFetch = (initialUrl, initialData) => {
  const INIT = { hits: [] };
  const [data, setData] = useState(initialData || INIT);
  const [url, setUrl] = useState(
    initialUrl || "http://hn.algolia.com/api/v1/search?query=redux"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    const fetchHN = async () => {
      setError();
      setData(INIT);
      setIsLoading(true);

      try {
        const result = await axios(url);
        setData(result.data);
      } catch (e) {
        setError(e.message);
      }
      setIsLoading(false);
    };

    fetchHN();
  }, [url]);

  const doFetch = url => {
    setUrl(url);
  };

  return { data, isLoading, error, doFetch };
};

const FetchAndDisplay = ({ search }) => {
  const [query, setQuery] = useState("redux");
  const { data, isLoading, error, doFetch } = useFetch(
    "http://hn.algolia.com/api/v1/search?query=redux",
    { hits: [] }
  );

  const LoadingOrEror = () => {
    if (!isLoading && !error) {
      return null;
    } else if (isLoading && !error) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div style={{ color: "red" }}>{error}</div>;
    } else {
      return null;
    }
  };

  return (
    <>
      <form
        style={{ width: "100%" }}
        onSubmit={e => {
          e.preventDefault();
          doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);
        }}
      >
        <input
          className={styles.input}
          type="text"
          value={search || query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className={styles.submit} type="Submit">
          Search
        </button>
      </form>

      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
      <div className={styles.loadingOrError}>
        <LoadingOrEror />
      </div>
    </>
  );
};

export default FetchAndDisplay;
