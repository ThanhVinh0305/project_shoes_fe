import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { VnpayResult, VNPAY_BANKS } from '../../@core/models/vnpay.model';
import { VnpayService } from '../../@services/vnpay.service';
import { BillService } from '../../@services/bill.service';

@Component({
  selector: 'app-vnpay-return',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './vnpay-return.component.html',
  styleUrl: './vnpay-return.component.scss'
})
export class VnpayReturnComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly vnpayService = inject(VnpayService);
  private readonly billService = inject(BillService);

  paymentResult = signal<VnpayResult | null>(null);
  bankName = signal<string>('');

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    
    if (params['vnp_ResponseCode']) {
      const result = this.vnpayService.parseReturnParams(params);
      this.paymentResult.set(result);

      // Find bank name
      const bank = VNPAY_BANKS.find(b => b.code === result.bankCode);
      this.bankName.set(bank?.name || result.bankCode);

      // If payment successful, you can call API to confirm payment
      if (result.isSuccess) {
        this.confirmPayment(result.txnRef);
      }
    }
  }

  private confirmPayment(orderId: string): void {
    // Call API to confirm payment status
    // This could update the order status in backend
    const billId = parseInt(orderId, 10);
    if (!isNaN(billId)) {
      this.billService.confirmPurchase(billId).subscribe({
        next: () => {
          console.log('Payment confirmed for order:', orderId);
        },
        error: (err) => {
          console.error('Failed to confirm payment:', err);
        }
      });
    }
  }

  formatPayDate(): string {
    const result = this.paymentResult();
    if (!result?.payDate) return '';
    return this.vnpayService.formatPayDate(result.payDate);
  }

  formatAmount(): string {
    const result = this.paymentResult();
    if (!result) return '0';
    return result.amount.toLocaleString('vi-VN');
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  viewOrder(): void {
    const result = this.paymentResult();
    if (result?.txnRef) {
      this.router.navigate(['/order-detail'], {
        queryParams: { id: result.txnRef, isPayment: true }
      });
    }
  }

  goShopping(): void {
    this.router.navigate(['/']);
  }
}
