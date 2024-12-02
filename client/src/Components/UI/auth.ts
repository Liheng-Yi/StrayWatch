export const getCurrentUserId = () => {
  const userStr = localStorage.getItem("currentUser");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user._id||"";
    } catch (e) {
      return "";
    }
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("currentUser");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "admin";
};
