import React, { Component } from 'react'
import TextInput from './TextInput'
import MainCard from './MainCard'
import TopNav from './TopNav'

class App extends Component {

  render() {
    return (
      <div>
        <TopNav/>
        <MainCard/>
      </div>
    )
  }

}

export default App
