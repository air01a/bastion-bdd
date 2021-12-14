import { request } from './request.js';


const cognito_redirect = () => {
    request('GET', '/api/cognito', {}).then((res) => {
        window.location = res.url;
    });
}


export { cognito_redirect }