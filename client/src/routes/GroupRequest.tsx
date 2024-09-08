import { useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { User, UserContext } from "../context/UserContext";
import classes from "./User.module.css";
import { useParams } from "react-router-dom";

const GroupRequest = () => {
  // 1. get friends
  // 2. display friends with a button "send group request"

  const { user } = useContext(UserContext);

  const { data, fetchData, isLoading, error } = useFetch();

  const { groupId } = useParams();

  function fetchFriends() {
    if (user) {
      fetchData(`/users/${user.id}/friends?groupRequests=${groupId}`, {
        credentials: "include",
      });
    }
  }

  useEffect(() => {
    fetchFriends();
  }, [user]);

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  if (error) return <p aria-live="polite">{error}</p>;

  return (
    <section>
      <h1>Invite friends</h1>
      {!data && isLoading && <p className="error-like-section">loading...</p>}
      {error && (
        <p aria-live="polite" className="error-like-section">
          {error}
        </p>
      )}
      {data && <Friends friends={data.friends} fetchFriends={fetchFriends} />}
    </section>
  );
};

type Friend = User & { groupRequests: any[] };

interface FriendsProps {
  friends: Friend[];
  fetchFriends: () => void;
}

const Friends = ({ friends, fetchFriends }: FriendsProps) => {
  const { data, fetchData, error, isLoading } = useFetch();

  const { groupId } = useParams();

  function handleInviteClick(userId: number) {
    fetchData(`/group-requests/${groupId}?userId=${userId}`, {
      method: "POST",
      credentials: "include",
    });
  }

  useEffect(() => {
    if (data) {
      fetchFriends();
    }
  }, [data]);

  return (
    <>
      {!data && isLoading && <p>loading...</p>}
      {error && <p aria-live="polite">{error}</p>}
      {friends.length > 0 ? (
        <ul role="list" className={classes.requests}>
          {friends.map((friend) => (
            <li key={friend.id}>
              <Friend friend={friend} handleInviteClick={handleInviteClick} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="error-like-section">you have no friends</p>
      )}
    </>
  );
};

interface FriendProps {
  friend: Friend;
  handleInviteClick: (id: number) => void;
}

const Friend = ({ friend, handleInviteClick }: FriendProps) => {
  return (
    <div className={classes.request}>
      {friend.username}
      {!friend.groupRequests.length && (
        <button
          className="primary"
          onClick={() => handleInviteClick(friend.id)}
        >
          invite
        </button>
      )}
    </div>
  );
};

export default GroupRequest;
