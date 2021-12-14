import axios from 'axios';

const get_user_databases = async () => {
    return new Promise((resolve, reject) => {
        console.log(axios.defaults.headers.common);
        axios.get('/api/rights')
            .then(function (response) {
                console.log(response)
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            })
    })
}

export { get_user_databases }