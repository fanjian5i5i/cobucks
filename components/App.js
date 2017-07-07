import React, { Component } from 'react'
import MainCard from './MainCard'
import TopNav from './TopNav'
import MainMap from './MainMap'

class App extends Component {

  render() {
    return (
      <div>
        <TopNav/>

        <MainCard />
        <MainMap />
      </div>
    )
  }

}

export default App
