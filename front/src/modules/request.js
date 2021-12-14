import axios from 'axios';
import { cognito_redirect } from './cognito.js';


const request = async (type, url, params) => {
    return new Promise((resolve, reject) => {
        let req;
        if (type == "PUT") {
            req = axios.put(url, params)
        } else if (type == 'POST') {
            req = axios.post(url, params)
        } else if (type == 'DELETE') {
            req = axios.delete(url, params)
        } else {
            req = axios.get(url, params)
        }
        req
            .then(function (response) {
                console.log(response)
                resolve(response.data);
            })
            .catch(error => {
                if (error.response.status == 401)
                    cognito_redirect();
                reject({ error: error.response.status })
            });
    });
}

export { request }