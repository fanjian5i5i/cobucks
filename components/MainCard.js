import React, { Component } from 'react'
import {
    Button,
    Menu,
    MenuItem,
    MenuDivider,
    Popover,
    Position,
    Alert,
    Card
} from "@blueprintjs/core";
import $ from "jquery";
const menu = (
    <Menu>
        <MenuItem text="New" />
        <MenuItem text="Open" />
        <MenuItem text="Save" />
        <MenuDivider />
        <MenuItem text="Settings..." />
    </Menu>
);

class AlertTest extends Component {
  constructor(props){
    super(props)
    this.state = {open: true};
  }
  confirmAlert(){
    this.setState({open:false})
  }
  handleSubmit(){
    console.log("Submit");
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/getprojects',
    })
    .done(function( res ) {
      console.log(res)
      $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/getprojects',
      })
      .done(function( res ) {
        console.log(JSON.parse(res))
      });
    });
  }
  render() {
    var that = this;
    return (
      <div className="docs-card-example">
        <div className="pt-card pt-elevation-0 pt-interactive">
        <h5><a href="#">Trader Profile</a></h5>
        <p>
              <input className="pt-input .modifier pt-fill" type="text" placeholder="Text input" dir="auto" />
        </p>
        <h5><a href="#">Trader Profile</a></h5>
        <p>
              <input className="pt-input .modifier pt-fill" type="text" placeholder="Text input" dir="auto" />
        </p>        <h5><a href="#">Trader Profile</a></h5>
        <p>
              <input className="pt-input .modifier pt-fill" type="text" placeholder="Text input" dir="auto" />
        </p>
        <h5><a href="#">Trader Profile</a></h5>
        <p>
              <input className="pt-input .modifier pt-fill" type="text" placeholder="Text input" dir="auto" />
        </p>
        <h5><a href="#">Trader Profile</a></h5>
        <p>
              <input className="pt-input .modifier pt-fill" type="text" placeholder="Text input" dir="auto" />
        </p>

        <p>
        <button type="button" className="pt-button pt-intent-success pt-align-right" onClick={this.handleSubmit}>
          Submit
        </button>
        </p>
        </div>


        </div>
    )
  }

}

export default AlertTest
