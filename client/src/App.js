import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Room from './components/Room';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [{name: "room1", _id: 1}],
      room: {}
    };
  }

  setRoom = room => {
    this.setState({room});
  }

  render() {
    return (
      <div className="App">
        {this.state.room._id ? (
          <Room roomName={this.state.room} />
        )
          <Home />
        )
      </div>
    );
  }
}

export default App;
