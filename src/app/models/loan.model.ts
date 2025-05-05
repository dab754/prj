
export interface Loan {
  id?: number;
  amount: number;
  paidAmount?: number;
  remainingAmount?: number;
  purpose: string;
  status: string;
  freelancer: {
    id: number;
  };
  requestDate?: string;
}
