import React, { Component } from 'react'
import { throttle } from '../../../../script/utils'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
class BarEChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: '100%',
            height: 'calc(100% - 40px)'
        };
        this.charts = null;
    }
    async componentDidMount() {
        // 初始化图表
        await this.initChart(this.el);
        // 将传入的配置(包含数据)注入
        this.setOption(this.props.option);
        // 监听屏幕缩放，重新绘制 echart 图表
        window.addEventListener('resize', throttle(this.resize, 200, 300));
    }
    componentDidUpdate() {
        // 更新图表
        this.setOption(this.props.option);
    }
    componentWillUnmount() {
        // 组件卸载时，移除监听器
        this.charts = null
    }
    render() {
        const { width, height } = this.state;
        return (
            <div ref={el => (this.el = el)} style={{width, height}} className="gutter-example"></div>
        )
    }
    initChart = (el) => {
        // 基于准备好的dom，初始化echarts实例
        this.charts = echarts.init(el);
    }
    setOption = (option) => {
        if (!this.charts) return;
        // 绘制图表
        this.charts.setOption(option);
    }
    resize = () => {
        this.charts && this.charts.resize();
    }
}
export default BarEChart;