import React, { Component } from 'react'
import {
    Button,
    Menu,
    MenuItem,
    MenuDivider,
    Popover,
    Position,
    Dialog,
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
    this.state = {
      // workspace:"\\\\ZBRAFILE\\DATA\\Deptment\\Planning\\GIS\\DCGIS_Administration\\CITYWIDE\\COB_PWD\\COBUCS\\COBUCS.gdb",
      workspace:"Z:\\Deptment\\Planning\\GIS\\DCGIS_Administration\\CITYWIDE\\COB_PWD\\COBUCS\\COBUCS.gdb",
      street:"Y:\\GISData\\projects\\pwd\\cobucs_data\\rte-sys.shp",
      parcel:"parcel_15",
      output:"Art80_from_sql",
      isOpen:false
    };
  }
  handleSubmit(){
    var that = this;
    console.log(this.refs);
    var args = this.state;
    this.setState({ isOpen: true });
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/runPython',
      dataType: "json",
      data:args,
      timeout:100
    })

    var socket = io.connect();
    // socket.emit('send message', "done")
    socket.on('new message',function(data){
      console.log(data.msg[0]);

      // var filename = "E:/"+data.msg[1].substring(3,data.msg[1].length);
      var filename = "E:/Export_Table1499384177.csv"
      console.log(filename);
      $.ajax({
           url: "http://localhost:3000/downloadCSV?parameters="+filename,
           type: "GET",
           success: function() {
                      that.setState({ isOpen: false });
                     window.location = 'downloadCSV';
                 }
      });
      // $.ajax({
      //   type: 'GET',
      //   url: 'http://localhost:3000/downloadCSV',
      //   data:{"file":filename},
      //   success: function() {
      //           window.location = 'downloadCSV';
      //       }
      // })
      //
      // var xmlHttp = new XMLHttpRequest();
      //
      // xmlHttp.open( "GET", "http://localhost:3000/downloadCSV", false ); // false for synchronous request
      // xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      // xmlHttp.send( JSON.stringify(filename) );
    })
  }
  handleWorkspaceChange(e){

    this.setState({workspace:e.target.value})
  }
  handleStreetChange(e){

    this.setState({street:e.target.value})
  }
  handleParcelChange(e){

    this.setState({parcel:e.target.value})
  }
  handleOutputChange(e){

    this.setState({output:e.target.value})
  }

  render() {
    var that = this;
    return (
      <div className="docs-card-example" style={{float:"left",width:"50%",height:800}}>
        <div className="pt-card pt-elevation-0 pt-interactive" style={{height:800}}>
        <h5><a href="#">Workspace</a></h5>
        <p>
              <input className="pt-input .modifier pt-fill" type="text" value={this.state.workspace} placeholder="Text input" dir="auto" onChange={this.handleWorkspaceChange.bind(this)}/>
        </p>
        <h5><a href="#">Street</a></h5>
        <p>
              <input className="pt-input .modifier pt-fill" type="text" value={this.state.street}  placeholder="Text input" dir="auto" onChange={this.handleStreetChange.bind(this)}/>
        </p>        <h5><a href="#">Parcel</a></h5>
        <p>
              <input className="pt-input .modifier pt-fill" type="text" value={this.state.parcel} placeholder="Text input" dir="auto" onChange={this.handleParcelChange.bind(this)}/>
        </p>

        <p style={{paddingTop:400,paddingLeft:"90%"}}>
        <button type="button" className="pt-button pt-intent-success pt-align-right" onClick={this.handleSubmit.bind(this)} >
          Submit
        </button>
        </p>
        <Dialog
                    // className={this.props.themeName}
                    isOpen={this.state.isOpen}
                >
                    <p>
                    <div className="pt-spinner .pt-small">
                      <div className="pt-spinner-svg-container">
                        <svg viewBox="0 0 100 100">
                          <path className="pt-spinner-track" d="M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89"></path>
                          <path className="pt-spinner-head" d="M 94.5 50 A 44.5 44.5 0 0 0 50 5.5"></path>
                        </svg>
                      </div>
                    </div>
                    </p>
                </Dialog>

        </div>


        </div>
    )
  }

}

export default AlertTest
