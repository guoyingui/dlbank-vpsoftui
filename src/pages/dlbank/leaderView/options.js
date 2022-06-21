export const options1 = () => {
    return {
        color: ['#45B3F2', '#FD983C', '#618BF8', '#27CAC9', '#FC6179', '#46CE40'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
        },
        legend: {
            data: []
        },
        grid: {
            top: '3%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['部门1', '部门2', '部门3', '部门4', '部门5', '部门6', '部门7']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: '开发部',
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [320, 302, 301, 334, 390, 330, 320]
        }, {
            name: '研发部',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 40,
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
        }]
    }
}
export function options2 ()  {
    return {
        color: ['#45B3F2', '#FD983C', '#618BF8', '#27CAC9', '#FC6179', '#46CE40'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: []
        },
        grid: {
            top: '3%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['部门1', '部门2', '部门3', '部门4', '部门5', '部门6', '部门7']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            barMaxWidth: 40,
            label: {
                show: true
            },
        }]
    }
}