export class UserEnrolledEvent {
  constructor(
    public readonly userEmail: string,
    public readonly classDescription: string,
    public readonly adminId: number,
  ) {}
}
