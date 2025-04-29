import { NotificationRedirectScreen } from 'src/common/constants/notification-redirect-screen.enum';
import { NotificationType } from '../../common/constants/notification-type.enum';

export interface INotificationData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  redirectScreen?: NotificationRedirectScreen;
  type: NotificationType;

  /**
   * Flag which indicates whether the notification has been directly opened
   */
  isRead?: boolean;

  /**
   * Flag which indicates whether the notification has been fetched in the list
   */
  isOpened?: boolean;

  /**
   * Any additional data that the notification may contain
   */
  meta?: object;
}
