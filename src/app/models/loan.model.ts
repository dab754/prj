export interface Loan {
  id?: number;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  purpose: string;
  description?: string;
  requestDate: string;
  dueDate: string;
  status: string;
  freelancer: {
    id: number;
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
}
