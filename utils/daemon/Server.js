import {stat} from "node:fs";
import {createServer} from "node:net";
import {unlinkSync} from 'node:fs';
import config from "../../config.js";
import {parseJson} from "../_utils.js";
import Store from './Store.js';
import Payload from './Payload.js';

export default function Server() {
    const store = new Store();
    let server;

    this.close = () => {
        if ( ! server ) {
            return;
        }

        server.close();
    }

    /**
     * @param {Payload} Payload
     */
    const send = Payload => {
        this.connection.write( Payload.serialize() );
    }

    /**
     * @param {string} key
     * @param {string} value
     * @param {number} timeout
     */
    const set = ( key, value, timeout ) => {
        send(
            store.set( key, value, timeout )
        );
    };

    /**
     * @param {string} key
     */
    const get = key => {
        send(
            store.get( key )
        );
    };

    const start = () => {
        server = createServer( connection => {
            this.connection = connection;

            connection.on( 'data', onData );
        } );

        server.listen( config.socketPath );
    };

    /**
     * @param {Buffer} data
     */
    const onData = data => {
        data = parseJson( data.toString() );

        switch ( data.action ) {
            case 'die':
                send(
                    new Payload( false, process.pid )
                );
                process.exit();
                break;
            case 'clear':
                store.clear( data.key );
                send(
                    new Payload( false, 'cleared ' + data.key )
                );
                break;
            case 'get':
                send(
                    store.get( data.key )
                )
                break;
            case 'set':
                send(
                    store.set( data.key, data.value, data.timeout )
                );
                break;
            default:
                send(
                    new Payload(
                        true,
                        'No valid action detected'
                    )
                );
                break;
        }
    };

    stat( config.socketPath, err => {
        if (!err) unlinkSync(config.socketPath);
        start();
    } );
};