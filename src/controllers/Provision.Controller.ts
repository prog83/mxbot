import { LogService, MatrixClient, MessageEvent, MessageEventContent } from 'matrix-bot-sdk';

import htmlEscape from 'escape-html';

import { ProvisionService } from 'services';

export default class ProvisionController {
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

  async translit(roomId: string, message: MessageEvent<MessageEventContent>) {
    try {
      const textBody = ProvisionController.getText(message.textBody);
      if (!textBody) {
        await this.sendMessage(roomId, 'No text');
        return;
      }

      const traslitText = await ProvisionService.translit(textBody);
      await this.sendMessage(roomId, traslitText);
    } catch (error) {
      LogService.error('ProvisionController', error);
    }
  }
}
