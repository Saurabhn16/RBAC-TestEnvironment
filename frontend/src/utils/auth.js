import jwtDecode from "jwt-decode";

export const getRoleFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (err) {
    console.error("Invalid token");
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    jwtDecode(token);
    return true;
  } catch (err) {
    return false;
  }
};
