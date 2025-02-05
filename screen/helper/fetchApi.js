
// const API_ENDPOINT = 'https://api-dev.dubaicharity.org/api/';
const API_ENDPOINT = 'https://api.dubaicharity.org/api/';
//const API_ENDPOINT = `https://api-stg.synkcode.com/api/`

const get = async(url, options = {}) => {
  return new Promise(async (resolve, reject) => {
    let baseURL = API_ENDPOINT + url;
    try {
      
      let result = await fetch(baseURL, {
        ...options,
        method: 'GET',
      });
      const response = await result.json()

      if (result.ok) {
        resolve(response);
      } else {
        // errorMessage(result.errors ?? result.message);
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Post method
const post = async (url, data, method = 'POST') => {
  return new Promise(async (resolve, reject) => {
    let baseURL = API_ENDPOINT + url;
    try {
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const response = await fetch(baseURL, {
        method: method,
        headers,
        body: data,
      });
      const result = await response.json();
      if (result.status || result.success) {
        resolve(result);
      } else {
        resolve(result)
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Delete method
const Delete = async (url, data, method = 'POST') => {
   return new Promise(async (resolve, reject) => {
    let baseURL = API_ENDPOINT + url;
    try {
      const headers = {
        Accept: '*/*',
        'Content-Type': 'multipart/form-data;',
      };
     
      const response = await fetch(baseURL, {
        method: method,
        headers,
        body: data,
      });
      const result = await response.json();
      if (result.status || result.success) {
        resolve(result);
      } else {
        resolve(result)
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  get,
  post,
  Delete,
};
