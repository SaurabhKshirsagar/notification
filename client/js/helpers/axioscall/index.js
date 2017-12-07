import axios from 'axios';

function axiosCall (url,method,responseType,data){
    method = method || 'get';
    responseType = responseType||'json';
    data = data||''
    return axios({
            url: url,
            method: method,
            responseType: responseType,
            data:data
        });
    }
export default axiosCall;