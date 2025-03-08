import { ProfitPeriod } from './profit-period.model';

export interface Profit {
  periods: ProfitPeriod[];
  id: number;
  name: string;
}
