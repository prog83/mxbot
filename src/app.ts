import {
  LogService,
  LogLevel,
  RichConsoleLogger,
  MatrixClient,
  RustSdkCryptoStorageProvider,
  ICryptoStorageProvider,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin,
  AutojoinUpgradedRoomsMixin,
} from 'matrix-bot-sdk';
import path from 'path';

import 'env';
import Handler from 'Handler';

const { HOMESERVER_URL, ACCESS_TOKEN, AUTO_JOIN, ENCRYPTION, DATA_PATH } = process.env;
const autoJoin = AUTO_JOIN === 'true';
const encryption = ENCRYPTION === 'true';

LogService.setLogger(new RichConsoleLogger());
LogService.setLevel(LogLevel.DEBUG);
LogService.muteModule('Metrics');
LogService.info('App', 'Bot starting...');

const storage = new SimpleFsStorageProvider(path.join(DATA_PATH!, 'mxbot.json'));

// eslint-disable-next-line no-undef-init
let cryptoStore: ICryptoStorageProvider | undefined = undefined;
if (encryption) {
  cryptoStore = new RustSdkCryptoStorageProvider(path.join(DATA_PATH!, 'encrypted'));
}

const client = new MatrixClient(HOMESERVER_URL!, ACCESS_TOKEN!, storage, cryptoStore);

if (autoJoin) {
  AutojoinRoomsMixin.setupOnClient(client);
  AutojoinUpgradedRoomsMixin.setupOnClient(client);
}

client.on('room.failed_decryption', (roomId: string, event: any, error: Error) => {
  LogService.error('App', 'Decryption failed!', error);
});

const run = async () => {
  try {
    const joinedRooms = await client.getJoinedRooms();
    LogService.info('App', 'Joined rooms = ', joinedRooms);
    await client.crypto.prepare(joinedRooms);

    const handler = new Handler(client);
    handler.run();

    LogService.info('App', 'Starting sync...');
    await client.start();
    LogService.info('App', 'Client started!');
  } catch (error) {
    LogService.error('App', error);
  }
};

if (require.main === module) {
  run();
}
