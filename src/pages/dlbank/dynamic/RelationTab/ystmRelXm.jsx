import React, { Component } from 'react'
import {
    VpAlertMsg, vpAdd, vpQuery, VpFormCreate
} from 'vpreact'

import RelEntity from '../Common/relEntity'
/**
 * 
 */
class CustomRelEntity extends RelEntity.Component {
    /**
     * 点击新建按钮前,调用的方法
     */
    // onBeforeNewRel(sparam) {
    //     if (sparam.classList.length == 0) {
    //         VpAlertMsg({
    //             message: "消息提示",
    //             description: "部门年度预算已初审/已关闭，不允许再新建，请联系科技预算管理员！",
    //             type: "warning",
    //             closeText: "关闭",
    //             showIcon: true
    //         }, 5);
    //         return false;
    //     }
    // }
    /**
     * 自定义获取新建按钮下拉类别后台
     */
    // getClassList(entityid, mainentityid, mainentityiid) {
    //     return vpAdd('/{vppm}/dlbank/budget/getClassList', {
    //         entityid, mainentityid, mainentityiid
    //     });
    // }
    /**
     * 保存关系后台
     */
    // onSaveReal(param) {
    //     return vpAdd('/{vppm}/test/test/saveRel', {
    //         sparam: JSON.stringify(param)
    //     });
    // }
    // /**
    //  * 删除关系后台
    //  */
    // onDeleteRel(param) {
    //     return vpAdd('/{vppm}/test/test/delRel', {
    //         sparam: JSON.stringify(param)
    //     });
    // }
    /**
     * 在删除关系前,调用的方法
     */
    // onBeforeDeleteRel(sparam) {
    //     return vpQuery('/{vppm}/test/test/testBeforeDelete', {
    //         bbid: sparam.mainentityiid,
    //         reqid: sparam.irelationentityiid,
    //     }).then((response) => {
    //         if (response.data == false) {
    //             VpAlertMsg({
    //                 message: "消息提示",
    //                 description: "测试",
    //                 type: "warning",
    //                 closeText: "关闭",
    //                 showIcon: true
    //             }, 5);
    //         }
    //         return response.data;
    //     })
    // }
    /**
     * 关系页签列表数据后台定制
     * @param {*} sparam 
     */
    getDynamicListData(sparam) {
        
        sparam.stabparam = 'rystm'
        return vpAdd('/{vppm}/vfrm/entity/seconddynamicListData', sparam)
    }

}
CustomRelEntity = RelEntity.createClass(CustomRelEntity);

//分配资源
class ystmRelXm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            entityid: '',
            iid: '',
            irelationentity: '',
            stabparam: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.stabparam != this.props.stabparam) {
            this.setState({
                stabparam: nextProps.stabparam.split(',')[0]
            })
        }
    }

    componentDidMount() {
        let irelationentity = this.props.skey.replace(/[^0-9]/ig, "")//权限码中提取数字，数字即为当前挂起的实体id
        let entityid = this.props.viewtype == 'pjtree' ? this.props.row_entityid : this.props.entityid
        let iid = this.props.viewtype == 'pjtree' ? this.props.row_id : this.props.iid
        let stabparam = this.props.stabparam
        stabparam = stabparam.split(',')[0]
        this.getPersonalBudgetRole( entityid, iid, stabparam, irelationentity)
    }
    getPersonalBudgetRole = (entityid, iid, stabparam, irelationentity) => {
        let _this = this
        vpQuery('/{vppm}/dlbank/second/getPersonalBudgetRole', {
           
        }).then((response) => {
            let data = response.data
            
            if(data){
                _this.budgetSql = data.sql
                
            }
            let urlparam = "condition="
            // 关联tab页，关联按钮弹出框增加过滤条件示例
            let conSql = ""
            conSql = "select pj.iid "
                + "     from vpm_pj_project pj  "
                + "     left join vpm_pj_project_ext pje on pj.iid=pje.iitemid "
                + "     left join vpm_budget bud on pje.rystm=bud.iid "
                + "     left join cfg_entity_status pjs on pj.istatusid=pjs.iid "
                + "    where pjs.istatus < 2 "     // 关闭的项目不显示
                + "      and pjs.iparentid = " + irelationentity
                + "      and bud.iid is null " // 已经关联过预算条目的项目不显示
                + _this.budgetSql
            urlparam = "condition=" + JSON.stringify([{
                field_name: 'iid',
                field_value: encodeURIComponent(conSql),
                expression: 'in' //支持between（日期、数字类型字段）、in、gt、egt、eq、lt、elt等数字操作符；
            }])
            console.log(conSql)
          
            console.log('budgetSql',_this.budgetSql)
           
            _this.setState({urlparam,entityid, iid, stabparam, irelationentity})
            
        })
    }
    render() {
        
        return (
            <div className="team-task-view">
                {
                    this.state.irelationentity &&
                    <CustomRelEntity
                        entityid={this.state.entityid}
                        iid={this.state.iid}
                        imainentity={this.state.entityid}
                        irelationentity={this.state.irelationentity}
                        row_entityid={this.state.entityid}
                        row_id={this.state.iid}
                        issubitem={this.props.issubitem}
                        stabparam={this.state.stabparam}
                        entityrole={this.props.entityrole}
                        skey={this.props.skey}//权限码
                        isTab={'true'}
                        viewtype={'list'}
                        urlparam={this.state.urlparam} // 关联选择弹框数据过滤条件
                        isAddBtn={false} // 新建按钮:false表示隐藏，否则表示沿用系统权限
                        isDelBtn={true} // 删除按钮:false表示隐藏，否则表示沿用系统权限
                        isRelBtn={true} // 关联按钮:false表示隐藏，否则表示沿用系统权限
                        isEditBtn={true} // 编辑按钮:false表示隐藏，否则表示沿用系统权限
                    />
                }
            </div>
        )
    }
}


export default ystmRelXm = VpFormCreate(ystmRelXm)
