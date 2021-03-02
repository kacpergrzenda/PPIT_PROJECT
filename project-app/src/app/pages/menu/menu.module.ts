import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';

import { MatButtonModule } from '@angular/material/button'




@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule.forChild([{ path: '', component: MenuComponent }])
  ]
})
export class MenuModule { }
