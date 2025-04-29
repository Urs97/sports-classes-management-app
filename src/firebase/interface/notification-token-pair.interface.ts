import { INotificationData } from './notification-data.interface';

export interface INotificationTokenPair {
  token: string;
  notification: INotificationData;
}
