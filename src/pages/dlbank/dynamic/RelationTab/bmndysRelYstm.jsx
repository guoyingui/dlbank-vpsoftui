import React, { Component } from 'react'
import {
    VpAlertMsg, vpAdd, vpQuery, VpFormCreate
} from 'vpreact'

import RelEntity from '../Common/relEntity2Ystm'
/**
 * 
 */
class CustomRelEntity2Ystm extends RelEntity.Component {
    /**
     * 点击新建按钮前,调用的方法
     */
    onBeforeNewRel(sparam) {
        if (sparam.classList.length == 0) {
            VpAlertMsg({
                message: "消息提示",
                description: "部门年度预算已初审/已关闭，不允许再新建，请联系科技预算管理员！",
                type: "warning",
                closeText: "关闭",
                showIcon: true
            }, 5);
            return false;
        }
    }
    /**
     * 自定义获取新建按钮下拉类别后台
     */
    getClassList(entityid, mainentityid, mainentityiid) {
        return vpAdd('/{vppm}/dlbank/budget/getClassList', {
            entityid, mainentityid, mainentityiid
        });
    }
    /**
     * 保存关系后台
     */
    // onSaveReal(param) {
    //     return vpAdd('/{vppm}/test/test/saveRel', {
    //         sparam: JSON.stringify(param)
    //     });
    // }
    /**
     * 删除关系后台
     */
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
}
CustomRelEntity2Ystm = RelEntity.createClass(CustomRelEntity2Ystm);

//分配资源
class bmndysRelYstm extends Component {
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
        this.setState({
            entityid, iid, stabparam, irelationentity
        })
    }

    render() {
        let urlparam = "condition="
        // 关联tab页，关联按钮弹出框增加过滤条件示例
        // let conSql = ""
        // conSql = "select es.iid "
        //     + "  from cfg_entity_status es "
        //     + " where es.istatus = 2 " // 关闭的预算条目
        //     + "   and es.iparentid = " + this.state.irelationentity
        // urlparam = "condition=" + JSON.stringify([{
        //     field_name: 'istatusid',
        //     field_value: encodeURIComponent(conSql),
        //     expression: 'in' //支持between（日期、数字类型字段）、in、gt、egt、eq、lt、elt等数字操作符；
        // }])
        // console.log(conSql)
        return (
            <div className="team-task-view">
                {
                    this.state.irelationentity &&
                    <CustomRelEntity2Ystm
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
                        urlparam={urlparam} // 关联选择弹框数据过滤条件
                        isAddBtn={true} // 新建按钮:false表示隐藏，否则表示沿用系统权限
                        isDelBtn={false} // 删除按钮:false表示隐藏，否则表示沿用系统权限
                        isRelBtn={false} // 关联按钮:false表示隐藏，否则表示沿用系统权限
                        isEditBtn={false} // 编辑按钮:false表示隐藏，否则表示沿用系统权限
                    />
                }
            </div>
        )
    }
}


export default bmndysRelYstm = VpFormCreate(bmndysRelYstm)
