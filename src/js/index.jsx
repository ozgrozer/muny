import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

import fire from './fire'
import './../css/style.scss'

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      formItemTask: '',
      tasksLoading: true,
      tasks: {},
      tasksCount: {
        all: 0,
        active: 0,
        completed: 0
      },
      lastTaskId: 0,
      disabledForm: false,
      clientIp: '',
      activeFilter: 'all'
    }
  }

  componentDidMount () {
    axios
      .get('https://json.geoiplookup.io/api')
      .then((res) => {
        this.setState({
          clientIp: res.data.ip
        })
      })

    fire.database().ref('/')
      .once('value')
      .then((db) => {
        const todos = db.val()
        const tasks = {}

        if (todos) {
          this.setState({
            lastTaskId: Object.keys(todos).pop()
          })

          for (var key in todos) {
            var todo = todos[key]
            tasks[key] = {
              done: todo.done,
              task: todo.task
            }
          }

          this.setState({ tasks })
          this.tasksCount()
        }

        this.setState({
          tasksLoading: false
        })
      })
  }

  tasksCount () {
    const getTasks = this.state.tasks
    const count = {
      all: Object.keys(getTasks).length,
      active: 0,
      completed: 0
    }

    Object.keys(getTasks).map((key) => {
      const task = getTasks[key]
      if (task.done) count.completed++
      if (!task.done) count.active++
    })

    this.setState({
      tasksCount: count
    })
  }

  handleForm (e) {
    e.preventDefault()
    const form = e.target
    form.classList.add('was-validated')

    if (form.checkValidity()) {
      form.classList.remove('was-validated')
      this.addNewTask()
    } else {
      form.classList.add('was-validated')
    }
  }

  handleInput (e) {
    this.setState({
      formItemTask: e.target.value
    })
  }

  addNewTask () {
    this.setState({ disabledForm: true })

    const done = false
    const task = this.state.formItemTask
    const newId = parseInt(this.state.lastTaskId) + 1
    const tasks = this.state.tasks
    const clientIp = this.state.clientIp

    fire.database().ref('/' + newId)
      .set({ task, done, clientIp })
      .then((res) => {
        if (res !== 'undefined') {
          tasks[newId] = { task, done }

          this.setState({
            formItemTask: '',
            disabledForm: false,
            lastTaskId: newId,
            tasks
          })
          this.tasksCount()

          this.inputTask.focus()
        }
      })
  }

  deleteTask (taskId) {
    const tasks = this.state.tasks

    fire.database().ref('/' + taskId)
      .remove()
      .then((res) => {
        if (res !== 'undefined') {
          delete tasks[taskId]

          this.setState({ tasks })
          this.tasksCount()
        }
      })
  }

  doneOrUndoneTask (taskId, checked) {
    const tasks = this.state.tasks
    const task = tasks[taskId].task
    const done = !checked
    const clientIp = this.state.clientIp

    fire.database().ref('/' + taskId)
      .set({ task, done, clientIp })
      .then((res) => {
        if (res !== 'undefined') {
          tasks[taskId].done = done

          this.setState({ tasks })
          this.tasksCount()
        }
      })
  }

  changeFilter (section) {
    this.setState({
      activeFilter: section
    })
  }

  tasksForView () {
    let tasks
    const getTasks = {}
    for (let key in this.state.tasks) {
      const task = this.state.tasks[key]
      if (this.state.activeFilter === 'all') {
        getTasks[key] = task
      } else if (this.state.activeFilter === 'active' && !task.done) {
        getTasks[key] = task
      } else if (this.state.activeFilter === 'completed' && task.done) {
        getTasks[key] = task
      }
    }

    if (this.state.tasksLoading) {
      tasks = <li className='list-group-item'>Loading...</li>
    } else {
      if (Object.keys(getTasks).length) {
        tasks = Object.keys(getTasks).reverse().map((key) => {
          const getTask = getTasks[key]
          const checked = getTask.done || false
          const taskName = getTask.done ? (<strike>{getTask.task || 'Unnamed'}</strike>) : getTask.task || 'Unnamed'

          return (
            <li key={key} className='list-group-item'>
              <div className='custom-control custom-checkbox'>
                <input type='checkbox' className='custom-control-input' id={`customCheck${key}`} checked={checked} onChange={this.doneOrUndoneTask.bind(this, key, checked)} />

                <label className='custom-control-label' htmlFor={`customCheck${key}`}>{taskName}</label>
              </div>

              <button className='btn btn-danger btn-sm deleteTask' onClick={this.deleteTask.bind(this, key)}>Delete</button>
            </li>
          )
        })
      } else {
        tasks = <li className='list-group-item'>No task found</li>
      }
    }

    return tasks
  }

  render () {
    let itemsLeft
    const activeTasks = this.state.tasksCount.active
    if (activeTasks > 1) {
      itemsLeft = `${activeTasks} items left`
    } else if (activeTasks === 1) {
      itemsLeft = `${activeTasks} item left`
    } else {
      itemsLeft = 'All done'
    }

    return (
      <div className='container'>
        <div className='container2'>
          <h2>Muny</h2>

          <p>
            A todo app with <a href='https://github.com/ozgrozer/muny#resources' target='_blank'>free resources</a>
          </p>

          <form noValidate onSubmit={this.handleForm.bind(this)}>
            <fieldset disabled={this.state.disabledForm}>
              <div className='form-group'>
                <input type='text' name='task' placeholder='New task' className='form-control form-control-lg' required value={this.state.formItemTask} onChange={this.handleInput.bind(this)} ref={(input) => { this.inputTask = input }} />

                <div className='invalid-feedback'>
                  You didn't write something
                </div>
              </div>

              <div className='form-group'>
                <button type='submit' className='btn btn-primary btn-lg btn-block'>Add</button>
              </div>
            </fieldset>
          </form>

          <div className='card'>
            <div className='card-header'>
              <b>Tasks</b>
            </div>

            <div>
              <ul className='list-group list-group-flush'>
                {this.tasksForView()}
              </ul>
            </div>

            {
              !this.state.tasksLoading && this.state.tasksCount.all ? (
                <div className='card-footer'>
                  <div className='float-left'>
                    {itemsLeft}
                  </div>

                  <div className='float-right'>
                    <div className='btn-group'>
                      <button
                        className={
                          'btn btn-light btn-sm' +
                          (this.state.activeFilter === 'all' ? ' active' : '')
                        }
                        onClick={this.changeFilter.bind(this, 'all')}
                      >
                        All ({this.state.tasksCount.all})
                      </button>

                      <button
                        className={
                          'btn btn-light btn-sm' +
                          (this.state.activeFilter === 'active' ? ' active' : '')
                        }
                        onClick={this.changeFilter.bind(this, 'active')}
                      >
                        Active ({this.state.tasksCount.active})
                      </button>

                      <button
                        className={
                          'btn btn-light btn-sm' +
                          (this.state.activeFilter === 'completed' ? ' active' : '')
                        }
                        onClick={this.changeFilter.bind(this, 'completed')}
                      >
                        Completed ({this.state.tasksCount.completed})
                      </button>
                    </div>
                  </div>
                </div>
              ) : ''
            }
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
