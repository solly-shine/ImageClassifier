import axios from "axios";

const root = 'http://127.0.0.1:8000/',
    apiRoot = `${root}api/`,
    entitiesPath = `${apiRoot}entities/`;

const getEntities = (onSuccess = null, onFailure = null) =>
    axios
    .get(entitiesPath, {
        headers: { accept: "application/json" },
    })
    .then((res) => (onSuccess ? onSuccess(res) : console.log(res)))
    .catch((err) => (onFailure ? onFailure(err) : console.log(err)));

const uploadImage = (file) => {
    console.log(file);
    const formData = new FormData();
    formData.append("image", file, file.name);
    formData.append("classification", "Receipt");
    return axios.post(entitiesPath, formData, {
        accept: "application/json",
        "content-type": "multipart/form-data",
    });
};


export default {
    routes: { root, apiRoot, entities: entitiesPath },
    getEntities,
    uploadImage
};
