import React from "react";
import {
    VpButton,
    VpTooltip,
    VpIconFont,
    VpInput,
    VpCheckbox,
    VpModal,
    VpRangePicker,
    VpMsgError,
    VpPopconfirm,
    vpQuery,
    VpTabs,
    VpTabPane,
    vpAdd,
} from 'vpreact';
import { RightBox} from "vpbusiness";
import { requireFile } from "utils/utils";
import "./task.less";



const DynamicTabs = requireFile('vfm/DynamicTabs/dynamictabs');
//import DynamicTabs from '../DynamicTabs/dynamictabs';
//前端日期格式转换
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}


export default class subTask extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dataPicker: {},
            editSubtask: {},
            addSubtask: false,
            checked: true,
            titleInput: {},
            checkboxAllValue: {},
            valueList:{},
            eventmap:{},
            subtask_list: [],
            url: "vfm/ChooseEntity/ChooseEntity",
            choosenitem:{sname:'待分配',iid:''},
            group_type:this.props.group_type
        };
        this.coum = 0;
        this.stateText = ["text-primary", "text-success","text-danger"];
        this._value_list = [];
    }

    componentWillMount(){
       this.mounted = true;
       this.getSubTaskList()
    }
    componentDidMount(){
        if(this.props.group_type!=3){
            $(".subtask").removeClass("b-t");
        }
    }
    componentWillUnmount(){
        this.mounted = false;
    }

    getSubTaskList = () =>{
        let param = {
            entityid:this.props.entityid,
            iid:this.props.iid
        }
        vpQuery('/{vpplat}/vfrm/tasks/subTaskList',{
            param:JSON.stringify(param)
        }).then((response)=>{
            if(this.mounted){
                this.setState({
                    subtask_list:response.data
                })
            }
        })
    }

    addSubtask = () => {
        this.setState({ addSubtask: true });
    }
    inputChange = (e,id) => {
        this.state.titleInput[id] = e.target.value
    }
    editSubtaskOkCanel = (e, id) => {
        if (id || id == 0) {
            let title = this.state.titleInput[id];
            vpAdd('/{vpplat}/vfrm/tasks/updateSubTask',{
                title,
                entityid:this.props.entityid,
                iid:id
            }).then((response)=>{
                this.getSubTaskList()
            })
        }
        this.setState({ editSubtask: {[id]: false} });
    }
    showModal = (e, id) => {
        let Content = requireFile(this.state.url);
        this.modalContent = <Content initValue={[]} item={{ irelationentityid: 2 ,widget_type:'selectmodel'}} onOk={this.handleOk} onCancel={this.handleCancel} />;
        this.setState({ visible:true ,clicktaskid:id});
    }
    handleOk = (selectitem) => {
        if(this.state.clicktaskid == ''){
            this.setState({ visible: false,choosenitem:selectitem[0] });
        }else{
            let param = {
                iid:this.state.clicktaskid,
                entityid:this.props.entityid,
                userid:selectitem[0].iid
            }
            vpAdd('/{vpplat}/vfrm/tasks/updatePrincipal',{
                param:JSON.stringify(param)
            }).then((response)=>{
                this.setState({ visible: false});
                this.getSubTaskList()
            })
        }
        
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    detailsRightBox = (e,item) => {
        this.setState({ details_rightBox: true ,taskid:item.id});
    }
    editSubtask = (e,id) => {
        this.setState({ editSubtask: { [id]: true } });
    }
    dataPickerChange = (value, datastring, id) => {
        this.state.dataPicker[id] = datastring[0] + " / " + datastring[1]
        this.setState({ dataPicker: this.state.dataPicker });
    }
    addDatePicker = (value, datastring) => {
        this.setState({ addDataPicker: datastring[0] + " / " + datastring[1] });
    }
    addInputChange = (e) => {
        this.addInputValue = e.target.value;
    }
    addSubtaskOk = () => {
        const _this = this
        if (_this.addInputValue) {
            let datelist = `${_this.state.addDataPicker}`.split(' / ');
            let entityid = _this.props.entityid;
            let dstartdate =_this.state.addDataPicker == undefined? new Date().Format("yyyy-MM-dd") : datelist[0];
            let denddate = _this.state.addDataPicker == undefined? new Date().Format("yyyy-MM-dd") :datelist[1];
            let iid = _this.coum;
            let scode = '';
            let sname = _this.addInputValue;
            let iassignto = _this.state.choosenitem.iid;
            let iclassid = this.props.iclassid
            let param = {
                iid,scode,iclassid,sname,dstartdate,denddate,iassignto
            }
            vpAdd('/{vpplat}/dlbank/tasks/saveSubTask', {
                param: JSON.stringify(param),
                entityid, 
                iparent:this.props.iid
            }).then((response)=> {
                _this.getSubTaskList()
                _this.coum--;
                _this.state.addDataPicker = "";
                _this.setState({ addSubtask: false });
            })
        }else {
            VpMsgError("请输入任务名称！");
        }
    }
    addSubtaskCanel = () => {
        this.setState({ addSubtask: false });
    }
    closeModal = () => {
        this.setState({ details_rightBox: false });
    }
    checkboxAll = (value) => {
        if (value[0]) {
            this.state.subtask_list.map((item,index)=>{
                this._value_list.push(item.id);
            })
            this.setState({ valueList: { value: this._value_list } });
        }else {
            this._value_list = [];
            this.setState({ valueList: { value:[]} });
        }
    }
    checkBoxChange = (e,id) => {
        if (this._value_list.length > 0) {
            if (this._value_list.indexOf(id) === -1) {
                this._value_list.push(id);
            }else {
                for (let index = 0; index < this._value_list.length; index++) {
                    if (this._value_list[index] == id) {
                        this._value_list.splice(index, 1);
                    }
                }
            }
        }else {
            this._value_list.push(id);
        }
        this.setState({
            valueList: { value: this._value_list }
        });
    }
    confirm = () => {
        const _this = this
        let _list = [];
        vpAdd('/{vpplat}/vfrm/tasks/deleteSubTask',{
            idlist:JSON.stringify(_this._value_list),
            entityid:this.props.entityid,
            iparent:this.props.iid
        }).then((response)=>{
            if (_this._value_list.length < _this.state.subtask_list.length) {
                _this.state.subtask_list.map((item, index) => {
                    if (_this._value_list.indexOf(item.id) != -1) {
                        _this.state.subtask_list.splice(index, 1);
                        _this._value_list = _this._value_list.filter((sss)=>{
                                return sss!=item.id
                        })
                    }
                });
            }else {
                _this.state.subtask_list = [];
                _this._value_list = [];
            }
            _this.setState({ subtask_list: _this.state.subtask_list });
        })
    }
    cancel = () => {
        console.log('点击了取消');
    }
    addnewdom=()=>{
        return (
                    <DynamicTabs
                            param={{
                                    entityid: this.props.entityid,
                                    iid: this.state.taskid,
                                    type: false,
                                    viewtype: '',
                                    entitytype: this.state.entitytype,
                                    defaultActiveKey: ''
                                    }}
                            data={{

                            }}
                            closeRightModal={() => this.closeModal()}
                            refreshList={() => {this.getSubTaskList()}}
                        />
        )
    }
    render() {
        return (
            <div className="full-height scroll-y p-r-xs">
                <div  className="subtask b-t p-sm">
                    <div className="subtask-title text-muted p-tb-xs">
                        <VpIconFont type="vpicon-navlist" />
                        <span className="inline-display m-l-sm">子任务·{this._value_list.length}/{this.state.subtask_list.length}</span>
                        <span className="inline-display m-l-sm">
                            {/* <VpCheckbox className="inline-display" onChange={this.checkboxAll} options={[{ value: "all" }]} /> */}
                            <VpTooltip title="删除">
                                <VpPopconfirm title="确定要删除这个任务吗？" onConfirm={this.confirm} onCancel={this.cancel}>
                                    <VpIconFont type="vpicon-shanchu" />
                                </VpPopconfirm>
                            </VpTooltip>
                        </span>
                    </div>
                    <div className="subtask-content-list">
                        {
                            this.state.subtask_list.length > 0 ? this.state.subtask_list.map((item,index)=>{
                                return (
                                    <div className="list" key={index}>
                                        <div className="subtask-view p-tb-sm clearfix">
                                            <div className="fl">
                                                <VpCheckbox onChange={(e) => this.checkBoxChange(e, item.id)} options={[{ value: item.id }]} value={this.state.valueList.value} />
                                            </div>
                                            <div className="fl m-l-xs list-title">
                                                {
                                                    this.state.editSubtask[item.id] ?
                                                    <span className="edit-input">
                                                        <VpInput onChange={(e)=>this.inputChange(e,item.id)} defaultValue={item.sname} />
                                                    </span>
                                                    :
                                                    <span className="text" onClick={(e)=>this.editSubtask(e,item.id)}>{item.sname}</span>
                                                }
                                            </div>
                                            <div className="fr">
                                                {
                                                    item.time || this.state.dataPicker[item.id]  ?
                                                    //<span className="calendar-box" data-picker="0">{this.state.dataPicker[item.id] || item.time}</span>
                                                    <VpTooltip title={this.state.dataPicker[item.id] || item.time}>
                                                    <span className="calendar-box">
                                                        <VpRangePicker disabled   className="fl calendar" />
                                                    </span>
                                                    </VpTooltip>
                                                    :
                                                    <span className="calendar-box" data-picker="0">
                                                        <VpRangePicker onChange={(value, datastring) => this.dataPickerChange(value, datastring, item.id)} className="fl calendar" />
                                                    </span>
                                                }
                                                <VpTooltip title="进入详情">
                                                    <VpIconFont className="cursor fr" onClick={(e)=>this.detailsRightBox(e,item)} type="vpicon-arrow-right" />
                                                </VpTooltip>
                                                <VpTooltip title={item.status}>
                                                    {/* <VpIconFont className={this.stateText[item.state.color] + " m-lr-xs cursor fr"} type="vpicon-loading-circle" /> */}
                                                    <VpIconFont className="m-lr-xs cursor fr f18" type="vpicon-loading-circle" />
                                                </VpTooltip>
                                                <VpTooltip title={item.superman||'待分配'}>
                                                    <VpIconFont className="m-l-xs cursor fr f18 text-muted" onClick={(e)=>this.showModal(e,item.id)} type="vpicon-users" />
                                                </VpTooltip>
                                            </div>
                                        </div>
                                        {
                                            this.state.editSubtask[item.id] ?
                                            <div className="text-right save-canel">
                                                <VpButton onClick={(e) => this.editSubtaskOkCanel(e, item.id)} className="m-r-sm" type="primary" >保存</VpButton>
                                                <VpButton type="ghost" onClick={(e) => this.editSubtaskOkCanel(e)}>取消</VpButton>
                                            </div> 
                                            : ''
                                        }
                                    </div>
                                )
                            }) : ''
                        }
                        {
                            this.state.addSubtask ? 
                            <div className="add-subtask-box m-tb-sm">
                                <div className="clearfix">
                                    <VpIconFont className="fl m-t-xs" type="vpicon-plus-circle-o" />
                                    <span className="add-subtask-input fl m-l-sm inline-display">
                                        <VpInput onChange={this.addInputChange} placeholder="请输入子任务内容" />
                                    </span>
                                    <div className="fr p-t-xs">
                                        {
                                            !this.state.addDataPicker ? 
                                            <span className="calendar-box add-calendar-box">
                                                <VpRangePicker onChange={this.addDatePicker} className="fl calendar" />
                                            </span>
                                            : 
                                            <span className="calendar-box add-calendar-box">{this.state.addDataPicker}</span>
                                        }
                                        <VpTooltip title="待办">
                                            {/* <VpIconFont className="text-primary m-lr-xs" type="vpicon-circle" /> */}
                                            <VpIconFont className="m-lr-xs cursor fr f18" type="vpicon-loading-circle" />
                                        </VpTooltip>
                                        <VpTooltip title={this.state.choosenitem.sname}>
                                        <VpIconFont className="m-l-xs cursor fr f18 text-muted" onClick={(e)=>this.showModal(e,'')} type="vpicon-users" />
                                        </VpTooltip>
                                    </div>
                                </div>
                                <div className="text-right m-t-sm">
                                    <VpButton onClick={()=>this.addSubtaskOk()} className="m-r-sm" type="primary" >保存</VpButton>
                                    <VpButton type="ghost" onClick={this.addSubtaskCanel}>取消</VpButton>
                                </div>
                            </div>
                            : ""
                        }
                        <div className="inline-display cursor add-subtask text-primary">
                            <VpIconFont onClick={this.addSubtask} type="vpicon-plus-circle" />
                            <span onClick={this.addSubtask} className="inline-display m-l-xs">添加子任务</span>
                        </div>
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
                    {this.modalContent}
                </VpModal>
                <RightBox 
                onClose={this.closeModal} 
                show={this.state.details_rightBox}>
                {
                   this.state.details_rightBox?
                    this.addnewdom()
                   :'' 
                }
                </RightBox>
            </div>
        )
    }
}