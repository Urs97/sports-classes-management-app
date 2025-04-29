import { Module } from '@nestjs/common';

import { NotificationProviderToken } from './interface/notification-provider.interface';
import { FirebaseService } from './providers/firebase.service';

@Module({
  providers: [
    FirebaseService,
    {
      provide: NotificationProviderToken,
      useExisting: FirebaseService,
    },
  ],
  exports: [NotificationProviderToken],
})
export class FirebaseModule {}
