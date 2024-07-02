/*
 * cookie 封装
 */
import Cookies from 'js-cookie';

let COOKIE_PARAMS = {
    domain: document.domain || '',
    path: '/'
};
const cookie = {
    _prefix: '',
    init(prefix, domain) {
        if(domain) {
            COOKIE_PARAMS.domain = `.${domain}`;
        }
        this._prefix = prefix || '';
    },
    set (name, value, params) {
        // Cookies.set('name', 'value');
        // Cookies.set('name', 'value', { expires: 7 });
        // Cookies.set('name', 'value', { expires: 7, path: '' });
        params = Object.assign(COOKIE_PARAMS, params);
       
        Cookies.set(`${this._prefix}${name}`, value, params);
    },
    setItem (name, value, params) {
        // Cookies.set('name', 'value');
        // Cookies.set('name', 'value', { expires: 7 });
        // Cookies.set('name', 'value', { expires: 7, path: '' });
        params = Object.assign(COOKIE_PARAMS, params);
       
        Cookies.set(`${this._prefix}${name}`, value, params);
    },

    get (name) {
        if(name) {
            let data = Cookies.get(`${this._prefix}${name}`);
            try {
                return JSON.parse(data);
            } catch (e) {
                return data;
            }
        }
        return Cookies.get();
    },
    getItem (name) {
        if(name) {
            let data = Cookies.get(`${this._prefix}${name}`);
            try {
                return JSON.parse(data);
            } catch (e) {
                return data;
            }
        }
        return Cookies.get();
    },

    remove (name, params) {
        params = Object.assign(COOKIE_PARAMS, params);
		let arr = [];
		if(name) {
			// 移除指定名字的cookie
			arr = Array.isArray(name) ? name : [name];
		} else {
			// 移除当前域名下所有的cookie
			arr = document.cookie.match(/[^ =;]+(?=\=)/g);
		}
		try {
			(arr || []).forEach(key => {
				Cookies.remove(`${this._prefix}${key}`, params);
			});
		} catch(err) {
			console.log(err);
		}
    },
    removeItem (name, params) {
        params = Object.assign(COOKIE_PARAMS, params);
		let arr = [];
		if(name) {
			// 移除指定名字的cookie
			arr = Array.isArray(name) ? name : [name];
		} else {
			// 移除当前域名下所有的cookie
			arr = document.cookie.match(/[^ =;]+(?=\=)/g);
		}
		try {
			(arr || []).forEach(key => {
				Cookies.remove(`${this._prefix}${key}`, params);
			});
		} catch(err) {
			console.log(err);
		}
    }
}

export default cookie;
