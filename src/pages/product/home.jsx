import React,{Component} from 'react'
import {Button, Card, Icon, Select, Input, Table, message} from "antd";
import LinkButton from "../../components/link-button";
import {reqProductSearch, reqProducts, reqProductUpdateStatus} from "../../api";
import {PAGE_SIZE} from "../../config/constants";

const {Option} = Select

export default class Home extends Component{

  state = {
    loading: false,
    products:[],
    productName:'',
    productType:'productName',
    total: 0
  }
  initColumns = () => {
    this.columns = [
      {
        title:'商品名称',
        dataIndex:'name'
      },{
        title:'商品描述',
        dataIndex:'desc'
      },{
        title:'价格',
        dataIndex:'price',
        render: price => <span>￥{price}</span>
      },{
        title:'状态',
        width: 100,
        dataIndex:'status',
        render: (status, product) => {
          const btnText = status === 1?'下架':'上架'
          const text = status === 1?'已上架':'已下架'
          status = status === 1?2:1
          return (
            <span>
              <Button type='primary' onClick={() => this.updateStatus(status, product._id)}>{btnText}</Button>
              <span>{text}</span>
            </span>
          )
        }
      },{
        title:'操作',
        width: 100,
        render:product => (
          <span>
            <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
          </span>
        )
      }
    ]
  }
  updateStatus = async (status, productId) => {
    const result = await reqProductUpdateStatus(productId, status)
    if (result.status === 0) {
      this.getProducts(this.pageNum)
    }
  }
  getProducts = async (pageNum) => {
    this.setState({ loading: true })
    this.pageNum = pageNum

    const {productName, productType} = this.state
    let result
    if (!productName) {
      result = await reqProducts(pageNum, PAGE_SIZE)
    } else {
      result = await reqProductSearch({pageNum, pageSize:PAGE_SIZE, productType, productName})
    }
    this.setState({ loading:false })
    if (result.status === 0) {
      const {list, total} = result.data
      this.setState({ products:list, total })
    } else {
      message.error('get products failed')
    }
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getProducts(1)
  }

  render() {
    const {loading, products, productName, productType, total} = this.state
    const title = (
      <span>
        <Select
          value={productType}
          style={{width: 150}}
          onChange={value => this.setState({productType:value})}>
          <Option value='productName' key='productName'>按名称搜索</Option>
          <Option value='searchDesc' key='searchDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={productName}
          onChange={event => this.setState({ productName: event.target.value })}
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )
    const extra = <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
      <Icon type='plus'></Icon>添加商品
    </Button>

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          columns={this.columns}
          dataSource={products}
          pagination={{
            current: this.pageNum,
            defaultPageSize: PAGE_SIZE,
            total,
            onChange: this.getProducts,
            showQuickJumper:true
          }}
        ></Table>
      </Card>
    )
  }
}
