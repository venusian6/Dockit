import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function Jobs() {
  const [servers, setServers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [serverId, setServerId] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [serversData, jobsData] = await Promise.all([
        apiFetch("/servers"),
        apiFetch("/jobs"),
      ]);
      setServers(serversData);
      setJobs(jobsData);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function deploy() {
    setError("");
    try {
      await apiFetch("/jobs", {
        method: "POST",
        body: JSON.stringify({ server_id: serverId }),
      });
      setServerId("");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Deploy Jobs</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <select value={serverId} onChange={(e) => setServerId(e.target.value)}>
        <option value="">Select server</option>
        {servers.map((s) => (
          <option key={s.id} value={s.id}>
            {s.ssh_user}@{s.host}
          </option>
        ))}
      </select>

      <button onClick={deploy} disabled={!serverId}>
        Deploy
      </button>

      <hr />

      <ul>
        {jobs.map((j) => (
          <li key={j.id}>
            {j.id.slice(0, 8)} — <strong>{j.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
