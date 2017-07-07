import React, { Component } from 'react'
import {
    Navbar
} from "@blueprintjs/core";



class TopNav extends Component {
  constructor(props){
    super(props)
    this.state = {open: true};
  }
  handleGoHome(){
    location.reload();
  }
  render() {
    var that = this;
    return (
      <nav className="pt-navbar .modifier">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">Cobucs</div>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <button className="pt-button pt-minimal pt-icon-home" onClick={this.handleGoHome.bind(this)}>Home</button>
        </div>
      </nav>
    )
  }

}

export default TopNav
