import { FormEvent, useContext, useEffect, useRef } from "react";
import Form from "../components/Form";
import InputField from "../components/InputField";
import useFetch, { UseFetch } from "../hooks/useFetch";
import classes from "./Search.module.css";
import { User, UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import Pfp from "../components/Pfp";

function Search() {
  const { data, fetchData, error, isLoading } = useFetch();

  const formRef = useRef<HTMLFormElement>(null);

  function fetchUser() {
    const data = new FormData(formRef.current ?? undefined);

    fetchData(`/users?username=${data.get("search")}`, {
      credentials: "include",
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    fetchUser();
  }

  return (
    <section className="centered-section">
      <h1>Search</h1>
      <search className={classes.search}>
        <Form
          ref={formRef}
          isLoading={isLoading}
          row={true}
          onSubmit={handleSubmit}
        >
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
              data={data}
              error={error}
              isLoading={isLoading}
              fetchUser={fetchUser}
            />
          ) : (
            <output>no user found</output>
          )}
        </section>
      </search>
    </section>
  );
}

interface SearchedUser {
  user: User;
  friendshipStatus: "friend" | "waits for your answer" | "request sent" | null;
  pfpUrl: string;
}

const SearchResults = ({
  data,
  error,
  isLoading,
  fetchUser,
}: UseFetch & { fetchUser: () => void }) => {
  if (error) return <p>{error}</p>;
  if (isLoading) return <p>loading...</p>;

  return (
    <>
      {data && data.user && (
        <div className={classes.box}>
          <SearchCard {...(data as SearchedUser)} fetchUser={fetchUser} />
        </div>
      )}
    </>
  );
};

const SearchCard = ({
  user: searchedUser,
  friendshipStatus,
  pfpUrl,
  fetchUser,
}: SearchedUser & { fetchUser: () => void }) => {
  const { user } = useContext(UserContext);

  const displayedStatus =
    user?.username === searchedUser.username ? "you" : null;

  const { data, fetchData, error } = useFetch();

  useEffect(() => {
    if (data && data.message === "OK") {
      fetchUser();
    }
  }, [data]);

  const requestSent =
    friendshipStatus && friendshipStatus !== "waits for your answer";

  function handleFriendRequestClick() {
    fetchData(
      `/friend-requests?userId=${user?.id}&requestedUserId=${searchedUser.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          userId: user?.id,
          requestedUserId: searchedUser.id,
        }),
        credentials: "include",
      },
    );
  }

  return (
    <>
      {error && <p style={{ marginBottom: "1rem" }}>{error}</p>}
      <div className={classes.searchCard}>
        <Pfp url={pfpUrl} />
        <div className={classes.details}>
          <p className={classes.username}>{searchedUser.username}</p>
          <p className={classes.status}>
            {displayedStatus ?? friendshipStatus}
          </p>
        </div>
        <div className={classes.end}>
          {user && !displayedStatus && !requestSent && (
            <button className="primary" onClick={handleFriendRequestClick}>
              {friendshipStatus === "waits for your answer" ? "accept" : "send"}{" "}
              friend request
            </button>
          )}
          {user && displayedStatus !== "you" && (
            <Link to={`/?partner-id=${searchedUser.id}`}>message</Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
