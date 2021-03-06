import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from  '../app/services/guard/auth.guard';


const routes: Routes = [
  {
    path: 'signup',
    loadChildren: () =>
      import('./../app/pages/signup/signup.module').then((module) => module.SignupModule),
  },
  {
    path: 'signin',
    loadChildren: () => import('./../app/pages/signin/signin.module').then(module => module.SigninModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./../app/pages/home/home.module').then(module => module.HomeModule),  canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./../app/pages/home/home.module').then(module => module.HomeModule),  canActivate: [AuthGuard]
  },
  {
    path: 'menu',
    loadChildren: () => import('./../app/pages/menu/menu.module').then(module => module.MenuModule),
  },
  {
    path: 'profilepage',
    loadChildren: () => import('./../app/pages/profile-page/profile-page.module').then(module => module.ProfilePageModule), canActivate: [AuthGuard]
  },
  {
    path: 'exercise',
    loadChildren: () => import('./../app/pages/exercise/exercise.module').then(module => module.ExerciseModule), canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
