import axios from 'axios';
import { BASE_URL } from '../../api/base';

export const getDossierStats = async () => {
  const response = await axios.get(`${BASE_URL}/manager/statics/get_dossier_stats.php`);
  return response.data;
};

export const fetchCarCategoryProgress = async () => {
  const response = await axios.get(`${BASE_URL}/manager/statics/get_car_model_counts.php`);
  return response.data;
};

export const fetchDossiersCountPerMonth = async () => {
  const response = await axios.get(`${BASE_URL}/manager/statics/dossiers_by_month.php`);
  return response.data;
};

export async function fetchObjectifsProgress(month = new Date().toISOString().slice(0, 10)) {
  const startOfMonth = `${month.slice(0, 7)}-01`; // ensures YYYY-MM-01 format
  const response = await axios.get(`${BASE_URL}/manager/statics/get_objectifs_progress_managerDs.php`, {
    params: { month: startOfMonth },
  });
  return response.data;
}
export async function fetchUserObjectivesWithProgress(month = new Date().toISOString().slice(0, 7)) {
  const response = await axios.get(`${BASE_URL}/manager/statics/get_objectifs_with_users.php`, {
    params: { month }, // ✅ send "2025-07"
  });
  return response.data;
}
