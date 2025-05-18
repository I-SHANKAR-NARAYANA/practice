import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (username) => setUser({ username, role: "user" });
  const logout = () => setUser(null);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div>
      <h2>Welcome, {user?.username}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
export default function App() {
  const { user, login } = useAuth();
  return user
    ? <Dashboard />
    : <button onClick={() => login("Alice")}>Login</button>;
}
