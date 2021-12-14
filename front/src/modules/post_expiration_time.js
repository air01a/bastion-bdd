import axios from 'axios';

const post_expiration_time = async (value) => {
    return new Promise((resolve, reject) => {
        console.log(axios.defaults.headers.common);
        axios.post('/api/expiration_time', { expiration_time: value })
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            })
    })
}

export { post_expiration_time }

