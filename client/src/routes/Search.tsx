import { FormEvent, useEffect } from "react";
import Form from "../components/Form";
import InputField from "../components/InputField";
import useFetch, { UseFetch } from "../hooks/useFetch";
import classes from "./Search.module.css";
import { RectangleVertical } from "lucide-react";

function Search() {
  const { data, fetchData, error, isLoading } = useFetch();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    fetchData(`/users?username=${data.get("search")}`);
  }
  // this page has a search form (input type="search") and search results
  // search  results are displayed as cards with pfp (placeholder for now), username and status if they're friends (test this later). on click they go to messages with this person
  return (
    <section className="centered-section">
      <h1>search</h1>
      <search className={classes.search}>
        <Form isLoading={isLoading} row={true} onSubmit={handleSubmit}>
          {error && <p aria-live="polite">{error}</p>}
          <InputField
            label="exact search by username"
            id="search"
            type="search"
          />
        </Form>
        <section>
          <h2>results</h2>
          {data && data.user ? (
            <SearchResults
              data={data.user}
              error={error}
              isLoading={isLoading}
            />
          ) : (
            <output>no user found</output>
          )}
        </section>
      </search>
    </section>
  );
}

const SearchResults = ({ data, error, isLoading }: UseFetch) => {
  if (error) return <p>{error}</p>;
  if (isLoading) return <p>loading...</p>;
  return (
    <>
      {data && (
        <div className={classes.box}>
          <SearchCard username={data.username} status={data.status?.type} />
        </div>
      )}
    </>
  );
};

interface SearchCardProps {
  username: string;
  status?: "TYPING" | "OFFLINE" | "ONLINE";
}

const SearchCard = ({ username, status }: SearchCardProps) => {
  return (
    <div className={classes.searchCard}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="currentColor"
        style={{ color: "var(--primary)" }}
      >
        <circle cx={32} cy={32} r={32}></circle>
      </svg>
      <div className={classes.details}>
        <p className={classes.username}>{username}</p>
        <p className={classes.status}>{status ?? "not your friend"}</p>
      </div>
    </div>
  );
};

export default Search;
