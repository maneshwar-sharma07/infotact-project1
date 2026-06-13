import { useState } from "react";
import api from "../services/api";

function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

try {
  setIsLoading(true);

  const response = await api.post("/auth/login", {
    email,
    password,
  });

  localStorage.setItem("token", response.data.token);

  console.log("Login Success", response.data);
} catch (error) {
  console.error("Login Failed", error);
} finally {
  setIsLoading(false);
}

};

return (
<div
style={{
minHeight: "100vh",
backgroundColor: "#0A0A0F",
display: "flex",
justifyContent: "center",
alignItems: "center",
color: "#F1F5F9",
}}
>
<div
style={{
width: "400px",
padding: "32px",
borderRadius: "16px",
backgroundColor: "#111118",
border: "1px solid #7C3AED",
}}
> <h1 className="text-red-500 text-6xl font-bold">
  Tailwind Test
</h1>

    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  </div>
</div>

);
}

export default LoginPage;
