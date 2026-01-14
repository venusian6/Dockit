import { useState } from "react";
import { apiFetch } from "../api/client";

export default function SshKeys() {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // base64 encode private key
      const privateKeyB64 = btoa(privateKey);

      await apiFetch("/ssh-keys", {
        method: "POST",
        body: JSON.stringify({
          public_key: publicKey,
          private_key_b64: privateKeyB64,
        }),
      });

      setMessage("SSH key saved successfully");
      setPublicKey("");
      setPrivateKey("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>SSH Keys</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            rows="4"
            placeholder="Public key"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
          />
        </div>

        <div>
          <textarea
            rows="8"
            placeholder="Private key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
        </div>

        <button>Save SSH Key</button>
      </form>
    </div>
  );
}
