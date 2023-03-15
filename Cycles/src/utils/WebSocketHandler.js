// import React, {useState, useEffect} from 'react';
// import {Context as NotifContext} from '../context/NotifContext';
// import {io} from 'socket.io-client';
// import envs from './Config/env';
// import {Context as AuthContext} from './src/context/AuthContext';

// const BACKEND_URL = envs.DEV_URL;

// const WebSocketHandler = async () => {
//   const authContext = useContext(AuthContext);
//   const socket = io(
//     `${BACKEND_URL}/ws/notif-socket/?token=${authContext?.state?.token}`,
//   );
//   const notifContext = useContext(NotifContext);
//   const [ws, setWs] = useState(null);

//   useEffect(async () => {
//     try {
//       setWs(socket);

//       socket.onopen = () => {
//         console.log('WebSocket connected');
//       };

//       socket.onerror = error => {
//         console.error('WebSocket error: ', error);
//       };

//       socket.onmessage = event => {
//         console.log('WebSocket message: ', event.data);
//         notifContext?.notifBadge();
//       };
//     } catch (e) {
//       null;
//     }
//     return () => {
//       ws.close();
//     };
//   }, [url, authContext?.state?.token, notifContext?.state?.notifCount]);

//   return ws;
// };

// export default WebSocketHandler;
