import Form from "../components/Form";
import InputField from "../components/InputField";
import { User as IUser, UserContext } from "../context/UserContext";
import { FormEvent, useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import classes from "./User.module.css";

function User() {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const { data, fetchData, error, isLoading } = useFetch();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    fetchData(`/users/${user?.id}/username`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: data.get("username"),
      }),
    });
  }
  function handleDeleteSubmit() {
    fetchData(`/users/${user?.id}`, { method: "DELETE" });
  }

  useEffect(() => {
    if (data) {
      setUser(data?.user);
      navigate("/");
    }
  }, [data]);

  return (
    <>
      <section className="centered-section">
        <h2>Change user</h2>
        <Form onSubmit={handleSubmit} isLoading={isLoading}>
          {error && <p aria-live="polite">{error}</p>}
          <InputField label="username" defaultValue={user?.username} />
        </Form>
        <button
          onClick={handleDeleteSubmit}
          className="error"
          style={{ marginTop: "2rem", width: "100%" }}
        >
          delete user
        </button>
      </section>
      <FriendRequests />
    </>
  );
}

interface Requests {
  incoming: IUser[];
  outcoming: IUser[];
}

const FriendRequests = () => {
  const { data, fetchData, error, isLoading } = useFetch();

  const { user } = useContext(UserContext);

  const [requests, setRequests] = useState<Requests>({
    incoming: [],
    outcoming: [],
  });

  useEffect(() => {
    if (user) {
      fetchData(
        `/friend-requests?userId=${user.id}&requestedUserId=${user.id}`,
      );
    }
  }, [user]);

  useEffect(() => {
    if (data && user) {
      data.friendRequests.map((request: any) => {
        setRequests((requests) => {
          const outcoming = request.userId === user.id;
          return {
            outcoming: outcoming
              ? [...requests.outcoming, request.requestedUser]
              : requests.outcoming,
            incoming: outcoming
              ? requests.incoming
              : [...requests.incoming, request.user],
          };
        });
      });
    }
  }, [data]);

  return (
    <section>
      <h2>Friend requests</h2>
      {error && <p>{error}</p>}
      <div className={classes.section}>
        <article>
          <h3>Incoming</h3>
          <Requests requests={requests.incoming} />
        </article>
        <article>
          <h3>Outcoming</h3>
          <Requests requests={requests.outcoming} />
        </article>
      </div>
    </section>
  );
};

const Requests = ({ requests }: { requests: IUser[] }) => {
  return (
    <ul role="list" className={classes.requests}>
      {requests.map((request) => (
        <li key={request.username}>
          <Request username={request.username} />
        </li>
      ))}
    </ul>
  );
};

const Request = ({ username }: { username: string }) => {
  return <div className={classes.request}>{username}</div>;
};

export default User;
