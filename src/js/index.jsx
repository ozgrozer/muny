import React from 'react'
import ReactDOM from 'react-dom'
import firebase from 'firebase'

import './../css/style.scss'

const firebaseConfig = {
  apiKey: 'AIzaSyDYRnhcuc1eT1LYYvszACo8HuFZkkI2Oz0',
  authDomain: 'ozgrozer-muny.firebaseapp.com',
  databaseURL: 'https://ozgrozer-muny.firebaseio.com',
  projectId: 'ozgrozer-muny',
  storageBucket: 'ozgrozer-muny.appspot.com',
  messagingSenderId: '197981362707'
}

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      formItemTask: '',
      tasksLoading: true,
      tasks: {},
      lastTaskId: null,
      disabledForm: false
    }
  }

  componentDidMount () {
    const app = firebase.initializeApp(firebaseConfig)
    const database = app.database()

    const ref = database.ref('/')
    ref.once('value').then((db) => {
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
      }

      this.setState({
        tasksLoading: false
      })
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

    firebase.database().ref('/' + newId)
      .set({ task, done })
      .then((res) => {
        if (res !== 'undefined') {
          tasks[newId] = { task, done }

          this.setState({
            formItemTask: '',
            disabledForm: false,
            tasks
          })

          this.inputTask.focus()
        }
      })
  }

  deleteTask (taskId) {
    const tasks = this.state.tasks

    firebase.database().ref('/' + taskId)
      .remove()
      .then((res) => {
        if (res !== 'undefined') {
          delete tasks[taskId]

          this.setState({ tasks })
        }
      })
  }

  doneOrUndoneTask () {
    console.log('doneOrUndoneTask')
  }

  render () {
    let tasks
    const getTasks = this.state.tasks

    if (this.state.tasksLoading) {
      tasks = <li className='list-group-item'>Loading...</li>
    } else {
      if (Object.keys(getTasks).length) {
        tasks = Object.keys(getTasks).reverse().map((i) => {
          const getTask = getTasks[i]
          const checked = getTask.done || false
          const taskName = getTask.done ? (<strike>{getTask.task}</strike>) : getTask.task

          return (
            <li key={i} className='list-group-item'>
              <div className='custom-control custom-checkbox'>
                <input type='checkbox' className='custom-control-input' id={`customCheck${i}`} checked={checked} onChange={this.doneOrUndoneTask.bind(this)} />
                <label className='custom-control-label' htmlFor={`customCheck${i}`}>{taskName}</label>
              </div>

              <button className='btn btn-danger btn-sm deleteTask' onClick={this.deleteTask.bind(this, i)}>Delete</button>
            </li>
          )
        })
      } else {
        tasks = <li className='list-group-item'>No task found.</li>
      }
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
