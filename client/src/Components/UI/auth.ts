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
