const errorPayload = {
    error: true,
    value: 'unable to parse as json'
};

export default ( raw ) => {
    try {
        const data = JSON.parse( raw );
        return data;
    } catch(e) {
        return errorPayload;
    }
};