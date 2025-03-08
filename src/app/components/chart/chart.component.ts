import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerService } from '../../services/ticker.service';
import { Subject, takeUntil } from 'rxjs';
import { formatLabels } from '../../utilities/format-labels';

@Component({
  standalone: true,
  selector: 'app-chart',
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit, OnDestroy {
  private btcData: number[] = [];
  private ethData: number[] = [];
  private labels: string[] = [];
  private interval: string = '1w';
  private destroy$ = new Subject<void>();
  private RGraph = (window as any).RGraph;

  constructor(private tickerService: TickerService) {}

  ngOnInit(): void {
    this.loadData(this.interval, 4);
  }

  loadData(interval: string, limit: number) {
    this.fetchTickerData('BTCUSDT', interval, limit, this.btcData);
    this.fetchTickerData('ETHUSDT', interval, limit, this.ethData);
  }

  fetchTickerData(pair: string, interval: string, limit: number, targetArray: number[]) {
    const tickerObservable =
      pair === 'BTCUSDT'
        ? this.tickerService.getBtcTicker(interval, limit)
        : this.tickerService.getEthTicker(interval, limit);

    tickerObservable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        targetArray.length = 0;
        targetArray.push(...data.map((d) => d.value));

        if (pair === 'BTCUSDT') {
          this.labels = formatLabels(
            data.map((d) => d.timestamp),
            interval
          );
        }

        this.drawCharts();
      },
      error: (err) => console.error(`Error ${pair}:`, err)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  drawCharts() {
    const btcCanvas = document.getElementById('btcChart') as HTMLCanvasElement;
    const ethCanvas = document.getElementById('ethChart') as HTMLCanvasElement;

    if (btcCanvas) btcCanvas.getContext('2d')?.clearRect(0, 0, btcCanvas.width, btcCanvas.height);
    if (ethCanvas) ethCanvas.getContext('2d')?.clearRect(0, 0, ethCanvas.width, ethCanvas.height);

    // BTC Line Chart
    if (this.btcData.length) {
      new this.RGraph.Line({
        id: 'btcChart',
        data: this.btcData,
        options: {
          xaxisLabels: this.labels,
          gutterBottom: 50,
          title: 'Lines',
          colors: ['orange'],
          yaxisLabelsCount: 5,
          textSize: 6,
          yaxisLabelsOffsetx: 5,
          scaleDecimals: 2,
          linewidth: 3,
          yaxisScaleUnitsPre: '$',
          yaxis: true
        }
      }).draw();
    }
    // ETH Bar Chart
    if (this.ethData.length) {
      new this.RGraph.Bar({
        id: 'ethChart',
        data: this.ethData,
        options: {
          xaxisLabels: this.labels,
          title: 'Bars',
          yaxis: true,
          yaxisScale: true,
          yaxisLabelsCount: 5,
          textSize: 6,
          yaxisScaleUnitsPre: '$',
          scaleDecimals: 2,
          colors: ['#6580ea']
        }
      }).draw();
    }
  }
}
