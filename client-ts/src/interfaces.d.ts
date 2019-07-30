
interface IMessage {
  user: string;
  liked: boolean;
  content: string;
  _id: string;
  room: string;
}

interface IRoom {
  _id: string;
  name: string;
}

interface IAppState {
  room: string;
  messages: Array<IMessage>;
  messageInput: string;
  roomInput: string;
  rooms: Array<IRoom>;
}

interface IWebSocketData {
  type: string;
  messages: Array<IMessage>;
  message: IMessage;
  rooms: Array<IRoom>;
  room: IRoom;
}

interface IHomeProps {
  rooms: Array<IRoom>;
  setRoom: (name: string) => void;
  newRoom: (event: React.MouseEvent<HTMLFormElement>) => void;
  roomInput: string;
  roomInputUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IRoomProps {
  room: string;
  newMessage: (event: React.FormEvent<HTMLFormElement>, user: string) => void;
  setRoom: (room: string) => void;
  messages: Array<IMessage>;
  messageInputUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void;
  messageInput: string;
  likeMessage: (message: IMessage) => void;
}

interface IRoomState {
  user: string;
  isModalOpen: boolean;
  userInput: string;
  usernameExists: boolean;
}
