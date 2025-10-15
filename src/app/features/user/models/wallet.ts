export interface WalletTransaction {
  transactionId: number;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  transactionTime: string; // ISO date string
}

export interface Wallet {
  walletId: number;
  balance: number;
  transactions: WalletTransaction[];
}

export interface WalletRechargeResponse {
    razorpayOrderId: string;
    paymentId: number;
    amount: number;
    currency: string;
    apiKey: string;
}