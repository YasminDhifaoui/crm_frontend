import { BASE_URL } from "../../api/base";

export const dossiersListManager = async() => {
    try{
        const response = await fetch(`${BASE_URL}/manager/dossiers/listDossiers.php`,{
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

// 📌 Update a dossier
export async function updateDossier(dossierData) {
  try {
    const isFormData = dossierData instanceof FormData;

    const response = await fetch(`${BASE_URL}/manager/dossiers/updateDossier.php`, {
      method: "POST",
      headers: isFormData
        ? { } // let browser set Content-Type
        : { "Content-Type": "application/json" },
      credentials: "include",
      body: isFormData ? dossierData : JSON.stringify(dossierData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la mise à jour du dossier.");
    }

    return data;
  } catch (error) {
    console.error("Update dossier error:", error);
    throw error;
  }
}


export const listCarsManager =async ()=>{
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

export const addDossiersManager = async (dossierData) => {
  try {
    const formData = new FormData();

    // Append all regular fields
    formData.append("nom_prenom_client", dossierData.nom_prenom_client);
    formData.append("telephone", dossierData.telephone);
    formData.append("modeles", dossierData.modeles);
    formData.append("commentaire", dossierData.commentaire || "");
    formData.append("status", dossierData.status);
    formData.append("immatriculation", dossierData.immatriculation || "");

    // Append file if exists
    if (dossierData.commentaire_file) {
      formData.append("commentaire_file", dossierData.commentaire_file);
    }

    const response = await fetch(
      `${BASE_URL}/manager/dossiers/addDossiers-manager.php`,
      {
        method: "POST",
        credentials: "include",
        body: formData, // Don't set Content-Type manually!
      }
    );

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


export const archiveDossiersManager = async (id)=>{
 try {
    const response = await fetch(`${BASE_URL}/manager/dossiers/archiveDossiers-manager.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify({ id }),
    });


    if (response.ok) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    return { success: false };
  }
};

export const archiveListManager =async()=>{
try {
    const response = await fetch(`${BASE_URL}/manager/dossiers/listArchive-manager.php`, {
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
export const unarchiveDossierManager = async(id)=>{
try {
    const response = await fetch(`${BASE_URL}/manager/dossiers/unarchiveDossier-manager.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });


    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
