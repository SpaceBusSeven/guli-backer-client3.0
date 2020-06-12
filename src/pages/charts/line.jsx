import React,{Component} from 'react'
import ReactEcharts from 'echarts-for-react'
import {Card, Button} from "antd";

export default class Line extends Component{

  state = {
    sales:[5, 20, 36, 10, 10, 20],
    inventorys: [6, 10, 25, 20, 15, 10]
  }

  getOptions = () => {
    const {sales, inventorys} = this.state
    return {
      title: {
        text: '折线图一'
      },
      tooltip: {},
      legend: {
        data:['销量','库存']
      },
      xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'line',
        data: sales
      }, {
        name: '库存',
        type: 'line',
        data: inventorys
      }]
    }
  }

  getOptions2 = () => {
    return {
      title: {
        text: '折线图二'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        areaStyle: {}
      }]
    }
  }


  render() {
    return (
      <div>
        <Card><Button type='primary' onClick={this.update}>更新</Button></Card>
        <Card>
          <ReactEcharts option={this.getOptions()}></ReactEcharts>
        </Card>
        <Card>
          <ReactEcharts option={this.getOptions2()}></ReactEcharts>
        </Card>
      </div>
    )
  }
}
