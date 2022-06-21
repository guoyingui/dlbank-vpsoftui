import React, { Component } from 'react';
import {
    VpFormCreate,
} from 'vpreact';
import ContractDetail from './contractDetail';

class contractTrack extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
       
    }
    componentWillMount(){
        let  entityid = this.props.viewtype=='pjtree'?this.props.row_entityid:this.props.entityid
        let  iid = this.props.viewtype=='pjtree'?this.props.row_id:this.props.iid
        this.setState({
            entityid,  iid
        })
        
    }

    render() {
       
        return (
                <ContractDetail
                    skey={this.props.skey}
                    contractid={this.props.iid}                            
                    />
        )
    }
} 


export default contractTrack = VpFormCreate(contractTrack);;
