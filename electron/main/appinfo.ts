import {app} from 'electron';
import {is} from '@electron-toolkit/utils';

app.setAppUserModelId('com.dicyvpn.desktop');

if (is.dev) {
    app.setPath('userData', app.getPath('userData') + ' [dev]');
}
