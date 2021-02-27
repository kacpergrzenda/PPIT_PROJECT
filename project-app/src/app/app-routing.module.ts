import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';


const routes: Routes = [
  {
    path: 'signup',
    loadChildren: () =>
      import('./../app/pages/signup/signup.module').then((module) => module.SignupModule),
  },
  {
    path: 'signin',
    loadChildren: () => import('./../app/pages/signin/signin.module').then(module => module.SigninModule),
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
