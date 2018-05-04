import React from 'react'
import ReactDOM from 'react-dom'

import './../css/style.scss'

class App extends React.Component {
  render () {
    return (
      <div className='container'>
        <h1>Hello World!</h1>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
