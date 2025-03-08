import { Component, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ProfitService } from '../../services/profit.service';
import { Profit } from '../../models/profit.model';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { ProfitPeriodComponent } from '../profit-period/profit-period.component';
import { ProfitChartComponent } from '../profit-chart/profit-chart.component';

@Component({
  selector: 'app-profit',
  templateUrl: './profit.component.html',
  imports: [FormsModule, NgForOf, ProfitPeriodComponent, ProfitChartComponent],
  styleUrl: './profit.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProfitComponent implements OnInit {
  profits: Profit[] = [];
  newProfitName = '';
  @ViewChildren(ProfitChartComponent) profitCharts!: QueryList<ProfitChartComponent>;
  constructor(private profitService: ProfitService) {}

  ngOnInit(): void {
    this.loadProfits();
  }

  loadProfits() {
    this.profitService.getProfits().subscribe((data) => {
      this.profits = data;
    });
  }

  createProfit() {
    if (!this.newProfitName.trim()) return;

    this.profitService.createProfit(this.newProfitName).subscribe((newProfit) => {
      this.profits.push(newProfit);
      this.newProfitName = '';
    });
  }

  deleteProfit(id: number) {
    this.profitService.deleteProfit(id).subscribe(() => {
      this.profits = this.profits.filter((p) => p.id !== id);
      this.updateChart(id);
    });
  }

  updateChart(profitId: number) {
    const chartComponent = this.profitCharts.find((chart) => chart.profitId === profitId);
    if (chartComponent) {
      chartComponent.loadProfitPeriods();
    } else {
      console.warn(`No Chart for ${profitId}`);
    }
  }
}
