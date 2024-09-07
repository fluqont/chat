import { FormEvent, useContext } from "react";
import Form from "../components/Form";
import InputField from "../components/InputField";
import useFetch, { UseFetch } from "../hooks/useFetch";
import classes from "./Search.module.css";
import { User, UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

function Search() {
  const { data, fetchData, error, isLoading } = useFetch();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    fetchData(`/users?username=${data.get("search")}`, {
      credentials: "include",
    });
  }

  // search  results are displayed as cards with pfp (placeholder for now), username and status if they're friends (test this later)
  // on click they go to messages with this person
  return (
    <section className="centered-section">
      <h1>Search</h1>
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
          <h3>Results</h3>
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
          <SearchCard {...(data as User)} />
        </div>
      )}
    </>
  );
};

const SearchCard = (searchedUser: User) => {
  const { user } = useContext(UserContext);

  const displayedStatus = user?.username === searchedUser.username ? "you" : "";

  const { data, fetchData } = useFetch();

  const requestSent =
    data?.message === "OK" ||
    Boolean(searchedUser?.requested && searchedUser.requested[0]);

  const respondSent = Boolean(
    searchedUser?.requests && searchedUser.requests[0],
  );

  const friend = requestSent && respondSent;

  function handleFriendRequestClick() {
    fetchData(
      `/friend-requests/${user?.id}/requested-users/${searchedUser.id}`,
      {
        method: "POST",
      },
    );
  }

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
        <p className={classes.username}>{searchedUser.username}</p>
        <p className={classes.status}>
          {displayedStatus ||
            (friend
              ? "friend"
              : requestSent
                ? "friend request sent"
                : respondSent
                  ? "waiting for your response"
                  : "")}
        </p>
      </div>
      <div className={classes.end}>
        {user && !displayedStatus && !requestSent && (
          <button className="primary" onClick={handleFriendRequestClick}>
            {respondSent ? "accept" : "send"} friend request
          </button>
        )}
        {user && displayedStatus !== "you" && (
          <Link to={`/?partner-id=${searchedUser.id}`}>message</Link>
        )}
      </div>
    </div>
  );
};

export default Search;
