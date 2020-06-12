import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Card, List, Icon} from 'antd'
import {reqCategoryInfo} from "../../api";
import {BASE_IMG_PATH} from "../../config/constants";
import LinkButton from '../../components/link-button'
import './index.less'

const {Item} = List

class Detail extends Component{

    state = {
      cName1:'',
      cName2:''
    }

    getCategoryName = async () => {
      const {pCategoryId, categoryId} = this.props.location.state
      if (pCategoryId === '0') {
        const result = await reqCategoryInfo(categoryId)
        if (result.status === 0) {
         this.setState({ cName1:result.data.name })
        }
      } else {
        const results =
          await Promise.all([reqCategoryInfo(pCategoryId), reqCategoryInfo(categoryId)])
        this.setState({
          cName1: results[0].data.name,
          cName2: results[1].data.name
        })
      }
    }
    componentDidMount() {
      this.getCategoryName()
    }

  render() {
    const product = this.props.location.state
    console.log(product)
    const {cName1, cName2} = this.state

    const categoryName = cName1 + (
      cName2 ? ' ---> '+cName2 : ''
    )
    const title = (
      <LinkButton onClick={() => this.props.history.goBack()}>
        <Icon type='arrow-left' style={{fontSize: 20}}></Icon>&nbsp;&nbsp;
        <span>商品详情</span>
      </LinkButton>
    )

    return (
      <Card title={title}>
        <List>
          <Item>
            <span className='left'>商品名称：</span>
            <span>{product.name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述：</span>
            <span>{product.desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格：</span>
            <span>{product.price}元</span>
          </Item>
          <Item>
            <span className='left'>所属分类：</span>
            <span>{categoryName}</span>
          </Item>
          <Item>
            <span className='left'>商品图片：</span>
            {
              product.imgs.map(img => (
                <img
                  src={BASE_IMG_PATH+img}
                  style={{width: 150, height: 150, marginRight: 10, border: '1px solid black'}}
                  alt="img"
                  key={img}
                />
                )
              )
            }
          </Item>
          <Item>
            <span className='left'>商品详情：</span>
            <div dangerouslySetInnerHTML={{__html:product.detail}}></div>
          </Item>
        </List>
      </Card>
    )
  }
}
export default withRouter(Detail)
