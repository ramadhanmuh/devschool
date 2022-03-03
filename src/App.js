import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      first_name: '',
      last_name: '',
      buttonDisabled: false
    };
  }

  componentDidMount() {
    axios.get('https://reqres.in/api/users?page=1')
      .then(response => {
        this.setState({ members: response.data.data })
      })
      .catch(error => {
        console.log(error)
      })
  }

  inputOnChangeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmitHandler = event => {
    console.log('Form telah di submit');
    event.preventDefault();

    this.setState({buttonDisabled: true});

    var payload = {
      first_name: this.state.first_name,
      last_name: this.state.last_name
    };

    var url = "https://reqres.in/api/users";

    axios.post(url, payload)
      .then(response => {
        console.log(response);

        var members = [...this.state.members];

        members.push(response.data);

        this.setState({ members, buttonDisabled: false, first_name: '', last_name: '' });
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <div className='container'>
        <h1>Codepolitan DevSchool</h1>
        <div className='row'>
          <div className='col-md-6 border border-dark'>
            <h2>Member</h2>
            <div className='row'>
              {this.state.members.map((member, index) => 
                <div className='col-md-6'
                  key={member.id}>
                  <div className='card' style={{margin: 10}}>
                    <div className='card-body'>
                      <h5 className='card-title'>{member.id}</h5>
                      <h5 className='card-title'>{member.first_name}</h5>
                      <h5 className='card-title'>{member.last_name}</h5>
                      <button className='btn btn-primary'>
                        Edit
                      </button>
                      <button className='btn btn-danger'>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='col-md-6 border border-dark'>
            <h2>Form</h2>
            <form onSubmit={this.onSubmitHandler}>
              <div className='form-group'>
                <label>First Name</label>
                <input type="text"
                  className='form-control'
                  name='first_name'
                  value={this.state.first_name}
                  onChange={this.inputOnChangeHandler} />
              </div>
              <div className='form-group'>
                <label>Last Name</label>
                <input type="text"
                  className='form-control'
                  name='last_name'
                  value={this.state.last_name}
                  onChange={this.inputOnChangeHandler} />
              </div>
              <button type="submit"
                className='btn btn-primary'
                disabled={this.state.buttonDisabled}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
