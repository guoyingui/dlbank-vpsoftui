frame=top.document.all("right");
function barClick(id){
 //我的工作
 if(id==100001){//主页
    frame.src="/project/mywork/mainPageMenuAction.do";
 }
 if(id==100002){//沟通
    frame.src="/project/mywork/mail/mailTitle.jsp?url=/project/mywork/mail/mailListAction.do?type=1;pageNo=1;pageSize=22";
 }
 if(id==100003){//我的任务
    frame.src="right.jsp?c1=*&c2=0&middle=/project/mywork/initMyTaskTreeAction.do&right=";
 }
 if(id==100004){//报工
    frame.src="/project/mywork/timesheet/timeSheetMenuCardAction.do";
 }
 //项目管理
 if(id==100011){//所有项目
    frame.src="right.jsp?c1=*&c2=0&middle=/project/wbs/projectTreeMain.jsp?src=/project/wbs/projectTreeAction.do?viewType=allproject&right=";
 }
 if(id==100017){//我的项目
    frame.src="right.jsp?c1=*&c2=0&middle=/project/wbs/projectTreeMain.jsp?src=/project/wbs/projectTreeAction.do?viewType=myproject&right=";
 }
 if(id==100018){//本部门的项目
    frame.src="right.jsp?c1=*&c2=0&middle=/project/wbs/projectTreeMain.jsp?src=/project/wbs/projectTreeAction.do?viewType=mydptproject&right=";
 }
 if(id==100012){//有问题的项目
    frame.src="right.jsp?c1=*&c2=0&middle=/project/wbs/projectTreeMain.jsp?src=/project/wbs/projectTreeAction.do?viewType=problemproject&right=";
 }
 if(id==100013){//我创建的项目
    frame.src="right.jsp?c1=*&c2=0&middle=/project/wbs/projectTreeMain.jsp?src=/project/wbs/projectTreeAction.do?viewType=mycreateproject&right=";
 }
 if(id==100014){//我审批的项目
    frame.src="right.jsp?c1=*&c2=0&middle=/project/wbs/projectTreeMain.jsp?src=/project/wbs/projectTreeAction.do?viewType=myauditproject&right=";
 }
 if(id==100015){//已审批的项目
    frame.src="right.jsp?c1=*&c2=0&middle=/project/wbs/projectTreeMain.jsp?src=/project/wbs/projectTreeAction.do?viewType=audited&right=";
 }
 if(id==100016){//查找项目
    frame.src="/project/wbs/searchProject.jsp";
 }
 //部门管理
 if(id==100021){//我的部门
    frame.src="right.jsp?c1=*&c2=0&middle=/project/org/myDepartmentAction.do?type=my&right=";
 }
 if(id==100022){//所有部门
    frame.src="right.jsp?c1=*&c2=0&middle=/project/org/myDepartmentAction.do?type=all&right=";
 }
 //资源管理
 if(id==100031){//所有资源组
    frame.src="/project/resource/allResourceMainAction.do?panduan=1-yes";
 }
 if(id==100032){//我的资源组
    frame.src="/project/resource/allResourceMainAction.do?panduan=1-no";
 }
 if(id==100061){//角色
    frame.src="/project/org/role_frame.jsp";
 }
 //财务管理
 if(id==100041){//所有合同
    frame.src="right.jsp?c1=*&c2=0&middle=/project/finance/contractTreeAction.do?flag=finance;contractType=1&right=";
 }
 if(id==100042){//有问题的合同
    frame.src="right.jsp?c1=*&c2=0&middle=/project/finance/contractTreeAction.do?flag=finance;contractType=2&right=";
 }
 if(id==100043){//承包合同
    frame.src="right.jsp?c1=*&c2=0&middle=/project/finance/contractTreeAction.do?flag=finance;contractType=3&right=";
 }
 if(id==100044){//分包合同
    frame.src="right.jsp?c1=*&c2=0&middle=/project/finance/contractTreeAction.do?flag=finance;contractType=4&right=";
 }
 if(id==100047){//查找合同
    frame.src="right.jsp?c1=*&c2=0&middle=/project/finance/getSearchContractAction.do&right=";
 }
 //组织管理
 if(id==100062){//用户
    frame.src="/project/org/userManageTitle.jsp?url=/project/org/userManagerAction.do";
 }
 if(id==100063){//资源组
    frame.src="/project/resource/resMenuCard.jsp";
 }
 if(id==100064){//部门结构
    frame.src="right.jsp?middle=/project/org/deptStructrueTreeAction.do&right=/project/org/deptTitle.jsp?url=/project/org/getDeptStructrueAction.do?deptID=1";
 }
 //系统配置
 if(id==100073){//系统配置
    frame.src="/project/system/systemAction.do";
 }
 if(id==100072){
    frame.src="/project/system/operationoption/operationAction.do";
 }
  if(id==100074){//数据类型
    frame.src="/project/system/datatypeAction.do";
 }
 if(id==100077){//流程
    frame.src="/project/right.jsp?c1=*&c2=0&middle=/project/system/flow/getFlowTreeAction.do&right=";
 }
 if(id==100078){//模板
    frame.src="/project/system/mouldPlanAction.do";
 }
  if(id==1000711){//计分卡
    frame.src="/project/system/scorecard/getFirstTreeAction.do";
 }
 if(id==1000712){//阀值配置
    frame.src="/project/system/indicator/indicatorMenu.jsp?url=/project/system/indicator/getIndicatorConfigAction.do";
 }

 //系统管理
 if(id==100075){//特性定义
    frame.src="/project/right.jsp?c1=*&c2=0&middle=/project/system/charac/characTreeAction.do&right=/project/system/charac/characMenuCard.jsp";
 }
 if(id==100076){//项目状态
    frame.src="/project/right.jsp?c1=*&c2=0&middle=/project/system/projectStatus/projectStatusTreeAction.do?type=1&right=";
 }
  if(id==1000710){//项目组合状态
    frame.src="/project/right.jsp?c1=*&c2=0&middle=/project/system/projectStatus/projectStatusTreeAction.do?type=0&right=";
 }

 //分析报告
 if(id==100051){//组合分析
    frame.src="/project/finance/costCollect.jsp?type=7&projecttype=0";
 }
 if(id==100053){//成本汇总
    frame.src="/project/finance/costCollect.jsp?type=1";
 }
 if(id==100054){//分配资源汇总
    frame.src="/project/finance/costCollect.jsp?type=2";
 }
 if(id==100055){//资金规划
    frame.src="/project/finance/costCollect.jsp?type=3&projecttype=0";
 }
 if(id==100056){//资源能力规划
    frame.src="/project/finance/costCollect.jsp?type=4&projecttype=0";
 }
 if(id==100057){//资金模拟
    frame.src="/project/finance/costCollect.jsp?type=5&projecttype=0";
 }
 if(id==100058){//资源模拟
    frame.src="/project/finance/costCollect.jsp?type=6&projecttype=0";
 }
  if(id==100059){//挣值分析
    frame.src="/project/wbs/earnanalysis/outLookAnalysisPrepareAction.do";
 }
  if(id==1000510){//挣值分析
    frame.src="/project/finance/milestonet.jsp";
 }
  if(id==1000511){//基础报表
    frame.src="/project/finance/reportCard.jsp";
 }
}
