import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function Servers() {
  const [servers, setServers] = useState([]);
  const [keys, setKeys] = useState([]);
  const [host, setHost] = useState("");
  const [sshUser, setSshUser] = useState("ubuntu");
  const [sshKeyId, setSshKeyId] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [keysData, serversData] = await Promise.all([
        apiFetch("/ssh-keys"),
        apiFetch("/servers"),
      ]);
      setKeys(keysData);
      setServers(serversData);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await apiFetch("/servers", {
        method: "POST",
        body: JSON.stringify({
          host,
          ssh_user: sshUser,
          ssh_key_id: sshKeyId,
        }),
      });
      setHost("");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Servers</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Server IP / hostname"
          value={host}
          onChange={(e) => setHost(e.target.value)}
        />

        <input
          placeholder="SSH user"
          value={sshUser}
          onChange={(e) => setSshUser(e.target.value)}
        />

        <select value={sshKeyId} onChange={(e) => setSshKeyId(e.target.value)}>
          <option value="">Select SSH key</option>
          {keys.map((k) => (
            <option key={k.id} value={k.id}>
              {k.public_key.slice(0, 40)}...
            </option>
          ))}
        </select>

        <button>Add Server</button>
      </form>

      <hr />

      <ul>
        {servers.map((s) => (
          <li key={s.id}>
            {s.ssh_user}@{s.host}
          </li>
        ))}
      </ul>
    </div>
  );
}
