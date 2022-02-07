export class RegisterDto {
  constructor() {
    this.phone = '';
    this.email = '';
    this.name = '';
    this.address = '';
    this.password = '';
    this.confirmPassword = '';
  }
  phone: string;
  email: string;
  name: string;
  address: string;
  password: string;
  confirmPassword: string;
}
