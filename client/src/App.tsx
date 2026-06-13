import UserAvatar from "./components/UserAvatar";
import OnlineBadge from "./components/OnlineBadge";

function App() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative w-12 h-12">
        <UserAvatar name="Abhishek Kumar" />
        <OnlineBadge />
      </div>
    </div>
  );
}

export default App;