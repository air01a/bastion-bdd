import axios from 'axios';

const get_user_active_connections = async () => {
    return new Promise((resolve, reject) => {
        axios.get('/api/rights/active')
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            })
    })
}


const delete_user_active_connections = async (id) => {
    return new Promise((resolve, reject) => {
        axios.delete('/api/rights/active/' + id)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            })
    })
}


export { get_user_active_connections, delete_user_active_connections }