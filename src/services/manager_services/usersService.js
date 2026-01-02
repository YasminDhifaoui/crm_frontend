import { BASE_URL } from "../../api/base";

export const userList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/manager/users/listUser.php`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;

  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const addUser = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/manager/users/addUser.php`, {
      method: "POST",
      body: formData,
      credentials: "include", // include session
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add user.");
    }

    return data;
  } catch (error) {
    console.error("Add user error:", error);
    throw error;
  }
};


export const updateUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/manager/users/updateUser.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Update failed");
  return data;
};