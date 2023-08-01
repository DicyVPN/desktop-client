import {type API, createApi} from '../../common/api';
import {INVALID_REFRESH_TOKEN, SEND_TO_RENDERER} from '../../common/channels';

let instance: API;

export default function useApi() {
    if (instance) return instance;

    instance = createApi(window.settings, () => window.electron.ipcRenderer.invoke(SEND_TO_RENDERER, INVALID_REFRESH_TOKEN));

    return instance;
}
