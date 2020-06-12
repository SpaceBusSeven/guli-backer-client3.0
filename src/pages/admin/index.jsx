import React,{Component} from 'react'
import {Route, Switch, Redirect} from "react-router-dom";
import {Layout} from "antd";
import memoryUtil from '../../utils/memoryUtil'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home'
import Category from '../category'
import Product from '../product'
import Role from '../role'
import User from '../user'
import Line from '../charts/line'
import Bar from '../charts/bar'
import Pie from '../charts/pie'
import NotFound from '../not-found'

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component{
  render() {

    if (!memoryUtil.user || !memoryUtil.user._id) {
      return <Redirect to='/login'></Redirect>
    }


    return (
      <Layout style={{minHeight: '100%'}}>
        <Sider>
          <LeftNav></LeftNav>
        </Sider>
        <Layout>
          <Header></Header>
          <Content style={{margin: 20, backgroundColor: '#fff'}}>
            <Switch>
              <Redirect from='/' to='/home' exact/>
              <Route path='/home' component={Home}></Route>
              <Route path='/role' component={Role}></Route>
              <Route path='/user' component={User}></Route>
              <Route path='/product' component={Product}></Route>
              <Route path='/category' component={Category}></Route>
              <Route path='/charts/line' component={Line}></Route>
              <Route path='/charts/bar' component={Bar}></Route>
              <Route path='/charts/pie' component={Pie}></Route>
              <Route component={NotFound}></Route>
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
