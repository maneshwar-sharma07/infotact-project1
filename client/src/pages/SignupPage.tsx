function SignupPage() {
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
          width: "420px",
          padding: "32px",
          borderRadius: "16px",
          backgroundColor: "#111118",
          border: "1px solid #06B6D4",
        }}
      >
        <h1>Create Account</h1>

        <form>
          <div>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
            />
          </div>

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
              placeholder="Create password"
            />
          </div>

          <button type="submit">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;