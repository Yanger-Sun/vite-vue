import globalConfig from '@/global/config';
import cookie from './cookie';
import ls from './local-storage';
import ss from './session-storage';

// 初始化前localStorage 和sessionStorage前缀
ls.init(globalConfig.storagePrefix);
ss.init(globalConfig.storagePrefix);

// 初始化cookie并指定 domain
cookie.init(globalConfig.storagePrefix, globalConfig.domain);

export {
	ls,
	ss,
    cookie
}