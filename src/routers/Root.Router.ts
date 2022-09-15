import { MatrixClient, MessageEvent, RichReply } from 'matrix-bot-sdk';
import htmlEscape from 'escape-html';

import { Event } from 'types';

import LetterCaseRouter from './LetterCase.Router';
import ProvisionRouter from './Provision.Router';

export const COMMAND_PREFIX = '!';

const COMMANDS = {
  start: `${COMMAND_PREFIX}start`,
  letterCase: `${COMMAND_PREFIX}letterCase`,
  upperCase: `${COMMAND_PREFIX}upperCase`,
  lowerCase: `${COMMAND_PREFIX}lowerCase`,

  translit: `${COMMAND_PREFIX}translit`,
};

export default class RootRouter {
  private letterCaseRouter: LetterCaseRouter;

  private provisionRouter: ProvisionRouter;

  constructor(private client: MatrixClient) {
    this.letterCaseRouter = new LetterCaseRouter(client);
    this.provisionRouter = new ProvisionRouter(client);
  }

  async handler(roomId: string, event: Event) {
    const message = new MessageEvent(event);

    const [command] = message.textBody.trim().split(' ');
    // if (!command.startsWith(COMMAND_PREFIX)) return;

    switch (command) {
      case COMMANDS.letterCase:
        await this.letterCaseRouter.switchCase(roomId, message);
        break;

      case COMMANDS.upperCase:
        await this.letterCaseRouter.upperCase(roomId, message);
        break;

      case COMMANDS.lowerCase:
        await this.letterCaseRouter.lowerCase(roomId, message);
        break;

      case COMMANDS.translit:
        await this.provisionRouter.translit(roomId, message);
        break;

      case COMMANDS.start:
      default: {
        const textBody = Object.values(COMMANDS).join('\n');
        const htmlBody = `<b>Help menu:</b><br /><pre><code>${htmlEscape(textBody)}</code></pre>`;

        const reply = RichReply.createFor(roomId, event, textBody, htmlBody);
        reply.msgtype = 'm.notice';

        await this.client.sendMessage(roomId, reply);
        break;
      }
    }
  }
}
