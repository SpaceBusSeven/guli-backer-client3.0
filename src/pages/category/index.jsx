import React,{Component} from 'react'
import {Card, Button, Table, Icon, message, Modal} from "antd";
import LinkButton from '../../components/link-button'
import {reqCategorys, reqCategoryUpdate, reqCategoryAdd} from "../../api";
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component{

  state = {
    categorys: [],
    subCategorys:[],
    showModal: 0,
    parentName: '',
    parentId: '0',
    loading: false
  }

  initColumns = () => {
    this.columns = [
      {
        title:'分类的名称',
        dataIndex:'name'
      },{
        title:'操作',
        render:category => (
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {
              <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton>
            }
          </span>
        )
      }
    ]
  }
  getCategorys = async (parentId) => {
    this.setState({ loading:true })
    parentId = parentId || this.state.parentId
    const result = await reqCategorys(parentId)
    this.setState({ loading:false })
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.setState({ categorys })
      } else {
        this.setState({ subCategorys: categorys})
      }
    } else {
      message.error('get categorys error:'+result.msg)
    }
  }
  showCategorys = () => {
    this.setState({
      subCategorys:[],
      showModal: 0,
      parentName: '',
      parentId: '0',
    })
  }
  showSubCategorys = (category) => {
    this.category = category
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => this.getCategorys())

  }
  showAdd = () => {
    this.setState({ showModal:1 })
  }
  showUpdate = (category) => {
    this.category = category
    this.setState({ showModal:2 })
  }
  hideModal = () => {
    this.setState({ showModal: 0 })
    this.form.resetFields()
  }
  addCategory = async () => {
    const {categoryName, parentId} = this.form.getFieldsValue()
    this.hideModal()
    const result = await reqCategoryAdd(parentId, categoryName)
    if (result.status === 0) {
      message.success('save category success')
      if (parentId === this.state.parentId) {
        this.getCategorys()
      } else if (parentId === '0') {
        this.getCategorys('0')
      }
    } else {
      message.error('save category failed')
    }
  }
  updateCategory = async () => {
    const {categoryName} = this.form.getFieldsValue()
    const categoryId = this.category._id
    this.hideModal()
    const result = await reqCategoryUpdate(categoryId, categoryName)
    if (result.status === 0) {
      message.success('save category success')
      this.getCategorys()
    } else {
      message.error('save category failed')
    }
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getCategorys('0')
  }

  render() {
    const {parentId, parentName, categorys, loading, showModal, subCategorys} = this.state
    const title = parentId === '0'? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>&nbsp;&nbsp;
        <Icon type='arrow-right'></Icon>&nbsp;&nbsp;
        <span>{parentName}</span>
      </span>
    )
    const extra = <Button type='primary' onClick={this.showAdd}>
      <Icon type='plus'></Icon>添加
    </Button>

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          columns={this.columns}
          dataSource={parentName ? subCategorys : categorys}
          pagination={{defaultPageSize: 5, showQuickJumper:true}}
        ></Table>
        <Modal
          title='添加分类'
          visible={showModal === 1}
          onOk={this.addCategory}
          onCancel={this.hideModal}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={form => this.form = form}
          ></AddForm>
        </Modal>
        <Modal
          title='修改分类'
          visible={showModal === 2}
          onOk={this.updateCategory}
          onCancel={this.hideModal}
        >
          <UpdateForm
            category={this.category}
            setForm={form => this.form = form}
          ></UpdateForm>
        </Modal>
      </Card>
    )
  }
}
