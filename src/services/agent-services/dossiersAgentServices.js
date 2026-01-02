import { BASE_URL } from "../../api/base";

import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const dossiersListAgent = async() => {
    try{
        const response = await fetch(`${BASE_URL}/agent/dossiers-agent/listDossier-agent.php`,{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok){
            throw new Error(data.Error || "login failed");
        }
        return data;
    }
    catch (error) {
    console.error("Error fetching dossiers:", error);
    throw error;
  }
};
export const addDossierAgent = async (dossierData) => {
  try {
    const response = await fetch(`${BASE_URL}/agent/dossiers-agent/addDossiers-agent.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dossierData),  // pass the whole object directly here
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de l'ajout du dossier");
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const listCars =async ()=>{
    try{
        const response = await fetch(`${BASE_URL}/get_car_models.php`,{
            method:"GET",
            headers:{
                "Content-Type": "application/json",
            },
            credentials:"include",
        });
        const data = await response.json();
        if(! response.ok){
            throw new Error(data.Error || "login failed");
        }
        return data;

    }catch(error){
    console.error("Error fetching dossiers:", error);
    throw error;
    }
};

export const archiveDossier = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/agent/dossiers-agent/archiveDossier-agent.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    return { success: false };
  }
};


export const archiveListAgent = async () => {
  try {
    const response = await fetch(`${BASE_URL}/agent/dossiers-agent/listArchive-agent.php`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include"
    });

    const data = await response.json();
    if (response.ok) {
      return data.message; 
    } else {
      throw new Error(data.error || 'Failed to fetch archive');
    }
  } catch (error) {
    throw error;
  }
};


export const unarchiveDossier = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/agent/dossiers-agent/unarchiveDossier-agent.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
