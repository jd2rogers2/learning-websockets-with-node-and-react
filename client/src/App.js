import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Room from './components/Room';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
          <Room room={this.state.room} setRoom={this.setRoom} />
        ) : (
          <Home setRoom={this.setRoom} />
        )}
      </div>
    );
  }
}

export default App;
