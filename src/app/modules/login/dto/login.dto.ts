export class LoginDto {
  constructor() {
    this.username = '';
    this.password = '';
    this.remember = true;
  }
  username: string;
  password: string;
  remember:boolean;
}
