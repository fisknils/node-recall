export default ( offsetSeconds ) => {
    return Math.round( +new Date() / 1000 ) + offsetSeconds;
}