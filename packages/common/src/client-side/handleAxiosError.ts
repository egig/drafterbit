export = function handleAxiosError(error: any) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if(typeof error.response.data === 'string') {
            let e: any = new Error(error.response.data);
            e.status = error.response.status;
            throw e;
        }

        throw error.response.data;
    }

    if (error.request) {
        // The request was made but no response was received
        console.error('The request was made but no response was received, REQUEST: ', error.request);
        throw Error('The request was made but no response was received');
    }

    throw error;
}