import React,{Component} from 'react'
import ReactEcharts from 'echarts-for-react'
import {Card, Button} from "antd";

export default class Bar extends Component{

  state = {
    sales:[5, 20, 36, 10, 10, 20],
    inventorys: [6, 10, 25, 20, 15, 10]
  }

  getOptions = () => {
    const {sales, inventorys} = this.state
    return {
      title: {
        text: '柱状图'
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
        type: 'bar',
        data: sales
      }, {
          name: '库存',
          type: 'bar',
          data: inventorys
        }]
    }
  }

  update = () => {
    const sales = this.state.sales.map(sale => sale + 1)
    const inventorys = this.state.inventorys.map(inventory => inventory - 1)
    this.setState({ sales, inventorys })
  }

  render() {
    return (
      <div>
        <Card><Button type='primary' onClick={this.update}>更新</Button></Card>
        <Card>
          <ReactEcharts option={this.getOptions()}></ReactEcharts>
        </Card>
      </div>
    )
  }
}
