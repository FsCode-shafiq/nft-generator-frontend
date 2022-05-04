import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { MatRippleModule, MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button'
import { AppRoutingModule } from './app-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'
import { NgOtpInputModule } from 'ng-otp-input';
import { NgxFileDropModule } from 'ngx-file-drop';
import {ReactiveFormsModule} from '@angular/forms'
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { NgxCanvasModule } from 'ngx-canvas';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { FeatureComponent } from './feature/feature.component';
import { PricingComponent } from './pricing/pricing.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { GeneratorComponent } from './generator/generator.component';
import { MyCollectionsComponent } from './my-collections/my-collections.component';
import { PaymentsComponent } from './payments/payments.component';
import { ViewCollectionComponent } from './view-collection/view-collection.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'generator', component: GeneratorComponent },
      {path: 'my-collections', component: MyCollectionsComponent},
      {path: 'view-collection', component: ViewCollectionComponent},
      {path: 'payments', component: PaymentsComponent}
    ]
  },
  { path: '**', component: HomeComponent },
]
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    NavbarComponent,
    IntroductionComponent,
    FeatureComponent,
    PricingComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    GeneratorComponent,
    MyCollectionsComponent,
    PaymentsComponent,
    ViewCollectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatRippleModule,
    MatCommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgOtpInputModule,
    NgxFileDropModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgxCanvasModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
