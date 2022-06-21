
import React, { Component } from 'react';
import {
    VpTable,
    VpCol,
    VpRow,

} from 'vpreact';

export default class contractLog extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.getTableDataUrl = '{vppm}/interfExcept/getPageExceptLogDetail'
    }


    componentDidMount() {

    }


    onRowClick(record, index) {
        this.setState({
            showRightBox: true,
            clickPjInfo: record
        })
    }

    closeRightModal() {
        this.setState({
            showRightBox: false
        })
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
            { title: '日志信息', dataIndex: 'message', key: 'message', width:500 },
            { title: '日志类别', dataIndex: 'category', key: 'category' },
            { title: '创建时间', dataIndex: 'cratetime', key: 'cratetime' }
        ];


        return (
            <div className="business-wrapper p-t-sm full-height">
                <div className="bg-white p-sm full-height entity-bsreqlist">
                    <VpRow gutter={16} className="full-height">
                        <VpCol className="full-height scroll-y" id="tables">
                            <VpTable
                                resize
                                queryMethod='POST'
                                className="contractLogDetail"
                                ref={(dom) => { this.table = dom }}
                                bindThis={this}
                                controlAddButton={this.renderTable}
                                params={{
                                    id : this.props.clickId
                                }}
                                columns={columns}
                                dataUrl={this.getTableDataUrl}
                            />
                        </VpCol>
                    </VpRow>
                </div>
            </div>
        );
    }
};