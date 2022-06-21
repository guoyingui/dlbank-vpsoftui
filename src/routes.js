import dynamicModule from './pages/dynamicIndex';
import { extend } from "utils/utils";

!function initRouter(params) {
	// 子项目路由
	let childApp = window.vpapp = window.vpapp || {}; 
	childApp.definde = extend({}, (childApp.definde || {}), dynamicModule)
	childApp.routes = (childApp.routes || []).concat([
		{
			// 定制通用视图列表
			code: 'dlentity',
			path: '/dlentity/:type/:entityid/:functionid',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/dlbank/Entity').default);
				}, 'dlentity'))
			},
			file: require('pages/dlbank/Entity').default
		},
		{
			//任务活动参数
			code: 'dltaskparam',
			path: '/dltaskparam/:type/:sparam/:entityid/:functionid',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/dlbank/Task/task').default);
				}, 'dltaskparam'))
			}
		},
		{
			//同步合同,合同信息日志页面
			code: 'contractlog',
			path: '/contractlog',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/dlbank/dynamic/ContractLog/contractlog').default);
				}, 'contractlog'))
			}
		},
		{
			//测试报告
			code: 'dltestReport',
			path: '/dltestReport',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/dlbank/TestReport/testReport').default);
				}, 'dltestReport'))
			},
			file: require('pages/dlbank/TestReport/testReport').default
		},
		{
			//自定义实体组件
			code: 'dlentityparam',
			path: '/dlentityparam/:type/:sparam/:entityid/:functionid',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/dlbank/Entity').default);
				}, 'dlentityparam'))
			},
			file: require('pages/dlbank/Entity').default
		},
		{
			//itsm推送记录
			code: 'itsmPushLog',
			path: '/itsmPushLog',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/dlbank/dynamic/ContractLog/itsmPushLog').default);
				}, 'itsmPushLog'))
			}
		},
		{
			//测试执行
			code: 'dlcscaseexec',
			path: '/dlcscaseexec',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/dlbank/Cscaseexec/cscaseexec').default);
				}, 'dlcscaseexec'))
			}
		},
		{
			//测试执行
			code: 'LeaderView',
			path: '/leaderView',
			component: (location, cb) => {
				wrapper(require.ensure([], require => {
					cb(null, require('pages/dlbank/leaderView').default);
				}, 'LeaderView'))
			}
		}
	]);
	function wrapper(loadComponent) {
		let React = null;
		let Component = null;
		let Wrapped = props => (
			<div className="namespace">
				<Component {...props} />
			</div>
		);
		return async () => {
			React = require('react');
			Component = await loadComponent();
			return Wrapped;
		};
	}
}()



