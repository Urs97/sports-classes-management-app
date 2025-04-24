import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserEnrolledEvent } from '../events/user-enrolled.event';
import { AbstractEnrollmentsGateway } from '../abstract/enrollments.abstract.gateway';
import { EnrollmentEvents } from '../constants/enrollment-events.enum';

@Injectable()
export class UserEnrolledListener {
  constructor(private readonly gateway: AbstractEnrollmentsGateway) {}

  @OnEvent(EnrollmentEvents.USER_ENROLLED)
  handle(event: UserEnrolledEvent) {
    if (!event.adminId) return;

    this.gateway.sendMessageToAdmin(event.adminId, {
      message: `User ${event.userEmail} enrolled in your class "${event.classDescription}".`,
    });
  }
}
