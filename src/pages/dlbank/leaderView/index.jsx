import React, { Component } from "react";
import { VpTable, VpProgress, VpRow, VpCol, VpCard } from "vpreact";
import { options1, options2 } from './options'
import BarEchart from './component/BarEChart'   // 引入 BarEChart 组件
import { Table } from 'antd'
import './index.less'
export default class LeaderView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            opt1: {},
            opt2: {}
        }
    }
    componentDidMount() {
        this.setState({
            opt1: options1(),
            opt2: options2()
        })
    }
    render() {
        const { opt1, opt2 } = this.state;
        const columns = [
            { title: '年度', dataIndex: 'age', key: 'age' },
            { title: '未发起', dataIndex: 'phone', key: 'phone', render: (text) => <a href="javascript:void(0)">{text}</a>},
            { title: '立项中', dataIndex: 'address', key: 'address', render: (text) => <a href="javascript:void(0)">{text}</a>},
            { title: '采购中', dataIndex: 'address1', key: 'address1', render: (text) => <a href="javascript:void(0)">{text}</a>},
            { title: '合同中', dataIndex: 'address2', key: 'address2', render: (text) => <a href="javascript:void(0)">{text}</a>},
            { title: '执行中', dataIndex: 'address3', key: 'address3', render: (text) => <a href="javascript:void(0)">{text}</a>},
            { title: '完成', dataIndex: 'address4', key: 'address4', render: (text) => <a href="javascript:void(0)">{text}</a>},
            { title: '取消', dataIndex: 'address5', key: 'address5', render: (text) => <a href="javascript:void(0)">{text}</a>},
        ];
        const data = [
            { key: '1', age: 2021, phone: 18, address: 45, address1: 32, address2: 6, address3: 8, address4: 8, address5: 2 },
            { key: '2', age: 2022, phone: 23, address: 23, address1: 64, address2: 2, address3: 8, address4: 5, address5: 1 },
        ];
        return (
            <div className="gutter-example">
                <VpRow gutter={10}>
                    <VpCol className="gutter-row" span={10}>
                        <div className="gutter-box body_top">
                            <h4 className="card-title">预算执行统计</h4>
                            <VpRow className="container_body" gutter={10}>
                                <VpRow span={24}>
                                    <VpCard title="费用性" bordered={false}>
                                        <VpProgress percent={70} status="active" />
                                        <VpRow gutter={10}>
                                            <VpCol span={12}>
                                                <div className="bt_title">
                                                    1000<br/>
                                                    统计预算总额
                                                </div>
                                            </VpCol>
                                            <VpCol span={12}>
                                                <div className="bt_title">
                                                    700<br/>
                                                    执行情况
                                                </div>
                                            </VpCol>
                                        </VpRow>
                                    </VpCard>
                                </VpRow>
                                <VpRow span={24}>
                                    <VpCard title="资本性" bordered={false}>
                                        <VpProgress percent={50} status="active" />
                                        <VpRow gutter={10}>
                                            <VpCol span={12}>
                                                <div className="bt_title">
                                                    2000<br/>
                                                    统计预算总额
                                                </div>
                                            </VpCol>
                                            <VpCol span={12}>
                                                <div className="bt_title">
                                                    1000<br/>
                                                    执行情况
                                                </div>
                                            </VpCol>
                                        </VpRow>
                                    </VpCard>
                                </VpRow>
                            </VpRow>
                        </div>
                    </VpCol>
                    <VpCol className="gutter-row" span={14}>
                        <div className="gutter-box body_top">
                            <h4 className="card-title">预算状态统计</h4>
                            <Table
                                columns={columns}
                                dataSource={data}
                                pagination={false}
                            />
                        </div>
                    </VpCol>
                </VpRow>
                <VpRow gutter={10}>
                    <VpCol className="gutter-row" span={10}>
                        <div className="gutter-box body_bottom">
                            <h4 className="card-title">信息部门预算执行详情情况</h4>
                            <BarEchart option={opt1} />
                        </div>
                    </VpCol>
                    <VpCol className="gutter-row" span={14}>
                        <div className="gutter-box body_bottom">
                            <h4 className="card-title">业务部门预算执行详情情况</h4>
                            <BarEchart option={opt2} />
                        </div>
                    </VpCol>
                </VpRow>
            </div>
        )
    }
}
