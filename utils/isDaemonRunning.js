import {getDaemonPid} from './_utils.js';
import isRunning from 'is-running';

export default async () => {
    const pid = await getDaemonPid();

    if ( ! pid ) {
        return false;
    }

    if ( isRunning( pid ) ) {
        return pid;
    }

    return false;
};