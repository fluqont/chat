import { Outlet } from "react-router-dom";

function Root() {
  return (
    <>
      <h1>hello world</h1>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Root;
