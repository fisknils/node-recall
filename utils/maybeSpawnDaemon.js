import isDaemonRunning from "./isDaemonRunning.js";
import {resolve} from "node:path";
import {spawn} from "node:child_process";
import {sleep} from "./_utils.js";
import { fileURLToPath} from "url";

const __dirname = fileURLToPath( new URL( '.', import.meta.url ) );

export default async () => {
    if ( await isDaemonRunning() ) {
        return;
    }

    // Spawn recall-daemon as a child process.
    const child = spawn(
        resolve( __dirname, '../bin/recall-daemon.js' ),
        [],
        { detached: true, stdio: 'ignore' }
    );

    child.unref();

    await sleep(100);
};