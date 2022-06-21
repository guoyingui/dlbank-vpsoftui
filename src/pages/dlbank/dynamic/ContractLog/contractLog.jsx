
import React, { Component } from 'react';
import {
    VpTable,
    VpCol,
    VpRow,
    VpTooltip,
    VpIcon

} from 'vpreact';
import { RightBox } from 'vpbusiness'
import ContractLogDetail from './ContractLogDetail.jsx';

export default class contractLog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            clickId: ''

        }
        this.getTableDataUrl = '{vppm}/interfExcept/getPageExceptLog'
        this.onRowClick = this.onRowClick.bind(this);  //需要传
    }


    componentDidMount() {

    }


    onRowClick(record, index) {
        this.setState({
            showRightBox: true,
            clickId: record.id
        })
    }

    closeRightModal() {
        debugger
        let that = this 
        that.setState({
            showRightBox: false
        })
    }

    addNewDom() {
        return (
            <ContractLogDetail clickId={this.state.clickId} />
        );

    }


    //渲染完table之后的回调函数
    renderTable = (pages, res) => {
        let tHeight = vp.computedHeight(res.length, ".contractLog");
        if (res.length > 0) {
            this.setState({
                maxHeight: tHeight
            })
        }
    }



    render() {
        const columns = [
            { title: '创建日期', dataIndex: 'cratetime', key: 'cratetime', auto: true },
            { title: '成功日志数', dataIndex: 'successcount', key: 'successcount', auto: true },
            { title: '失败日志数', dataIndex: 'failedcount', key: 'failedcount', auto: true }
        ];


        return (
            <div>
                <div className="business-wrapper p-t-sm full-height">
                    <div className="bg-white p-sm full-height entity-bsreqlist">
                        <VpRow gutter={16} className="full-height">
                            <VpCol className="full-height scroll-y" id="table">
                                <VpTable
                                    resize
                                    queryMethod='POST'
                                    className="contractLog"
                                    ref={(dom) => { this.table = dom }}
                                    bindThis={this}
                                    controlAddButton={this.renderTable}
                                    params={{
                                    }}
                                    columns={columns}
                                    dataUrl={this.getTableDataUrl}
                                    onRowClick={this.onRowClick}
                                />
                            </VpCol>
                        </VpRow>
                    </div>
                </div>
                <div>
                    <RightBox
                        max={true}
                        button={
                            <div className="icon p-xs" onClick={() => this.closeRightModal()}>
                                <VpTooltip placement="top" title=''>
                                    <VpIcon type="rollback" />
                                </VpTooltip>
                            </div>}
                        className={"srcbhastitle"}
                        show={this.state.showRightBox}>
                        {this.state.showRightBox ? this.addNewDom() : null}
                    </RightBox>
                </div>
            </div>


        );
    }
};