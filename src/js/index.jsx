import React from 'react'
import ReactDOM from 'react-dom'

import './../css/style.scss'

class App extends React.Component {
  render () {
    return (
      <div className='container'>
        <div className='container2'>
          <h2>Muny</h2>
          <p>A todo app with <a href='https://github.com/ozgrozer/muny#resources' target='_blank'>free resources</a></p>

          <form className='form' noValidate>
            <div className='form-group'>
              <input type='text' className='form-control form-control-lg' placeholder='Add something' />
            </div>
            <div className='form-group'>
              <button type='submit' className='btn btn-primary btn-lg btn-block'>Add</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
