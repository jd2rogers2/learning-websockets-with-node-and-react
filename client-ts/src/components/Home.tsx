import React, { FunctionComponent } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export const Home: FunctionComponent<IHomeProps> = ({rooms, setRoom, newRoom, roomInput, roomInputUpdate}) => (
  <div className="Home">
    <p>
      Welcome to learning websockets, mongodb, and typescript app! Here's how this works...
      You choose a room and create a username when you get there,
      then you have to get a like within 60 seconds in order to stay.
      So bring some good contributions to the table and you'll be able
      to enjoy the conversation, if you don't, you'll be kicked out.
    </p>
    <List subheader={<li />}>
      {rooms.map(room => (
        <ListItem button key={room._id} onClick={() => setRoom(room.name)}>
          <ListItemText primary={room.name} />
        </ListItem>
      ))}
    </List>
    <br />
    <form onSubmit={newRoom}>
      <TextField
        label=''
        style={{ margin: 8 }}
        helperText=''
        fullWidth
        margin="normal"
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        placeholder="new room"
        value={roomInput}
        onChange={roomInputUpdate}
      />
      <Button type="submit" variant="contained" color="primary">Send</Button>
    </form>
  </div>
);
