import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextBoxComponent } from './text-box/text-box.component';

import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TextBoxComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crypto_FE';
}
