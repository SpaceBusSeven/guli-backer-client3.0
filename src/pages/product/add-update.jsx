import React,{Component} from 'react'
import {Card, Form, Input, Cascader, Icon, message, Button} from 'antd'
import PictureWall from './picture-wall'
import RichTextEditor from './rich-text-editor'
import {reqCategorys, reqProductAddUpdate} from "../../api";
import LinkButton from "../../components/link-button";

const {Item} = Form
const {TextArea} = Input

class AddUpdate extends Component{

  constructor(props) {
    super(props)
    this.pw = React.createRef()
    this.rte = React.createRef()
    this.state = { options:[] }
  }

  priceValidator = (rule, value, callback) => {
    value = value * 1
    if (value > 0) {
      callback()
    } else {
      callback('price > 0')
    }
  }

  initOptions = async (categorys) => {
    const options = categorys.map(cate => ({
        value: cate._id,
        label: cate.name,
        isLeaf: false
      }))
    //若是更新产品 则需要验证是否有子类
    const {isUpdate, product} = this
    const {pCategoryId} = product

    if (isUpdate && pCategoryId !== '0') {
     const subCategorys = await this.getCategorys(pCategoryId)
      if (subCategorys && subCategorys.length > 0) {
        const subOptions = subCategorys.map(cate => ({
          value: cate._id,
          label: cate.name,
          isLeaf: true
        }))
        const targetOption = options.find(opt => opt.value === pCategoryId)
        targetOption.children = subOptions
      }
    }
    this.setState({options})
  }
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        return this.initOptions(categorys)
      } else {
        return categorys
      }
    } else {
      message.error('get categorys error')
    }
  }
  changeOptions = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false
    if (subCategorys && subCategorys.length > 0) {
      const subOptions = subCategorys.map(cate => ({
        value: cate._id,
        label: cate.name,
        isLeaf: true
      }))
      targetOption.children = subOptions
    } else {
      targetOption.isLeaf = true
    }
    this.setState({...this.state.options})
  }
  submit = () => {
    this.props.form.validateFields( async (error, values) => {
      const {name, desc, price, categoryIds} = values
      const imgs = this.pw.current.getImgs()
      const detail = this.rte.current.getDetail()

      let pCategoryId = '0'
      let categoryId = ''
      if (categoryIds.length > 1) {
        pCategoryId = categoryIds[0]
        categoryId = categoryIds[1]
      } else {
        categoryId = categoryIds[0]
      }
      const product = {name, desc, price, pCategoryId, categoryId, imgs, detail}
      if(this.isUpdate) {
        product._id = this.product._id
      }
      const result = await reqProductAddUpdate(product)
      if (result.status === 0) {
        message.success('save product success')
        this.props.history.goBack()
      } else {
        message.error('save product error')
      }
    })
  }
  componentWillMount() {
    const product = this.props.location.state
    this.product = product || {}
    this.isUpdate = !!product
  }
  componentDidMount() {
    this.getCategorys('0')
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {isUpdate, product} = this
    const {options} = this.state

    const categoryIds = []
    if (isUpdate) {
      if (product.pCategoryId === '0') {
        categoryIds.push(product.categoryId)
      } else {
        categoryIds.push(product.pCategoryId)
        categoryIds.push(product.categoryId)
      }
    }
    const title = (
      <LinkButton onClick={() => this.props.history.goBack()}>
        <Icon type='arrow-left' style={{fontSize: 20}}></Icon>&nbsp;&nbsp;
        <span>{isUpdate?'修改商品':'添加商品'}</span>
      </LinkButton>
    )

    return (
      <Card title={title}>
        <Form labelCol={{span:3}} wrapperCol={{span:15}}>
          <Item label='商品名称:'>
            {
              getFieldDecorator('name', {
                initialValue:product.name,
                rules:[{required:true, message:'must name'}]
              })(<Input placeholder='input product name'/>)
            }
          </Item>
          <Item label='商品描述:'>
            {
              getFieldDecorator('desc', {
                initialValue:product.desc,
                rules:[{required:true, message:'must desc'}]
              })(<TextArea autoSize placeholder='input product desc'/>)
            }
          </Item>
          <Item label='商品价格:'>
            {
              getFieldDecorator('price', {
                initialValue:product.price,
                rules:[{validator: this.priceValidator}]
              })(<Input placeholder='input product price' addonAfter='元'/>)
            }
          </Item>
          <Item label='商品分类:'>
            {
              getFieldDecorator('categoryIds', {
                initialValue:categoryIds,
                rules:[{required:true, message:'must category'}]
              })(
                <Cascader
                  options={options}
                  loadData={this.changeOptions}
                />
              )
            }
          </Item>
          <Item label='商品图片:'>
            <PictureWall ref={this.pw} imgs={product.imgs}></PictureWall>
          </Item>
          <Item label='商品详情:' labelCol={{span:3}} wrapperCol={{span:18}}>
            <RichTextEditor ref={this.rte} detail={product.detail}></RichTextEditor>
          </Item>
          <Button type='primary' onClick={this.submit}>提交</Button>
        </Form>
      </Card>
    )
  }
}
export default Form.create()(AddUpdate)
