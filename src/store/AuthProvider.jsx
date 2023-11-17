import { createContext, useContext, useMemo, useState } from "react";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  let localUser = localStorage.getItem("user") || null;
  localUser = localUser ? JSON.parse(localUser) : localUser;
  const [user, setUser] = useState(localUser);
  console.log(user)
  const value = {user,setUser}
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function useAuth() {
  return useContext(AuthContext);
}
export default AuthProvider;
export { useAuth };
