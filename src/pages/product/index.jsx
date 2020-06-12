import React,{Component} from 'react'
import {Route, Switch, Redirect} from "react-router-dom";
import Home from './home'
import AddUpdateForm from './add-update'
import Detail from './detail'

export default class Product extends Component{
  render() {
    return (
      <Switch>
        <Route path='/product' component={Home} exact></Route>
        <Route path='/product/detail' component={Detail}></Route>
        <Route path='/product/addupdate' component={AddUpdateForm}></Route>
        <Redirect to='/product'></Redirect>
      </Switch>
    )
  }
}
