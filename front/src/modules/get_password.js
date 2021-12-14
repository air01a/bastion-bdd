import axios from 'axios';

const get_password = async (database_id, time) => {
    return new Promise((resolve, reject) => {
        axios.post('/api/rights/' + database_id + '/activate', { time: time })
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            })
    })
}

export { get_password }