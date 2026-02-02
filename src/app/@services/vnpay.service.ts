import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import {
  VnpayPaymentRequest,
  VnpayResult,
  VNPAY_CONFIG,
  VNPAY_RESPONSE_CODES
} from '../@core/models/vnpay.model';

@Injectable({
  providedIn: 'root'
})
export class VnpayService {
  constructor(private router: Router) {}

  /**
   * Format date to VNPay format: yyyyMMddHHmmss
   */
  private formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds())
    );
  }

  /**
   * Build payment request object
   */
  buildPaymentRequest(
    orderId: string,
    amount: number,
    orderInfo: string,
    returnUrl: string
  ): VnpayPaymentRequest {
    return {
      vnp_Version: VNPAY_CONFIG.VERSION,
      vnp_Command: VNPAY_CONFIG.COMMAND,
      vnp_TmnCode: VNPAY_CONFIG.TMN_CODE,
      vnp_Amount: Math.round(amount * 100), // VNPay requires amount × 100
      vnp_CreateDate: this.formatDate(new Date()),
      vnp_CurrCode: VNPAY_CONFIG.CURR_CODE,
      vnp_IpAddr: '127.0.0.1', // Mock IP
      vnp_Locale: VNPAY_CONFIG.LOCALE,
      vnp_OrderInfo: this.sanitizeOrderInfo(orderInfo),
      vnp_OrderType: VNPAY_CONFIG.ORDER_TYPE,
      vnp_ReturnUrl: returnUrl,
      vnp_TxnRef: orderId,
      vnp_SecureHash: this.generateMockHash()
    };
  }

  /**
   * Sanitize order info (remove special characters as per VNPay docs)
   */
  private sanitizeOrderInfo(info: string): string {
    return info.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 255);
  }

  /**
   * Generate mock hash (in real implementation, this would be HMAC-SHA512)
   */
  private generateMockHash(): string {
    return 'MOCK_' + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Build query string from payment request
   */
  buildQueryString(params: VnpayPaymentRequest): string {
    const sortedKeys = Object.keys(params).sort();
    const queryParts: string[] = [];

    for (const key of sortedKeys) {
      const value = params[key as keyof VnpayPaymentRequest];
      if (value !== undefined && value !== null && value !== '') {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      }
    }

    return queryParts.join('&');
  }

  /**
   * Redirect to mock VNPay gateway
   */
  redirectToVnpay(orderId: string, amount: number, orderInfo: string): void {
    const returnUrl = window.location.origin + '/vnpay-return';
    const request = this.buildPaymentRequest(orderId, amount, orderInfo, returnUrl);
    const queryString = this.buildQueryString(request);

    this.router.navigateByUrl('/vnpay-mock?' + queryString);
  }

  /**
   * Parse return URL params to VnpayResult
   */
  parseReturnParams(params: Params): VnpayResult {
    const responseCode = params['vnp_ResponseCode'] || '99';
    const amount = parseInt(params['vnp_Amount'] || '0', 10) / 100;

    return {
      responseCode,
      transactionNo: params['vnp_TransactionNo'] || '',
      amount,
      orderInfo: decodeURIComponent(params['vnp_OrderInfo'] || ''),
      txnRef: params['vnp_TxnRef'] || '',
      bankCode: params['vnp_BankCode'] || '',
      bankTranNo: params['vnp_BankTranNo'] || '',
      cardType: params['vnp_CardType'] || 'ATM',
      payDate: params['vnp_PayDate'] || '',
      isSuccess: responseCode === '00',
      message: this.getResponseMessage(responseCode)
    };
  }

  /**
   * Get response message from code
   */
  getResponseMessage(code: string): string {
    return VNPAY_RESPONSE_CODES[code] || 'Lỗi không xác định';
  }

  /**
   * Format pay date from VNPay format (yyyyMMddHHmmss) to readable format
   */
  formatPayDate(payDate: string): string {
    if (!payDate || payDate.length !== 14) return payDate;

    const year = payDate.substring(0, 4);
    const month = payDate.substring(4, 6);
    const day = payDate.substring(6, 8);
    const hour = payDate.substring(8, 10);
    const minute = payDate.substring(10, 12);
    const second = payDate.substring(12, 14);

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  }

  /**
   * Generate mock transaction number
   */
  generateTransactionNo(): string {
    return 'VNP' + Date.now().toString().substring(5);
  }

  /**
   * Generate mock bank transaction number
   */
  generateBankTranNo(): string {
    return 'BANK' + Math.random().toString().substring(2, 10);
  }
}
