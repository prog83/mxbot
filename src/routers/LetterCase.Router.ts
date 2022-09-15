import { MatrixClient, MessageEvent, MessageEventContent } from 'matrix-bot-sdk';

import { LetterCaseController } from 'controllers';

export default class LetterCaseRouter {
  private letterCaseController: LetterCaseController;

  constructor(client: MatrixClient) {
    this.letterCaseController = new LetterCaseController(client);
  }

  async switchCase(roomId: string, message: MessageEvent<MessageEventContent>) {
    await this.letterCaseController.switchCase(roomId, message);
  }

  async upperCase(roomId: string, message: MessageEvent<MessageEventContent>) {
    await this.letterCaseController.upperCase(roomId, message);
  }

  async lowerCase(roomId: string, message: MessageEvent<MessageEventContent>) {
    await this.letterCaseController.lowerCase(roomId, message);
  }
}
