export default function Payload( error, value ) {
    /**
     * @returns {string}
     */
    this.serialize = () => JSON.stringify( this );

    if ( ! value ) {
        error = true;
        value = 'falsy value'
    }

    this.error = error;
    this.value = value;
}