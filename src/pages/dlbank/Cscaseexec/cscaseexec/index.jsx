import React from 'react';
import {
    VpRow,
    VpCol,
    VpIcon,
    VpTree,
    VpRadio,
    vpQuery,
    VpFRadio,
    VpRadioGroup,
    vpDownLoad,
    VpSelect,
    VpOption,
    VpIconFont,
} from 'vpreact';
import {
    SeachInput
} from 'vpbusiness';
import Table from "./../vptable";
import './index.less';

export default class implement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxHeight: $(window).height() - 270,
            treeData: [],
            nodeId: '',
            model_code: '',
            visible: false,
            s_visible: false,
            tree_show_caption: '',
            multipleData: [], //多条件搜索数据
            quickvalue: '', //快速搜索内容
            radioValue: 1,
            entityid: this.props.routeParams.entityid,
            waitParam: true,
            span1: 4,
            span2: 20,
            display: 'none',
            personchildren: '',
        }
        this.handlesearch = this.handlesearch.bind(this);
        this.handleVisibleChange = this.handleVisibleChange.bind(this);
    }
    componentWillMount() {
        this.getTreeData();
        this.selectStatus();
    }

    componentDidMount() {
        this.setState({
            visible: false
        })
    }

    handleCancel = () => { }
    handleOk = (value) => {
        value[this.state.field_name] = this.state.data;
    }


    handleChange = (value) => {
        let values = '';
        values += `${value}` + ','
        //console.log( values);
        //console.log( `selected ${value}`);
        this.setState({
            selectvalues: values.slice(0, -1)
        })

    }
    handlePersonChange = (value) => {
        let values = '';
        values += `${value}` + ','
        //console.log( values);
        //console.log( `selected ${value}`);
        this.setState({
            selectPersonvalues: values.slice(0, -1)
        })

    }

    selectStatus = () => {
        let children1 = [];

        vpQuery('/{vpplat}/csCaseExec/selectStatus').then((response) => {
            //console.log("67867867867"+response.data.resultList);
            response.data.resultList.map((item, index) => {
                children1.push(<VpOption key={item.iid}>{item.sname}</VpOption>);
            });
            this.setState({ children: children1 });
        })

    }
    selectPerson = () => {
        let children1 = [];

        vpQuery('/{vpplat}/csCaseExec/selectPerson', { zxbz: this.state.radioValue, nodeId: this.state.nodeId, model_code: this.state.model_code, selectvalues: this.state.selectvalues }).then((response) => {
            console.log("67867867867", response.data.resultList);
            response.data.resultList.map((item, index) => {
                children1.push(<VpOption key={item.iassigntoval}>{item.iassignto_label}</VpOption>);
            });
            this.setState({ personchildren: children1, selectPersonvalues: '' });
        })

    }


    getTreeData = () => {
        vpQuery('/{vpplat}/vptree/loadstructtree', { data_load: 1, ui_id: 'vpmtasktree' }).then((response) => {
            this.setState({
                treeData: response.data,
                tree_show_caption: response.data[0].tree_show_caption
            })
        })
    }
    // 异步加载数据
    loadData = (node) => {
        if (node.props.async == true) {
            return vpQuery('/{vpplat}/vptree/loadstructtree', { data_load: 1, ui_id: 'vpmtasktree' }).then((response) => {
                this.refs.treeRef.addNewTreeData(node.props.eventKey, response.data);
            })
        }
        return Promise.resolve();
    }

    titleNode = (item) => {
        return (
            <div>
                <VpIcon tid={item.tree_field_id} className="tree-icon" type={item.type || 'file-text text-primary'} />{item.level} {item.name}
                {
                    item.propertys != null ?
                        <span style={{ background: '#2db7f5', margin: '0px 5px', padding: ' 0 3px', color: '#fff' }}>管控点</span>
                        : null
                }
            </div>
        )
    }
    onSelect = (selectedKeys, { selected: bool, selectedNodes, node, event, item }) => {
        this.setState({
            nodeId: node.props.item.tid,
            model_code: node.props.item.model_code,
            waitParam: false,
            selectPersonvalues: '',
            personchildren: ''
        }, () => {
            this.selectPerson();
        })
    }
    handleOk = () => {
        this.refs.treeRef.editTreeData(this.state.selectId, { name: this.state.inputValue })
        this.setState({
            visible: false,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    onChange = (e) => {
        this.setState({
            inputValue: e.target.value
        })
    }
    onChanger = (e) => {
        this.setState({
            radioValue: e.target.value,
            personchildren: '',
            selectPersonvalues: ''
        }, () => {

            this.selectPerson();
        })

    }
    // 搜索框确定事件
    handlesearch(value) {
        this.setState({
            quickvalue: value
        })
    }
    // 多条件搜索
    multipleSearch = (values) => {
        this.setState({
            s_visible: false
        })
    }

    handleVisibleChange() {
        this.setState({
            s_visible: !this.state.s_visible
        });
    }
    // 导出
    export = () => {
        //this.state.entityid='67';
        vpDownLoad("/{vpplat}/vfrm/ent/exportfile", {
            filtervalue: '',
            quickvalue: this.state.quickvalue,
            ientityid: this.state.entityid,
            type: 'expdata'
        })
    };

    packUpTree = () => { // 子组件调用父组件方法
        this.packUp();
    }

    //收起
    packUp = () => {
        if (this.state.span1 == 4) {
            this.setState({ span1: 0, span2: 24, display: 'block' })
        }
    }

    //展开
    spreadOut = () => {
        this.setState({ span1: 4, span2: 20, display: 'none' })
    }

    render() {
        return (
            <div className="full-height guo_vtmcaseHeader">
                <VpRow gutter={6} className="full-height">
                    <VpCol span={4} span={this.state.span1} className="full-height">
                        <div className="full-height bg-white p-sm">
                            <h4 className="p-b-sm fw b-b">{this.state.tree_show_caption}</h4>
                            <div style={{ height: '94%' }}>
                                <div className="full-height">
                                    <VpTree
                                        ref="treeRef"
                                        treeData={this.state.treeData}
                                        loadData={this.loadData}
                                        defaultExpandAll
                                        titleNode={this.titleNode}
                                        onSelect={this.onSelect}
                                        treeKey="tree_field_id"
                                        draggable={true}
                                        hasSearch
                                        packUp={() => this.packUp()}
                                    />
                                    <div className="cursor text-center" onClick={() => this.packUpTree()}><VpIconFont
                                        type="vpicon-navclose" /></div>
                                </div>
                            </div>
                        </div>
                    </VpCol>

                    <VpCol style={{ paddingLeft: '9px' }} span={this.state.span2} className="full-height">
                        <div className="shrink cursor text-center"
                            onClick={() => this.spreadOut()}
                            style={{ display: this.state.display }}
                        >
                            <VpIconFont type="vpicon-navopen" />
                        </div>
                        <div className="p-sm bg-white case-box-c2 full-height pr">
                            <div className="PointerList b-b bg-white">
                                <VpRow gutter={20}>
                                    <VpCol className="gutter-left" span={5} style={{ paddingTop: "2px" }}>
                                        <SeachInput onSearch={this.handlesearch} />
                                    </VpCol>
                                    <VpCol span={19}>
                                        <VpFRadio>
                                            <VpRadioGroup onChange={this.onChanger} defaultValue="1">
                                                <VpRadio key="a" value='1'>我的</VpRadio>
                                                <VpRadio key="f" value='5'>全部</VpRadio>
                                            </VpRadioGroup>
                                            <VpSelect multiple style={{ width: '100px' }}
                                                placeholder="请选择人员"
                                                searchPlaceholder="标签模式"
                                                onChange={this.handlePersonChange} >
                                                {this.state.personchildren}
                                            </VpSelect>
                                            <VpSelect multiple style={{ width: '400px', paddingLeft: "6px" }}
                                                placeholder="请选择执行结果"
                                                searchPlaceholder="标签模式"
                                                onChange={this.handleChange} >
                                                {this.state.children}
                                            </VpSelect>
                                        </VpFRadio>
                                    </VpCol>
                                </VpRow>
                            </div>
                            <div className="full-height " style={{ paddingBottom: 70 }}>
                                <Table
                                    waitParam={this.state.waitParam}
                                    nodeId={this.state.nodeId}
                                    model_code={this.state.model_code}
                                    radioValue={this.state.radioValue}
                                    quickvalue={this.state.quickvalue}
                                    maxHeight={this.state.maxHeight}
                                    entityid={this.state.entityid}
                                    selectvalues={this.state.selectvalues}
                                    selectPersonvalues={this.state.selectPersonvalues}
                                />
                            </div>
                        </div>
                    </VpCol>
                </VpRow>
            </div>
        );
    }
}