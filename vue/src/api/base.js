import util from "@/init/util";
import axios from "axios";
import iView from "iview";
import { urlServer, url401, urlJwt, url50x } from "@/init/conf";

const ajax = axios.create({
	baseURL: urlServer,
	timeout: 30000
});
//添加一个请求拦截器
ajax.interceptors.request.use(
	function(config) {
		iView.LoadingBar.start();
		//在请求发出之前进行一些操作
		console.log("send");
		if (config.url.indexOf("/api/login") == -1) {
			config.headers.Authorization = "Bearer " + util.getItem("bearer"); //Bearer
		}
		return config;
	},
	function(err) {
		//Do something with request error
		return Promise.reject(err);
	}
);
//添加一个响应拦截器
ajax.interceptors.response.use(
	function(res) {
		iView.LoadingBar.finish();
		//在这里对返回的数据进行处理
		console.log("recv");
		if (res.data.code == 330) {
			// iView.Notice.error({
			// 	duration: 3,
			// 	title: "系统提醒",
			// 	desc: "对不起你没有权限访问"
			// });
			// return new Promise(() => {});
			location.href = url401;
		}
		if (res.data.code == 340) {
			// iView.Notice.error({
			// 	duration: 2,
			// 	title: "系统提醒",
			// 	desc: "登陆失效,请重新登陆",
			// 	onClose: () => {
			// 		localStorage.removeItem("bearer");
			// 		//没有登陆信息默认跳转到登陆页面
			// 		// location.reload();
			// 	}
			// });
			// return new Promise(() => {});
			util.clearData();
			location.href = urlJwt;
		}
		if (res.data.code == 350) {
			// iView.Notice.error({
			// 	duration: 3,
			// 	title: "系统提醒",
			// 	desc: "服务端发生错误,请重试"
			// });
			// return new Promise(() => {});
			location.href = url50x;
		}
		return res.data;
	},
	function(err) {
		iView.Notice.error({
			duration: 5,
			title: "系统提醒",
			desc: "网络连接异常,请重试"
		});
		return new Promise(() => {});
		//return Promise.reject(err);
	}
);
export default ajax;
