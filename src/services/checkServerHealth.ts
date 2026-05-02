export const checkServerHealth = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8080/health");
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
