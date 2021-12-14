import axios from 'axios';
import { cognito_redirect } from './cognito.js';

const check_token = () => {
    var urlSearch = new URLSearchParams(window.location.hash.replace('#', '?'));
    var access_token = urlSearch.get('access_token');
    var id_token = urlSearch.get('id_token');

    if (access_token === null)
        cognito_redirect();
    axios.defaults.headers.common['Authorisation'] = 'Bearer ' + access_token
    return new Promise((resolve) => {
        axios.defaults.headers.common['Authorisation'] = 'Bearer ' + id_token
        axios.get('/api/verif_token')
            .then(function (response) {
                console.log(response)
                resolve({ response: response, id_token: id_token, access_token: access_token });
            })
            .catch(
                function () {
                    cognito_redirect();
                })
    })
}

export { check_token }