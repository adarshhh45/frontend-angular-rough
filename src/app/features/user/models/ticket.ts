export interface Ticket {
  ticketId: number;
  ticketNumber: string;
  originStationName: string;
  destinationStationName: string;
  fare: number;
  bookingTime: string; // This will be an ISO date string
  expiryTime: string;  // This will be an ISO date string
  status: 'CONFIRMED' | 'IN_TRANSIT' | 'CANCELLED' | 'EXPIRED' | 'USED';
  ticketType: 'ONE_WAY' | 'RETURN' | 'DAY_PASS';
  qrCodePayload: string;
  qrCodeImage: string; // This will be a Base64 encoded image string
}