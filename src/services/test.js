
import { BASE_URL } from "../api/base"; 
export const test = async () => {
  try {
    const response = await fetch(`${BASE_URL}/test.php`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch session user");
    }

    return data.user;

  } catch (error) {
    console.error("Error fetching session user:", error);
    throw error;
  }
};