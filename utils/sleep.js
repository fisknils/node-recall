/**
 * @param {number}] ms - Milliseconds to sleep.
 * @returns {Promise} Resolves after the given amount of time.
 */
export default ( ms = 100 ) => {
    return new Promise(( resolve ) => {
        setTimeout( resolve, ms );
    });
};