export class ExpenseEntity {
  id: number;
  id_user: number;
  description: string;
  value: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ExpenseEntity>) {
    Object.assign(this, partial);
  }
}
