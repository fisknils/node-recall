import Payload from './Payload.js';
import timestamp from '../timestamp.js';

export default function Store() {
    const store = {};
    const timeouts = {};

    const tick = () => {
        const now = timestamp();

        Object.entries( timeouts ).forEach( ( [ key, value ] ) => {
            if ( now > value ) {
                this.clear( key );
            }
        });
    };

    setInterval( tick, 1000 );

    /**
     * @param {string} key
     * @returns {Payload}
     */
    this.get = key => new Payload( false, store[ key ] );

    /**
     * @param {string} key
     * @param {string} value
     * @param {number} timeout
     * @returns {Payload}
     */
    this.set = ( key, value, timeout ) => {
        store[ key ] = value;
        timeouts[ key ] = timestamp( timeout );

        return new Payload( false, `remembering ${key} for ${timeout} seconds` );
    }

    /**
     * @param {string} key
     * @returns {Payload}
     */
    this.clear = key => {
        let error = false;
        let value = `cleared ${key} from store`;

        if ( ! store[ key ] ) {
            error = true;
            value = `could not find ${key}. Nothing cleared.`;
        } else {
            delete store[ key ];
        }

        if ( timeouts[ key ] ) delete timeouts[ key ];

        return new Payload( error, value );
    }
}
