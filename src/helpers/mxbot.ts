import { MatrixClient } from 'matrix-bot-sdk';

export const isRoomEncrypted = (client: MatrixClient, roomId: string) => client.crypto.isRoomEncrypted(roomId);
