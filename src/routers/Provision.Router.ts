import { MatrixClient, MessageEvent, MessageEventContent } from 'matrix-bot-sdk';

import { ProvisionController } from 'controllers';

export default class ProvisionRouter {
  private provisionController: ProvisionController;

  constructor(client: MatrixClient) {
    this.provisionController = new ProvisionController(client);
  }

  async translit(roomId: string, message: MessageEvent<MessageEventContent>) {
    await this.provisionController.translit(roomId, message);
  }
}
