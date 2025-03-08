import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './components/chart/chart.component';
import { ProfitComponent } from './components/profit/profit.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ChartComponent, ProfitComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'crypto-charts';
}
