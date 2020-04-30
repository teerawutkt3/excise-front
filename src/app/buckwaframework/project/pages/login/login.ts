import { Component, OnInit } from "@angular/core";
import { User } from "../../../common/models";
import { MessageBarService } from "../../../common/services";
import { AuthService } from "../../../common/services/auth.service";

@Component({
  selector: "page-login",
  templateUrl: "login.html",
  styleUrls: ["login.css"]
})
export class LoginPage implements OnInit {
  username: string = "admin";
  password: string = "password";
  loading: boolean;

  constructor(
    public authService: AuthService,
    private messageBarService: MessageBarService
  ) { }

  ngOnInit() { }

  onLogin() {
    this.loading = true;
    const user: User = {
      username: this.username,
      password: this.password,
      exciseBaseControl: null
    };
    this.authService
      .login(user)
      .then(ok => {
        this.loading = false;
      })
      .catch(error => {
        this.messageBarService.errorModal(
          "ไม่สามารถเข้าสู่ระบบได้",
          "เกิดข้อผิดพลาด"
        );
        this.loading = false;
      });
  }

  onKey(event: KeyboardEvent) {
    let keyCode = event.code || event.keyCode;
    if (keyCode === "Enter" || keyCode === 13) {
      this.onLogin();
    }
  }
}
