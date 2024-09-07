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

interface Request {
  user: IUser;
  id: number;
}

interface Requests {
  incoming: Request[];
  outcoming: Request[];
}

const FriendRequests = () => {
  const { data, fetchData, error, isLoading } = useFetch();

  const { user } = useContext(UserContext);

  const initRequests = {
    incoming: [],
    outcoming: [],
  };
  const [requests, setRequests] = useState<Requests>(initRequests);

  function fetchRequests() {
    if (user) {
      fetchData(
        `/friend-requests?userId=${user.id}&requestedUserId=${user.id}`,
      );
    }
  }

  useEffect(() => {
    fetchRequests();
  }, [user]);

  useEffect(() => {
    if (data && user) {
      console.log("settin", data.friendRequests);
      setRequests(initRequests);
      data.friendRequests.map((request: any) => {
        setRequests((requests) => {
          const outcoming = request.userId === user.id;
          return {
            outcoming: outcoming
              ? [
                  ...requests.outcoming,
                  {
                    ...request,
                    user: request.requestedUser,
                    requestedUser: undefined,
                  },
                ]
              : requests.outcoming,
            incoming: outcoming
              ? requests.incoming
              : [
                  ...requests.incoming,
                  { ...request, user: request.user, requestedUser: undefined },
                ],
          };
        });
      });
    }
  }, [data]);

  if (isLoading) return <p>loading...</p>;

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>Friend requests</h2>
      {error && <p>{error}</p>}
      <div className={classes.section}>
        <Requests fetchRequests={fetchRequests} requests={requests.incoming}>
          Incoming
        </Requests>
        <Requests fetchRequests={fetchRequests} requests={requests.outcoming}>
          Outcoming
        </Requests>
      </div>
    </section>
  );
};

interface RequestsProps {
  requests: Request[];
  fetchRequests: () => void;
  children: string;
}

const Requests = ({ requests, fetchRequests, children }: RequestsProps) => {
  const { data, fetchData } = useFetch();

  function handleDelete(id: number) {
    fetchData(`/friend-requests/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  }

  useEffect(() => {
    if (data && data.message === "OK") {
      fetchRequests();
    }
  }, [data]);

  return (
    <article>
      <h3>{children}</h3>
      {requests.length > 0 ? (
        <ul role="list" className={classes.requests}>
          {requests.map((request) => (
            <li key={request.user.id}>
              <Request
                requestId={request.id}
                username={request.user.username}
                handleDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>empty</p>
      )}
    </article>
  );
};

interface RequestProps {
  handleDelete: (id: number) => void;
  requestId: number;
  username: string;
}

const Request = ({ username, requestId, handleDelete }: RequestProps) => {
  return (
    <div className={classes.request}>
      <p>{username}</p>
      <button onClick={() => handleDelete(requestId)} className="primary">
        delete
      </button>
    </div>
  );
};

export default User;
