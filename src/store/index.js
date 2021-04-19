import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {//这些状态信息应用于Kubernetes模块的向导式构建功能
        configMap: {names: []},
        secret: {names: []},
        service: {names: []},
        //例如pod类型下有多个pod类型资源，通过name查询出对应的pod;
        //volumes是二维数组，最外层代表一组pod类型资源文件的volume，最内层代表某个pod类型的volume数组
        pod: {names: [], volumes: []},
        replicaSet: {names: [], volumes: []},
        deployment: {names: [], volumes: []}
    },
    mutations: {
        //configMap
        addConfigMapName(state, name) {
            state.configMap.names.push(name);
        },
        removeConfigMapName(state, name) {
            let index = state.configMap.names.indexOf(name);
            state.configMap.names.splice(index, 1);
        },
        //secret
        addSecretName(state, name) {
            state.secret.names.push(name);
        },
        removeSecretName(state, name) {
            let index = state.secret.names.indexOf(name);
            state.secret.names.splice(index, 1);
        },
        //pod
        addPodName(state, name) {
            state.pod.names.push(name);
            state.pod.volumes.push([]);
        },
        removePodName(state, name) {
            let index = state.pod.names.indexOf(name);
            state.pod.names.splice(index, 1);
            state.pod.volumes.splice(index, 1);
        },
        addPodVolume(state, structure) {
            let index = state.pod.names.indexOf(structure.resourceName);
            let volume = {type: structure.volumeType, name: structure.volumeName};
            state.pod.volumes[index].push(volume);
        },
        removePodVolume(state, structure) {
            let index = state.pod.names.indexOf(structure.resourceName);
            let volumes = state.pod.volumes[index];
            let length = volumes.length;
            //循环当前pod的volumes,二维数组的第二层，找到相应的数据进行删除。
            let volumeType = structure.volumeType;
            let volumeName = structure.volumeName;
            for (let i = 0; i < length; i++) {
                let eachVolume = volumes[i];
                let flag = eachVolume.type === volumeType && eachVolume.name === volumeName;
                if (flag) {
                    state.pod.volumes[index].splice(i, 1);
                    break;
                }
            }
        },
        //replicaSet
        addReplicaSetName(state, name) {
            state.replicaSet.names.push(name);
            state.replicaSet.volumes.push([]);
        },
        removeReplicaSetName(state, name) {
            let index = state.replicaSet.names.indexOf(name);
            state.replicaSet.names.splice(index, 1);
            state.replicaSet.volumes.splice(index, 1);
        },
        addReplicaSetVolume(state, structure) {
            let index = state.replicaSet.names.indexOf(structure.resourceName);
            let volume = {type: structure.volumeType, name: structure.volumeName};
            state.replicaSet.volumes[index].push(volume);
        },
        removeReplicaSetVolume(state, structure) {
            let index = state.replicaSet.names.indexOf(structure.resourceName);
            let volumes = state.replicaSet.volumes[index];
            let length = volumes.length;
            //循环当前replicaSet的volumes,二维数组的第二层，找到相应的数据进行删除。
            let volumeType = structure.volumeType;
            let volumeName = structure.volumeName;
            for (let i = 0; i < length; i++) {
                let eachVolume = volumes[i];
                let flag = eachVolume.type === volumeType && eachVolume.name === volumeName;
                if (flag) {
                    state.replicaSet.volumes[index].splice(i, 1);
                    break;
                }
            }
        },
        //deployment
        addDeploymentName(state, name) {
            state.deployment.names.push(name);
            state.deployment.volumes.push([]);
        },
        removeDeploymentName(state, name) {
            let index = state.deployment.names.indexOf(name);
            state.deployment.names.splice(index, 1);
            state.deployment.volumes.splice(index, 1);
        },
        addDeploymentVolume(state, structure) {
            let index = state.deployment.names.indexOf(structure.resourceName);
            let volume = {type: structure.volumeType, name: structure.volumeName};
            state.deployment.volumes[index].push(volume);
        },
        removeDeploymentVolume(state, structure) {
            let index = state.deployment.names.indexOf(structure.resourceName);
            let volumes = state.deployment.volumes[index];
            let length = volumes.length;
            //循环当前deployment的volumes,二维数组的第二层，找到相应的数据进行删除。
            let volumeType = structure.volumeType;
            let volumeName = structure.volumeName;
            for (let i = 0; i < length; i++) {
                let eachVolume = volumes[i];
                let flag = eachVolume.type === volumeType && eachVolume.name === volumeName;
                if (flag) {
                    state.deployment.volumes[index].splice(i, 1);
                    break;
                }
            }
        },

    },
    actions: {},
    modules: {}
})
