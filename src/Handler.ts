import { LogService, MatrixClient, MessageEvent } from 'matrix-bot-sdk';

import RootRouter from 'routers';
import { Event } from 'types';

export const COMMAND_PREFIX = '/';

export default class Handler {
  private displayName: string = '';

  private userId: string = '';

  private rootRouter: RootRouter;

  constructor(private client: MatrixClient) {
    this.rootRouter = new RootRouter(client);
  }

  public async run() {
    await this.prepare();

    this.client.on('room.message', this.onMessage.bind(this));
  }

  private async prepare() {
    try {
      this.userId = await this.client.getUserId();
      const profile = await this.client.getUserProfile(this.userId);
      this.displayName = profile?.displayName;
    } catch (error) {
      LogService.warn('Handler', error);
    }
  }

  private async handleRoomEncrypted(roomId: string, event: Event) {
    const isEncrypted = await this.client.crypto.isRoomEncrypted(roomId);
    if (!isEncrypted) {
      const body = `Sorry...\nI work only with encrypted room ;-)`;
      await this.client.replyNotice(roomId, event, body);
    }
  }

  private async onMessage(roomId: string, event: Event) {
    const message = new MessageEvent(event);

    if (message.isRedacted) return;
    if (message.sender === this.userId) return;
    if (message.messageType !== 'm.text') return;

    if (process.env.ENCRYPTION === 'true') {
      await this.handleRoomEncrypted(roomId, event);
    }

    try {
      this.rootRouter.handler(roomId, event);
    } catch (error) {
      LogService.error('Handler', error);
      this.client.replyNotice(roomId, event, 'Ooops, error (');
    }
  }
}
