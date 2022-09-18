import {access, readFileSync} from "fs";
import config from '../config.js';

export default () => {
    return new Promise( ( resolve, reject ) => {
        access( config.pidFile, err => {
            if ( err ) {
                return resolve( false );
            }

            const pid = +readFileSync( config.pidFile, { encoding: 'utf-8' } );

            if ( ! pid ) {
                return resolve( false );
            }

            return resolve( pid );
        } )
    } );
};