import { Inject, Injectable, Logger } from '@nestjs/common';
import Firebase from 'firebase-admin';
import { TokenMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { FirebaseConfig } from 'src/common/config/env.validation';
import { ChunkUtils } from 'src/common/utils/chunk.utils';

import { INotificationProvider } from '../interface/notification-provider.interface';
import { INotificationTokenPair } from '../interface/notification-token-pair.interface';

@Injectable()
export class FirebaseService implements INotificationProvider {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly config: FirebaseConfig,
  ) {
    Firebase.initializeApp({
      credential: Firebase.credential.cert({
        projectId: this.config.PROJECTID,
        privateKey: this.config.PRIVATEKEY,
        clientEmail: this.config.EMAIL,
      }),
    });
  }

  async sendOneNotification(pair: INotificationTokenPair): Promise<void> {
    const payload = this.mapNotificationData(pair)[0];

    try {
      await Firebase.messaging().send(payload);
    } catch (err: unknown) {
      this.logger.error(err);
    }
  }

  async sendMultipleNotifications(
    pairs: INotificationTokenPair[],
  ): Promise<void> {
    const total = pairs.length;
    let failed = 0;

    const payloads = this.mapNotificationData(...pairs);
    const payloadChunks = ChunkUtils.splitIntoChunks(payloads);

    for (const chunk of payloadChunks) {
      try {
        const result = await Firebase.messaging().sendEach(chunk);
        failed += result.failureCount;
      } catch (err: unknown) {
        this.logger.error(err);
      }
    }

    this.logger.log(
      'info',
      `Successfully sent ${total - failed} out of ${total} notifications`,
    );
  }

  mapNotificationData(...pairs: INotificationTokenPair[]): TokenMessage[] {
    return pairs.map((pair) => ({
      token: pair.token,
      notification: {
        title: pair.notification.title,
        body: pair.notification.shortDescription,
      },
      data: {
        title: pair.notification.title,
        body: pair.notification.shortDescription,
        fullDescription: pair.notification.fullDescription,
        redirectScreen: pair.notification.redirectScreen
          ? String(pair.notification.redirectScreen)
          : '',
      },
    }));
  }
}