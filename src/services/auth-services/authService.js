import { BASE_URL } from "../../api/base"; // ✅ Use named import

export const loginUser = async (cin, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",  
      },
      credentials: "include",

      body: JSON.stringify({ cin, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getSessionUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/getSessionUser.php`, {
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

export const logoutUser = async () => {
  localStorage.removeItem("user");
  sessionStorage.clear();

  try {
    const response = await fetch(`${BASE_URL}/auth/logout.php`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    const data = await response.json();
    console.log(data.message);  

  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};