import { useState } from "react";
import SshKeys from "./SshKey";
import Servers from "./Servers";
import Jobs from "./Jobs";

export default function Dashboard() {
  const [page, setPage] = useState("ssh");

  return (
    <div>
      <h1>Dockit Dashboard</h1>

      <nav style={{ marginBottom: "20px" }}>
        <button onClick={() => setPage("ssh")}>SSH Keys</button>
        <button onClick={() => setPage("servers")}>Servers</button>
        <button onClick={() => setPage("jobs")}>Jobs</button>
      </nav>

      {page === "ssh" && <SshKeys />}
      {page === "servers" && <Servers />}
      {page === "jobs" && <Jobs />}
    </div>
  );
}
