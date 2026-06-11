function LoginPage() {
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
      >
        <h1>Welcome Back</h1>

        <form>
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;