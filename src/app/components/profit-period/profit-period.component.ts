import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ProfitService } from '../../services/profit.service';
import { ProfitPeriod } from '../../models/profit-period.model';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { formatDatePeriod } from '../../utilities/format-date';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profit-period',
  templateUrl: './profit-period.component.html',
  imports: [FormsModule, DatePipe, NgForOf, NgIf],
  styleUrl: './profit-period.component.scss'
})
export class ProfitPeriodComponent implements OnInit, OnDestroy {
  @Input() profitId!: number;
  @Output() periodAdded = new EventEmitter<void>();
  @Output() periodDeleted = new EventEmitter<void>();
  @Output() periodUpdated = new EventEmitter<number>();
  protected periods: ProfitPeriod[] = [];
  protected newPeriod: ProfitPeriod = {
    id: 0,
    start: Date.now(),
    end: Date.now() + 86400000,
    factor: 1
  };

  protected editingPeriod: ProfitPeriod | null = null;
  protected isEditing: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private profitService: ProfitService) {}

  startEditing(period: ProfitPeriod) {
    this.isEditing = true;
    this.editingPeriod = { ...period };
  }

  cancelEditing() {
    this.isEditing = false;
  }

  ngOnInit(): void {
    this.loadPeriods();
  }

  loadPeriods() {
    this.profitService
      .getProfit(this.profitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profit) => {
          if (profit.periods && profit.periods.length > 0) {
            this.periods = profit.periods;
          }
        },
        error: (error) => {
          console.error(`Error getting Profit ${this.profitId}:`, error);
        }
      });
  }

  addPeriod() {
    const fixedPeriod = {
      ...this.newPeriod,
      start: new Date(this.newPeriod.start).getTime(),
      end: new Date(this.newPeriod.end).getTime()
    };

    this.profitService
      .addProfitPeriod(this.profitId, fixedPeriod)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newPeriod) => {
          this.periodAdded.emit();
          this.periods.push(newPeriod);
          this.newPeriod = {
            id: 0,
            start: formatDatePeriod(Date.now()),
            end: formatDatePeriod(Date.now() + 86400000) + 86400000,
            factor: 1
          };
        },
        error: (error) => {
          console.error('Error', error);
        }
      });
  }

  updatePeriod() {
    if (!this.editingPeriod) return;
    const formattedPeriod = {
      ...this.editingPeriod,
      start: new Date(this.editingPeriod.start).getTime(),
      end: new Date(this.editingPeriod.end).getTime()
    };

    this.profitService
      .updateProfitPeriod(this.profitId, this.editingPeriod.id, formattedPeriod)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.periodUpdated.emit(this.profitId);
          this.editingPeriod = null;
        },
        error: (error) => {
          console.error(`Error updating ProfitPeriod ${this.editingPeriod?.id}:`, error);
        }
      });
  }

  deletePeriod(periodId: number) {
    this.profitService
      .deleteProfitPeriod(this.profitId, periodId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.periodDeleted.emit();
        this.periods = this.periods.filter((p) => p.id !== periodId);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
