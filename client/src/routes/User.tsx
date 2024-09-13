import Form from "../components/Form";
import InputField from "../components/InputField";
import { User as IUser, UserContext } from "../context/UserContext";
import {
  FormEvent,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import classes from "./User.module.css";
import { Group } from "../components/Chats";

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
      credentials: "include",
    });
  }
  function handleDeleteSubmit() {
    fetchData(`/users/${user?.id}`, {
      method: "DELETE",
      credentials: "include",
    });
  }

  useEffect(() => {
    if (data) {
      setUser(data?.user);
      navigate("/");
    }
  }, [data]);

  const {
    fetchData: fetchUpload,
    isLoading: isUploading,
    error: uploadError,
  } = useFetch();

  function handleFileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (user) {
      const formData = new FormData(event.currentTarget);

      fetchUpload(`/users/${user.id}/profile-picture`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
    }
  }

  return (
    <>
      <section className="centered-section">
        <h2>Change user</h2>
        <Form
          onSubmit={handleFileSubmit}
          method="post"
          encType="multipart/form-data"
          isLoading={isUploading}
          row={true}
          style={{ marginBottom: "1rem" }}
        >
          <small>limit is 1mb</small>
          {uploadError && <p aria-live="polite">{uploadError}</p>}
          <InputField
            label="Profile picture"
            id="profile-picture"
            type="file"
            accept="image/*"
            required
          />
        </Form>
        <Form onSubmit={handleSubmit} isLoading={isLoading}>
          {error && <p aria-live="polite">{error}</p>}
          <InputField
            label="username"
            defaultValue={user?.username}
            required
            minLength={1}
            maxLength={30}
          />
        </Form>
        <button
          onClick={handleDeleteSubmit}
          className="error"
          style={{ marginTop: "2rem", width: "100%" }}
        >
          delete user
        </button>
      </section>
      <GroupRequests />
      <FriendRequests />
    </>
  );
}

interface Request {
  user?: IUser;
  group?: Group;
  id: number;
}

interface Requests {
  incoming: Request[];
  outcoming: Request[];
}

const GroupRequests = () => {
  const { data, fetchData, error, isLoading } = useFetch();

  const { user } = useContext(UserContext);

  function fetchRequests() {
    if (user) {
      fetchData(`/group-requests?userId=${user.id}`, {
        credentials: "include",
      });
    }
  }

  useEffect(() => {
    fetchRequests();
  }, [user]);

  if (isLoading) return <p>loading...</p>;

  return (
    <RequestsContainer error={error} label="Incoming  group requests">
      <>
        {data && (
          <Requests
            fetchRequests={fetchRequests}
            requests={data.groupRequests}
            group={true}
          >
            Incoming
          </Requests>
        )}
      </>
    </RequestsContainer>
  );
};

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
        { credentials: "include" },
      );
    }
  }

  useEffect(() => {
    fetchRequests();
  }, [user]);

  useEffect(() => {
    if (data && user) {
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
    <RequestsContainer label="Friend requests" error={error}>
      <Requests
        fetchRequests={fetchRequests}
        requests={requests.incoming}
        group={false}
      >
        Incoming
      </Requests>
      <Requests
        fetchRequests={fetchRequests}
        requests={requests.outcoming}
        group={false}
      >
        Outcoming
      </Requests>
    </RequestsContainer>
  );
};

interface RequestsContainerProps {
  label: string;
  error: string | null;
  children: ReactNode;
}

const RequestsContainer = ({
  label,
  error,
  children,
}: RequestsContainerProps) => {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>{label}</h2>
      {error && <p>{error}</p>}
      <div className={classes.section}>{children}</div>
    </section>
  );
};

interface RequestsProps {
  requests: Request[];
  fetchRequests: () => void;
  group: boolean;
  children: string;
}

const Requests = ({
  requests,
  fetchRequests,
  group,
  children,
}: RequestsProps) => {
  const { data, fetchData } = useFetch();

  function handleDelete(id: number) {
    fetchData(group ? `/group-requests/${id}` : `/friend-requests/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  }

  useEffect(() => {
    if (data && data.message === "OK") {
      fetchRequests();
    }
  }, [data]);

  const { data: acceptData, fetchData: fetchAccept } = useFetch();

  function handleAccept(id: number) {
    fetchAccept(`/group-requests/${id}`, {
      credentials: "include",
    });
  }

  useEffect(() => {
    if (acceptData) {
      fetchRequests();
    }
  }, [acceptData]);

  return (
    <article>
      <h3>{children}</h3>
      {requests.length > 0 ? (
        <ul role="list" className={classes.requests}>
          {requests.map((request) => (
            <li key={request.id}>
              <Request
                requestId={request.id}
                username={group ? request.group!.name : request.user!.username}
                accept={
                  group && (
                    <button
                      className="primary"
                      onClick={() => handleAccept(request.id)}
                    >
                      accept
                    </button>
                  )
                }
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
  accept?: ReactElement | false;
}

const Request = ({
  username,
  requestId,
  handleDelete,
  accept,
}: RequestProps) => {
  return (
    <div className={classes.request}>
      <p>{username}</p>
      <div className={classes.nav}>
        {accept}
        <button onClick={() => handleDelete(requestId)} className="primary">
          delete
        </button>
      </div>
    </div>
  );
};

export default User;
