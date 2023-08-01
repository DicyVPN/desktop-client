import {type API, createApi} from '../../common/api';

let instance: API;

export default function useApi() {
    if (instance) return instance;

    instance = createApi(window.settings);

    return instance;
}
