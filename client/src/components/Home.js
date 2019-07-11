import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [{name: "room 1", _id: "5d277dba1c9d440000da4b16"}]
    };
  }

  componentWillMount() {
    // this.setRooms();
  }

  setRooms = () => {
    fetch('localhost:8000/rooms', {
      accept: 'application/json',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    }).then(response => response.json()).then(data => {
      debugger;
      this.setState({rooms: data});
    });
  };

  render() {
    return (
      <div className="Home">
        <p>
          Welcome to BLAH BLAH! Here's how this works...
          You choose a room and create a username when you get there,
          then you have to get a like within 60 seconds in order to stay.
          So bring some good contributions to the table and you'll be able
          to enjoy the conversation, if you don't, you'll be kicked out.
        </p>
        <List subheader={<li />}>
          {this.state.rooms.map(room => (
            <ListItem button key={room.name} onClick={() => this.props.setRoom(room)}>
              <ListItemText primary={room.name} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default Home;
