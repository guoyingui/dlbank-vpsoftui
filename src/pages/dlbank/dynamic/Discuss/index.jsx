import React from 'react';
import {
    VpTooltip,
    VpIconFont,
    VpInput,
    VpRadioGroup,
    VpRadio,
    VpModal,
    vpQuery,
    vpAdd,
    VpUploader,
    vpDownLoad,
    VpButton,
    VpAlertMsg,
    VpMention
} from 'vpreact';
import logosm from "vpstatic/images/logosm.jpg";
import './index.less';
//import Choosen from '../ChooseEntity/ChooseEntity';
import { requireFile } from 'utils/utils';
const Choosen = requireFile('vfm/ChooseEntity/ChooseEntity');
export default class JobBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            changeIconTitle: "收起",
            view: true,
            boxWidth: 'auto',
            check: 0,
            radioChangeValue: this.props.radioChangeValue || '0',
            visible: false,
            entityTeam: [],
            fileinfo: [],
            listDiscuss: [],
            upload: false,
            alllistDiscuss: [],
            isSend: false,
            loading: false,
            userlist: '',
            value: '',
            params: {}
        };
        this.textareaPlaceholder = "按 Enter 快速发布";
    }
    componentWillMount() {
        this.queryEntityTeam()
        this.queryListDiscuss()
    }
    queryUserList = () => {
        vpQuery('/{vpplat}/vfrm/entity/userlist', {
            filtervalue: this.state.filtervalue
        }).then((response) => {
            this.setState({
                userlist: response.data
            })
        })
    }
    queryListDiscuss = () => {
        vpQuery('/{vppm}/dlbank/cpReq/listDiscuss', {
            entityid: this.props.entityid,//主实体id
            iid: this.props.iid//主实体iid
        }).then((response) => {
            this.setState({
                listDiscuss: response.data,
                alllistDiscuss: response.data
            }, () => {
                this.formatData(this.state.radioChangeValue)
            })
        })
    }
    queryEntityTeam = () => {
        vpQuery('/{vpplat}/vfrm/entity/entityTeam', {
            entityid: this.props.entityid,//主实体id
            iid: this.props.iid//主实体iid
        }).then((response) => {
            this.setState({
                entityTeam: response.data
            })
        })
    }
    handleButtonClick = (e) => {
        this.setState({ check: e.key })
        e.key == "0" ? this.textareaPlaceholder = "按 Enter 快速发布" : this.textareaPlaceholder = "按 Ctrl+Enter 快速发布";
    }
    onRadioChange = (e) => {
        let radioChangeValue = e.target.value
        this.formatData(radioChangeValue)
    }
    formatData = (radioChangeValue) => {
        let newList = []
        /* if (radioChangeValue == 0) {
            newList = this.state.alllistDiscuss
        } else if (radioChangeValue == 3) {
            newList = this.state.alllistDiscuss.filter((item) => {
                return item.iclassid == 3
            })
        } 
        else if (radioChangeValue == 4) {
            newList = this.state.alllistDiscuss.filter((item) => {
                return item.iclassid == 4
            })
        } else if (radioChangeValue == 5) {
            newList = this.state.alllistDiscuss.filter((item) => {
                return item.iclassid == 5
            })
        } else if (radioChangeValue == 2) {
            newList = this.state.alllistDiscuss.filter((item) => {
                return item.iclassid == 2
            })
        } 
        else {
            newList = this.state.alllistDiscuss.filter((item) => {
                return item.iclassid == 2
            })
        } */
        if (radioChangeValue == 0) {
            newList = this.state.alllistDiscuss
        } else {
            newList = this.state.alllistDiscuss.filter((item) => {
                return item.iclassid == radioChangeValue
            })
        }
        this.setState({
            radioChangeValue: radioChangeValue,
            listDiscuss: newList
        })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleOk = () => {
        this.setState({
            visible: false,
        });
    }
    submitChoosen = (selectItem) => {
        this.setState({
            visible: false,
        });
    }
    onPressEnter = (e) => {
        if (!this.state.loading) {
            this.submitDiscuss()
        }
    }
    btnClick = () => {
        this.submitDiscuss()
    }
    submitDiscuss = () => {
        this.setState({
            loading: true
        })
        if (this.props.entityrole == true) {
            let remark = this.state.value
            let fileinfo = this.state.fileinfo
            let remarknospace = remark.replace(/\s/g, "")
            let classid = this.state.radioChangeValue
            if (remarknospace != '' && remarknospace != null && remarknospace != undefined) {
                var reg = RegExp(/\s*\@+\S*\s*/g);
                let userlist = remark.match(reg);
                vpAdd('/{vpplat}/vfrm/entity/saveDiscuss', {
                    entityid: this.props.entityid,
                    iid: this.props.iid,
                    remark: remark,
                    fileinfo: JSON.stringify(fileinfo),
                    userlist: userlist == null ? "" : JSON.stringify(userlist),
                    classid: classid == "0" ? "2" : classid
                }).then((response) => {
                    VpAlertMsg({
                        message: "消息提示",
                        description: '发送成功！',
                        type: "success",
                        onClose: this.onClose,
                        closeText: "关闭",
                        showIcon: true
                    }, 5);
                    this.setState({
                        fileinfo: [],
                        isSend: true,
                        loading: false,
                        value: ''
                    });
                    $('.vp-discuss').find('.ant-input').val('');
                    this.queryListDiscuss();
                }).catch((e) => {
                    this.setState({
                        loading: false
                    })
                })
            } else {
                VpAlertMsg({
                    message: "消息提示",
                    description: '消息不能为空！',
                    type: "error",
                    onClose: this.onClose,
                    closeText: "关闭",
                    showIcon: true
                }, 5)
                this.setState({
                    loading: false
                })
            }
        }
    }
    addfile = () => {
        this.setState({
            upload: true,
            isSend: false
        })
    }
    handleFileModal = () => {
        this.setState({
            upload: true
        })
    }
    handleFileCancel = () => {
        this.setState({
            upload: false
        })
    }
    onUploadAccept = (file, response) => {
        this.state.fileinfo.push(response.data)
        this.setState({
            fileinfo: this.state.fileinfo
        })
    }
    downLoad = (iid) => {
        vpDownLoad("/{vpplat}/file/downloadfile", {
            fileid: vp.encrypt.aesEncrypt(iid,"rSzSK900KLMxOgZ/"), entityid: this.props.entityid, instanceid: this.props.iid
        })
    }
    onMentionChange = (value) => {
        this.setState({
            value
        })
    }
    onMentionMatch = (value) => {
        this.setState({
            params: { filtervalue: value }
        })
    }
    ctrlenter = () => {
        this.submitDiscuss()
    }
    render() {
        return (
            <div className="vp-discuss full-height p-r-xs pr" style={{paddingBottom:150}}>
				<div className="full-height scroll-y">
                <div className="member-involve-title m-tb-sm p-lr-xs f14">参与者 · {this.state.entityTeam.length}</div>
                <div className="member-involve-list">
                    {
                        this.state.entityTeam.map((item, index) => {
                            return (
                                <div key={index} className="inline-display m-r-xs text-center">
                                    <div className="avatar">
                                        <img src={logosm} alt="" />
                                    </div>
                                    <div className="text-muted f12">{item.sname}</div>
                                </div>
                            )
                        })
                    }
                    {/* <div className="avatar">
                        <VpTooltip title="添加参与者">
                            <VpButton type="primary" shape="circle" icon="plus" onClick={this.showModal} />
                        </VpTooltip>
                    </div> */}
                </div>
                <div className="member-involve-content scroll-y b-t b-b">
                    <ul>
                        <div>
                            {
                                this.state.listDiscuss.map((item, index) => {
                                    if (item.iclassid == 1) {
                                        return (
                                            <li key={index} className="activity creator clearfix">
                                                <VpIconFont type="vpicon-plus" className="pull-left" />
                                                <VpTooltip title={item.dcreatetime}>
                                                    <div className="pull-right">{item.dcreatetime}</div>
                                                </VpTooltip>
                                                <div className="body pull-left">
                                                    <span className="text-muted">{item.username}</span>
                                                    <div className="body-content m-t-xs">
                                                        {item.sremark}
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    } else if (item.iclassid == 3) {
                                        return (
                                            <li key={index} className="activity creator clearfix">
                                                <VpTooltip title={item.username}>
                                                    <div className="avatar pull-left">
                                                        <img src={logosm} alt="" />
                                                    </div>
                                                </VpTooltip>
                                                <VpTooltip title={item.dcreatetime}>
                                                    <div className="pull-right">{item.dcreatetime}</div>
                                                </VpTooltip>
                                                <div className="avatar-body pull-left">
                                                    <span className="text-muted">{item.username}</span>
                                                    <div className="content m-t-xs">
                                                        <div className="content">
                                                            <p>
                                                                {item.sremark.split('\n').map(function (items,ix) {
                                                                    return (
                                                                        <span key={'mark'+ix}>
                                                                            {items}
                                                                            <br />
                                                                        </span>
                                                                    )
                                                                })}
                                                            </p>
                                                            {
                                                                item.fileList.map((item, index) => {
                                                                    return (
                                                                        !(item.entityid&&item.instanceid>0) ? null :
                                                                        <div key={'file' + index}>{item.sname}<span className="userfile text-info" onClick={() => this.downLoad(item.ifileid)}>   下载</span></div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    } else {
                                        return (
                                            <li key={index} className="activity creator clearfix">
                                                <VpTooltip title={item.username}>
                                                    <div className="avatar pull-left">
                                                        <img src={logosm} alt="" />
                                                    </div>
                                                </VpTooltip>
                                                <VpTooltip title={item.dcreatetime}>
                                                    <div className="pull-right">{item.dcreatetime}</div>
                                                </VpTooltip>
                                                <div className="avatar-body pull-left">
                                                    <span className="text-muted">{item.username}</span>
                                                    <div className="content m-t-xs">
                                                        <p>
                                                            {item.sremark.split('\n').map(function (items,inx) {
                                                                return (
                                                                    <span key={'sremark'+inx}>
                                                                        {items}
                                                                        <br />
                                                                    </span>
                                                                )
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    }

                                })
                            }
                        </div>
                    </ul>
                </div>
				</div>
                <div className="member-involve-footer footFixed" style={{ height: 'auto' }}>
                    <div className="text-right m-tb-xs">
                        <VpRadioGroup onChange={this.onRadioChange} value={this.state.radioChangeValue}>
                            <VpRadio key="a" value="0">全部</VpRadio>
                            {
                                (vp.config.vpplat == undefined || vp.config.vpplat.discussProgress == undefined || 
                                    (","+vp.config.vpplat.discussProgress+",").indexOf(","+this.props.entityid+",") != -1) ?
                                    <VpRadio key="d" value="4">仅进展</VpRadio>
                                    :
                                    null
                            }                            
                            <VpRadio key="c" value="2">仅评论</VpRadio>
                            <VpRadio key="e" value="1">仅系统</VpRadio>
                            <VpRadio key="b" value="3">仅附件</VpRadio>
                        </VpRadioGroup>
                    </div>
                    {/* <VpInput id='remark' onPressEnter={this.onPressEnter} type="textarea" placeholder={"@提及他人，" + this.textareaPlaceholder} rows={4} /> */}
                    {
                        this.props.entityrole ?
                        <div className="mention">
                            <VpMention 
                                className="remark"
                                url={'/{vpplat}/vfrm/entity/userlist'}
                                insertTpl="${atwho-at}${name}"
                                params={this.state.params}
                                value={this.state.value}
                                onChange={this.onMentionChange}
                                onSubmit={this.ctrlenter}
                                placeholder="输入@，提及某人"
                            />
                        </div>
                        :
                        null
                    }
                    
                    <div className="accessory m-tb-sm clearfix">
                        {
                            this.state.radioChangeValue == 2 ?
                                '' : this.props.entityrole ?
                                    <VpTooltip title="添加附件" placement="topLeft">
                                        <VpIconFont onClick={this.addfile} type="vpicon-fujian" className="cursor" />
                                    </VpTooltip>
                                    : ''
                        }
                        {
                            this.state.isSend ? "" :
                                <VpModal
                                    title="选择附件"
                                    visible={this.state.upload}
                                    onOk={this.handleFileModal}
                                    onCancel={this.handleFileCancel}
                                    footer={null}
                                    width={'70%'}
                                    height={'80%'}
                                    wrapClassName='modal-no-footer dynamic-modal'>
                                    <VpUploader
                                        server="/zuul/{vpplat}/file/uploadfile"
                                        onUploadAccept={this.onUploadAccept}
                                    />
                                </VpModal>
                        }
                        {
                            this.props.entityrole ?
                                <VpButton loading={this.state.loading} type="primary" onClick={this.btnClick} className="pull-right">
                                    发布
                        </VpButton>
                                : ''
                        }

                    </div>
                </div>
                <VpModal
                    title="人员选择"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width={'70%'}
					height={'80%'}
                    wrapClassName='modal-no-footer dynamic-modal'>
                    <Choosen
                        item={{ irelationentityid: 2 }}
                        initValue={[]}
                        params={{}}
                        onCancel={this.handleCancel}
                        onOk={this.submitChoosen}
                    />
                </VpModal>
            </div>
        )
    }
}