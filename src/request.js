let baseUrl = "http://localhost:8081/dckr";
let kubeModel = "/kubernetes";
let rancherModel = "/rancher";
let kubeUrl = baseUrl + kubeModel;
let rancherUrl = baseUrl + rancherModel;

export const createKubeByCompose = kubeUrl + "/upload/compose";
export const createKubeByGuide = kubeUrl + "/guide";
export const downloadKube = kubeUrl + "/download/";

export const createRancherByCompose = rancherUrl + "/upload/compose";
export const createRancherByKube = rancherUrl + "/upload/kubernetes";
export const createRancherByGuide = rancherUrl+"/guide";
export const downloadRancher = rancherUrl + "/download/";
