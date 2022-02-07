import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from 'src/app/common/api-constant';
import { CommonService } from 'src/app/common/common.service';
import { NotiType } from 'src/app/common/constant';
import { environment } from 'src/environments/environment';
import { LoginResponse } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private server = environment.serverApi;
  isLogin = true;
  loginDto = new LoginDto();
  registerDto = new RegisterDto();
  constructor(private commonService: CommonService, private router: Router) {}

  ngOnInit(): void {}

  changeTab(value: boolean): void {
    if (this.isLogin && value) {
      this.isLogin = true;
      return;
    }
    if (!this.isLogin && !value) {
      this.isLogin = false;
      return;
    }
    this.isLogin = value;
  }

  /** Đăng nhập */
  Login(): void {
    this.commonService.httpPost(this.loginDto, Api.LOGIN).subscribe(
      (res: LoginResponse) => {
        if (res && res.id) {
          localStorage.setItem('currentUser', res ? JSON.stringify(res) : '');
          localStorage.setItem('token', res.token ? res.token : '');
          this.commonService.createNotification(
            NotiType.SUCCESS,
            'Thông báo',
            'Đăng nhập thành công'
          );
          this.router.navigate(['/home']);
        } else {
          this.commonService.createNotification(
            NotiType.ERROR,
            'Thông báo',
            'Đăng nhập thất bại'
          );
        }
      },
      (er) => {
        this.commonService.createNotification(
          NotiType.ERROR,
          'Thông báo',
          'Đăng nhập thất bại'
        );
      }
    );
  }

  /** Đăng ký */
  Register(): void {
    if (
      this.registerDto.password &&
      this.registerDto.password === this.registerDto.confirmPassword
    ) {
      this.commonService.httpPost(this.registerDto, Api.REGISTER).subscribe(
        (res) => {
          if (res && res.state) {
            this.commonService.createNotification(
              NotiType.SUCCESS,
              'Thông báo',
              'Đăng ký thành công'
            );
            this.router.navigate(['/login']);
          } else {
            this.commonService.createNotification(
              NotiType.ERROR,
              'Thông báo',
              'Đăng ký thất bại'
            );
          }
        },
        (er) => {
          this.commonService.createNotification(
            NotiType.ERROR,
            'Thông báo',
            'Đăng ký thất bại'
          );
        }
      );
    }else{
      this.commonService.createNotification(NotiType.ERROR,'Thông báo','Mật khẩu xác nhận không trùng khớp!')
    }
  }
}
