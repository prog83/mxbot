import { LogService, MatrixClient, MessageEvent, MessageEventContent } from 'matrix-bot-sdk';

import htmlEscape from 'escape-html';

import { LetterCaseService } from 'services';

export default class LetterCaseController {
  constructor(private client: MatrixClient) {}

  static getText(textBody: string) {
    const [, ...text] = textBody.trim().split(' ');
    return text.join(' ');
  }

  sendMessage(roomId: string, body: string) {
    return this.client.sendMessage(roomId, {
      body,
      msgtype: 'm.notice',
      format: 'org.matrix.custom.html',
      formatted_body: htmlEscape(body),
    });
  }

  async switchCase(roomId: string, message: MessageEvent<MessageEventContent>) {
    try {
      const textBody = LetterCaseController.getText(message.textBody);
      if (!textBody) {
        await this.sendMessage(roomId, 'No text');
        return;
      }

      const switchCaseText = LetterCaseService.switchCase(textBody);
      await this.sendMessage(roomId, switchCaseText);
    } catch (error) {
      LogService.error('LetterCaseController', error);
    }
  }

  async upperCase(roomId: string, message: MessageEvent<MessageEventContent>) {
    try {
      const textBody = LetterCaseController.getText(message.textBody);
      if (!textBody) {
        await this.sendMessage(roomId, 'No text');
        return;
      }

      await this.sendMessage(roomId, textBody.toUpperCase());
    } catch (error) {
      LogService.error('LetterCaseController', error);
    }
  }

  async lowerCase(roomId: string, message: MessageEvent<MessageEventContent>) {
    try {
      const textBody = LetterCaseController.getText(message.textBody);
      if (!textBody) {
        await this.sendMessage(roomId, 'No text');
        return;
      }

      await this.sendMessage(roomId, textBody.toLowerCase());
    } catch (error) {
      LogService.error('LetterCaseController', error);
    }
  }
}
