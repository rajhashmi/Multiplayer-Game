let webSocketConnection = null;
let playerColor = null;
let roomID = null;


webSocketConnection = new WebSocket("ws://localhost:8080");

let prevPostion = null;

function distance(p1,p2) {
    return Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2 + (p1.z-p2.z)**2);

}
self.onmessage = (event) => {
  const { type, data } = event.data;


  switch (type) {
    case 'INIT': // Initialize WebSocket connection and parameters
    {
        console.log('webscokett', webSocketConnection);
      playerColor = data.playerColor;
      roomID = data.roomID;
      break;
    }

    case 'SEND_POSITION':{ 
        const { ballPosition } = data;
      if (
        webSocketConnection &&
        webSocketConnection.readyState === WebSocket.OPEN
      ) {
        if(!prevPostion) {
            webSocketConnection.send(
            JSON.stringify({
                type: 'player_moved',
                ballPosition,
                playerIdentity: playerColor,
                roomID,
            })
            );
            prevPostion = ballPosition;
            return
        }

        if(distance(prevPostion,ballPosition) > 0.5) {
            webSocketConnection.send(
                JSON.stringify({
                    type: 'player_moved',
                    ballPosition,
                    playerIdentity: playerColor,
                    roomID,
                })
                );
                prevPostion = ballPosition;
                return
        }




      }
      break; }

    default:
      console.error('Unknown message type:', type);
  }
};
