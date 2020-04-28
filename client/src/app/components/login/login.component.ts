import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    dataRcvd:any = {};
    messageClass;
    message;
    processing = false;
    form: FormGroup;
    prevUrl;


    constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private authGuard: AuthGuard ) {
        this.createForm();
    }

    createForm() {
        this.form = this.formBuilder.group({
          username: ['', Validators.required], 
          password: ['', Validators.required] 
        });
    }

    disableForm() {
        this.form.controls['username'].disable(); 
        this.form.controls['password'].disable(); 
    }

    enableForm() {
        this.form.controls['username'].enable();
        this.form.controls['password'].enable();
    }

    onLoginSubmit() {
        this.processing = true;
        this.disableForm(); 
        const user = {
          username: this.form.get('username').value,
          password: this.form.get('password').value
        }
    
        // Function to send login data to API
        this.authService.login(user).subscribe(data => {
          this.dataRcvd = data;
          if (!this.dataRcvd.success) {
            this.messageClass = 'alert alert-danger';
            this.message = this.dataRcvd.message;
            this.processing = false;
            this.enableForm();
          } else {
            this.messageClass = 'alert alert-success';
            this.message = this.dataRcvd.message;
            this.authService.storeUserData(this.dataRcvd.token, this.dataRcvd.user);
            setTimeout(() => {
              if(this.prevUrl) this.router.navigate([this.prevUrl]);
              else this.router.navigate(['/profile']);
            }, 2000);
          }
        });
      }



    ngOnInit(): void {
      if (this.authGuard.redirectUrl) {
        this.messageClass = 'alert alert-danger';
        this.message = 'You must be logged in to view that page.'
        this.prevUrl = this.authGuard.redirectUrl;
        this.authGuard.redirectUrl = undefined;
      }
    }

}