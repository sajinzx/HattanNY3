
export enum TicketType {
  STAG = 'Stag',
  COUPLE = 'Couple',
  ANGELS = 'Angels'
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  ticketType: TicketType;
  quantity: number;
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
