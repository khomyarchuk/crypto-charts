import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ProfitService } from '../../services/profit.service';
import { ProfitPeriod } from '../../models/profit-period.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profit-chart',
  templateUrl: './profit-chart.component.html',
  styleUrl: './profit-chart.component.scss'
})
export class ProfitChartComponent implements OnInit, OnDestroy {
  @Input() profitId!: number;
  private periods: ProfitPeriod[] = [];
  private labels: string[] = [];
  private data: number[] = [];
  private RGraph = (window as any).RGraph;
  private destroy$ = new Subject<void>();

  constructor(private profitService: ProfitService) {}

  ngOnInit(): void {
    this.loadProfitPeriods();
  }

  loadProfitPeriods() {
    this.profitService
      .getProfit(this.profitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profit) => {
          if (profit.periods && profit.periods.length > 0) {
            this.periods = profit.periods;
            this.updateChartData();
          }
        },
        error: (error) => {
          console.error(`Error getting Profit ${this.profitId}:`, error);
        }
      });
  }

  updateChartData() {
    if (!this.periods.length) {
      return;
    }

    this.labels = this.periods.map((p) => new Date(p.start).toLocaleDateString());
    this.data = this.periods.map((p) => p.factor);
    this.drawChart();
  }

  drawChart() {
    const canvas = document.getElementById(`profitChart-${this.profitId}`) as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);

    new this.RGraph.Line({
      id: `profitChart-${this.profitId}`,
      data: this.data,
      options: {
        xaxisLabels: this.labels,
        gutterBottom: 50,
        title: 'Profit Factor Over Time',
        yaxisLabelsCount: 5,
        textSize: 8,
        colors: ['green'],
        backgroundGridAutofitNumhlines: 5,
        backgroundGridAutofitNumvlines: this.labels.length,
        linewidth: 2,
        tickmarks: 'circle'
      }
    }).draw();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
