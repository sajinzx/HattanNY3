
export enum TicketType {
  STAG = 'Stag',
  COUPLE = 'Couple',
  ANGELS = 'Angels'
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  tickets: {
    [key in TicketType]?: number;
  };
  totalPax: number;
  amountPaid: number;
  totalCost: number;
  amountPending: number;
  createdAt: number;
}

export interface TicketPrice {
  [TicketType.STAG]: number;
  [TicketType.COUPLE]: number;
  [TicketType.ANGELS]: number;
}
