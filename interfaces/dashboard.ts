export interface DashboardSummaryResponse {
  numberOfOrders: number;
  paidOrders: number;
  notPaidOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  productsWithLowInventory: number;
  productsWithNoInventory: number;
  message?: string;
}
