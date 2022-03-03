import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Members from './components/Members/Members';
import Form from './components/Form/Form';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      first_name: '',
      last_name: '',
      buttonDisabled: false,
      formStatus: 'create',
      memberIdSelected: null
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

    var url = '';
    if (this.state.formStatus === 'create') {
      url = "https://reqres.in/api/users";
      this.addMember(url, payload);
    } else {
      url = `https://reqres.in/api/users/${this.state.memberIdSelected}`
      this.editMember(url, payload);
    }
  }

  addMember = (url, payload) => {
    axios.post(url, payload)
      .then(response => {
        var members = [...this.state.members];

        members.push(response.data);

        this.setState({ members, buttonDisabled: false, first_name: '', last_name: '' });
      })
      .catch(error => {
        console.log(error)
      });
  };

  editMember = (url, payload) => {
    axios.put(url, payload)
      .then(response => {
        var members = [...this.state.members];

        var indexmember = members.findIndex(member => member.id === this.state.memberIdSelected);

        members[indexmember].first_name = response.data.first_name;
        members[indexmember].last_name = response.data.last_name;

        this.setState({
          members,
          buttonDisabled: false,
          first_name: '',
          last_name: '',
          formStatus: 'create'
        });
      }).catch(error => {
        console.log(error);
      });
  }

  editButtonHandler = member => {
    this.setState({
      first_name: member.first_name,
      last_name: member.last_name,
      formStatus: 'edit',
      memberIdSelected: member.id
    })
  };

  deleteButtonHandler = id => {
    var url = `https://reqres.in/api/users/${id}`;

    axios.delete(url)
      .then(response => {
        if (response.status === 204) {
          var members = [...this.state.members];

          var index = members.findIndex(member => member.id === id);

          members.splice(index, 1);

          this.setState({ members });
        }
      })
      .catch(error => {
        console.log(error);
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
              <Members
                  members={this.state.members}
                  editButtonClick={(member) => this.editButtonHandler(member)}
                  deleteButtonClick={(id) => this.deleteButtonHandler(id)}
              />
            </div>
          </div>
          <div className='col-md-6 border border-dark'>
            <h2>Form {this.state.formStatus}</h2>
            <Form 
              onSubmitForm={this.onSubmitHandler}
              onChange={this.inputOnChangeHandler}
              first_name={this.state.first_name}
              last_name={this.state.last_name}
              buttonDisabled={this.state.buttonDisabled}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
