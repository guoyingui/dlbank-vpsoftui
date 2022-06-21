import React from 'react';
import { VpFormCreate, VpForm, VpFInput, VpButton, VpFCheckbox,VpFDatePicker } from 'vpreact';

class Demo extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.form.validateFields(['startday'], (errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            } else {
                this.props.onOk(values)
            }

        });
    }
    render() {
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <VpForm horizontal onSubmit={this.handleSubmit}>
                <div className="clearfix">
                    <VpFDatePicker {...formItemLayout} label=" 周报日期"
                        {...getFieldProps('startday', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '周报日期不能为空!'
                                },
                            ],
                        })}
                    />
                    
                </div>
                <div className="footer-button-wrap ant-modal-footer" style={{ position: 'absolute' }}>
                        <VpButton style={{marginTop: 2}} type="primary" htmlType="submit">导出</VpButton>
                        
                </div>
            </VpForm>
        )
    }
}
export default Demo = VpFormCreate(Demo);