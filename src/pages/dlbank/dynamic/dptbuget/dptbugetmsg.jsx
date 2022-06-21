import React, { Component } from 'react';
import {EditTableCol,SeachInput,
  QuickCreate,
  FindCheckbox,
  RightBox} from 'vpbusiness';
import { VpMenu,
  VpTable,
  VpConfirm,
  VpSwitch} from "vpreact";
export default class dptbugetmsg extends Component {
    constructor(props) {
        super(props)
        this.state = {
          fields:[],
          chosenHandler:false,
          count:-1,
          iconstraint:'',
          isreadonly:false,
          selectedRowKeys:[],
          iflagArr:[],
          showRightBox:false,

          tabs_array: [],
          isAdd: false,
          iids: '',
          row_id: '',
          row_entityid: '',
          entityiid: '',
          add: true,
          entityid:0,
          defaultActiveKey: '',
          activeKey: '0'  
        }
        this.objectid = -1;
        this.onSelectChange = this.onSelectChange.bind(this);
    }

    componentWillMount(){
        this.setState({
            mainentityid:41,//主实体id（可能不是，具体看配置是1:n还是m:n）
            mainentityiid: this.props.iid,//主实体iid
            irelationid: this.props.irelationid,//关联关系ID
            irelationentity:161,//关联实体的ID
            imainentity: 41,//关系表中主实体ID
            isTab: true,
            stabparam: 'rbusinessreq',
            issubitem: 0
        })


      let iconstraint = this.props.iconstraint;
      if(iconstraint == 2){
        this.setState({isreadonly:true},()=>{
          this.getWorkPlans();
        })
      }else{
        this.getWorkPlans();
      }
    }
    componentDidMount() {
      let field_name = this.props.field_name
      if (window.flowtabs) {
          window.flowtabs[field_name] = this
      }
      if (window.form) {
          window.form[field_name] = this
      }
    }
    componentWillReceiveProps(nextProps) {
    }
   

    //获取关联任务
    getWorkPlans = () =>{
      const _this = this;
 
      let fields = 
      [
        {dataIndex: "dptname",key:"dptname",edit_col: false,datatype: 1,width: 120,widget: {widget_type: "text",widget_name: "dptname"},fixed: "",title: "部门名称"},
        {dataIndex: "createname",key:"createname",edit_col: false,datatype: 1,width: 120,fixed: "",title: "处理人"}, 
        {dataIndex: "sdescription",key:"sdescription",edit_col: false,datatype: 1,width: 120,fixed: "",title: "审批意见"},
        {dataIndex: "dcratedate",key:"dcratedate",edit_col: false,datatype: 1,width: 120,fixed: "",title: "审批时间"}
      ] ;
      _this.setState({fields:fields});
    }

    onSelectChange(selectedRowKeys,selectedRows) {
      if(selectedRowKeys.length > 0) {
          this.setState({
              selectedRowKeys: selectedRowKeys,
              deleteButton: true,
              selectedRows: selectedRows
          });
      }else {
          this.setState({
              selectedRowKeys: selectedRowKeys,
              deleteButton: false,
              selectedRows: selectedRows
          });
      }
    }

// 关闭右侧弹出    
closeRightModal=(entityid, iid, sname)=> {
      this.setState({
          showRightBox: false,
          showRightBox2: false,
          add: false,
          currentclassname: '',
          entityiid: 0,
          row_entityid: 0,
          row_id: 0,
          s_visible: false,
          sname: '',
          tabs_array: []
      })
      this.tableRef.getTableData()
}

render() { 
    let options = []
    let optionsCol = {}
      return (
        <div className="business-container pr full-height">
            <VpTable 
              id="pzk"
              key="pzk"
              columns={this.state.fields}
              dataUrl={'/{vppm}/dlbank/second/dptbugetmsg'}
              params={{
                entityid: this.props.entityid,//主实体ID
                iid: this.props.iid,//主实体iid
                quickvalue: ''
            }}
              bindThis={this}
              pagination={false} 
              tableOptions={options} 
              rowKey='iid'
              ref={table => this.tableRef = table}
              emptyData={true}
              
              />
        </div>
      );        

  }

}
