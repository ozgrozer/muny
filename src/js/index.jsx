import React from 'react'
import ReactDOM from 'react-dom'

import './../css/style.scss'

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      formItems: {
        task: ''
      },
      tasks: {},
      lastTaskId: null
    }
  }

  emptyFormItems () {
    const formItems = this.state.formItems

    Object.keys(formItems).map((itemName) => {
      formItems[itemName] = ''
    })

    this.setState({
      formItems: formItems
    })
  }

  handleForm (e) {
    e.preventDefault()
    const form = e.target
    form.classList.add('was-validated')

    if (form.checkValidity()) {
      this.emptyFormItems()
      form.classList.remove('was-validated')
    } else {
      form.classList.add('was-validated')
    }
  }

  handleInput (e) {
    const item = e.target
    const formItems = this.state.formItems

    formItems[item.name] = item.value

    this.setState({
      formItems: formItems
    })
  }

  newTask () {
    console.log('newTask')
  }

  deleteTask () {
    console.log('deleteTask')
  }

  doneOrUndoneTask () {
    console.log('doneOrUndoneTask')
  }

  render () {
    let tasks
    const getTasks = this.state.tasks

    if (Object.keys(getTasks).length) {
      tasks = Object.keys(getTasks).map((i) => {
        const getTask = getTasks[i]
        const checked = getTask.done || false
        const taskName = getTask.done ? (<strike>{getTask.task}</strike>) : getTask.task

        return (
          <li key={i} className='list-group-item'>
            <div className='custom-control custom-checkbox'>
              <input type='checkbox' className='custom-control-input' id={`customCheck${i}`} checked={checked} onChange={this.doneOrUndoneTask.bind(this)} />
              <label className='custom-control-label' htmlFor={`customCheck${i}`}>{taskName}</label>
            </div>

            <button className='btn btn-danger btn-sm deleteTask' onClick={this.deleteTask.bind(this)}>Delete</button>
          </li>
        )
      })
    } else {
      tasks = <li className='list-group-item'>Loading...</li>
    }

    return (
      <div className='container'>
        <div className='container2'>
          <h2>Muny</h2>
          <p>
            A todo app with <a href='https://github.com/ozgrozer/muny#resources' target='_blank'>free resources</a>
          </p>

          <form noValidate onSubmit={this.handleForm.bind(this)}>
            <div className='form-group'>
              <input type='text' name='task' placeholder='New task' className='form-control form-control-lg' required value={this.state.formItems.task} onChange={this.handleInput.bind(this)} />
              <div className='invalid-feedback'>
                You didn't write something
              </div>
            </div>
            <div className='form-group'>
              <button type='submit' className='btn btn-primary btn-lg btn-block'>Add</button>
            </div>
          </form>

          <div className='card'>
            <div className='card-header'>
              <b>Tasks</b>
            </div>
            <ul className='list-group list-group-flush'>
              {tasks}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
