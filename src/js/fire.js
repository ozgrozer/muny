import { firebase } from '@firebase/app'
import '@firebase/database'

const config = {
  apiKey: 'AIzaSyDYRnhcuc1eT1LYYvszACo8HuFZkkI2Oz0',
  authDomain: 'ozgrozer-muny.firebaseapp.com',
  databaseURL: 'https://ozgrozer-muny.firebaseio.com',
  projectId: 'ozgrozer-muny',
  storageBucket: 'ozgrozer-muny.appspot.com',
  messagingSenderId: '197981362707'
}

const fire = firebase.initializeApp(config)

module.exports = fire
