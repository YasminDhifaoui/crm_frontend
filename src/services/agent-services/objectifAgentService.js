import { BASE_URL } from "../../api/base";
import axios from "axios";

export const getAgentObjective = async (month) => {
  const response = await axios.get(`${BASE_URL}/agent/objectif-agent/get_objectif.php`, {
    params: { month },
    withCredentials: true, // if using sessions
  });
  return response.data;
};
export const setAgentObjective = async (objectif, month) => {
  const response = await axios.post(
    `${BASE_URL}/agent/objectif-agent/set_objectif.php`,
    {
      month,
      objective: objectif,
    },
    {
      withCredentials: true, // ✅ must be passed here
    }
  );
  return response.data;
};
export const updateRealizedObjective = async () => {
  const response = await axios.post(
    `${BASE_URL}/agent/objectif-agent/set_realized.php`,
    {},
    { withCredentials: true }
  );
  return response.data;
};
export const getAgentProgress = async () => {
  const response = await axios.get(
    `${BASE_URL}/agent/objectif-agent/get_progress.php`,
    { withCredentials: true }
  );
  return response.data;
};
