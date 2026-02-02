import { Component, OnInit, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
  VnpayBank,
  VnpayPaymentRequest,
  VNPAY_BANKS
} from '../../@core/models/vnpay.model';
import { VnpayService } from '../../@services/vnpay.service';
import * as QRCode from 'qrcode';

export type PaymentType = 'card' | 'qr';

@Component({
  selector: 'app-vnpay-mock',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ProgressSpinnerModule
  ],
  templateUrl: './vnpay-mock.component.html',
  styleUrl: './vnpay-mock.component.scss'
})
export class VnpayMockComponent implements OnInit, OnDestroy {
  paymentInfo = signal<VnpayPaymentRequest | null>(null);
  banks = VNPAY_BANKS;
  selectedBank = signal<VnpayBank | null>(null);
  step = signal<'select-method' | 'select-bank' | 'enter-card' | 'processing' | 'otp' | 'qr-scan' | 'qr-waiting'>('select-method');
  paymentType = signal<PaymentType>('card');
  cardNumber = signal('');
  cardHolder = signal('');
  expiryDate = signal('');
  otp = signal('');
  isProcessing = signal(false);
  qrDataUrl = signal<string>('');
  qrCountdown = signal(300); // 5 minutes countdown
  waitingForScan = signal(false);
  private countdownInterval: any;
  private scanSimulationTimeout: any;

  displayAmount = computed(() => {
    const info = this.paymentInfo();
    if (!info) return '0';
    return (info.vnp_Amount / 100).toLocaleString('vi-VN');
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vnpayService: VnpayService
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    if (params['vnp_TxnRef']) {
      this.paymentInfo.set({
        vnp_Version: params['vnp_Version'] || '2.1.0',
        vnp_Command: params['vnp_Command'] || 'pay',
        vnp_TmnCode: params['vnp_TmnCode'] || '',
        vnp_Amount: parseInt(params['vnp_Amount'], 10) || 0,
        vnp_CreateDate: params['vnp_CreateDate'] || '',
        vnp_CurrCode: params['vnp_CurrCode'] || 'VND',
        vnp_IpAddr: params['vnp_IpAddr'] || '',
        vnp_Locale: params['vnp_Locale'] || 'vn',
        vnp_OrderInfo: decodeURIComponent(params['vnp_OrderInfo'] || ''),
        vnp_OrderType: params['vnp_OrderType'] || '',
        vnp_ReturnUrl: decodeURIComponent(params['vnp_ReturnUrl'] || ''),
        vnp_TxnRef: params['vnp_TxnRef'] || '',
        vnp_SecureHash: params['vnp_SecureHash'] || ''
      });
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private clearTimers(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.scanSimulationTimeout) {
      clearTimeout(this.scanSimulationTimeout);
    }
  }

  // Select payment method
  selectPaymentType(type: PaymentType): void {
    this.paymentType.set(type);
    if (type === 'card') {
      this.step.set('select-bank');
    } else {
      this.step.set('qr-scan');
      this.generateQRCode();
      this.startCountdown();
      this.startScanSimulation();
    }
  }

  goBackToSelectMethod(): void {
    this.step.set('select-method');
    this.selectedBank.set(null);
    this.clearTimers();
  }

  selectBank(bank: VnpayBank): void {
    this.selectedBank.set(bank);
    this.step.set('enter-card');
  }

  goBackToSelectBank(): void {
    this.selectedBank.set(null);
    this.step.set('select-bank');
  }

  submitCardInfo(): void {
    // Validate card info
    if (!this.cardNumber() || !this.cardHolder()) {
      return;
    }
    this.step.set('otp');
  }

  confirmOtp(): void {
    // Validate OTP
    if (this.otp().length < 4) {
      return;
    }
    // Process as success
    this.processPayment(true, '00');
  }

  // QR Code methods
  async generateQRCode(): Promise<void> {
    const info = this.paymentInfo();
    if (!info) return;

    // Create VNPay-QR compatible data
    const qrData = JSON.stringify({
      type: 'VNPAY-QR',
      merchantCode: info.vnp_TmnCode,
      orderId: info.vnp_TxnRef,
      amount: info.vnp_Amount / 100,
      orderInfo: info.vnp_OrderInfo,
      timestamp: new Date().toISOString()
    });

    try {
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 280,
        margin: 2,
        color: {
          dark: '#005baa',
          light: '#ffffff'
        }
      });
      this.qrDataUrl.set(dataUrl);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  }

  startCountdown(): void {
    this.qrCountdown.set(300);
    this.countdownInterval = setInterval(() => {
      const current = this.qrCountdown();
      if (current <= 0) {
        this.clearTimers();
        // Timeout - redirect with error
        this.processPayment(false, '11');
      } else {
        this.qrCountdown.set(current - 1);
      }
    }, 1000);
  }

  // Simulate QR being scanned after random 25-35 seconds (realistic user behavior)
  startScanSimulation(): void {
    const randomDelay = 25000 + Math.random() * 10000; // 25-35 seconds
    this.scanSimulationTimeout = setTimeout(() => {
      this.waitingForScan.set(true);
      this.step.set('qr-waiting');
      
      // After "confirming" on phone, process payment
      setTimeout(() => {
        this.processPayment(true, '00');
      }, 3000);
    }, randomDelay);
  }

  formatCountdown(): string {
    const seconds = this.qrCountdown();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  processPayment(success: boolean, responseCode: string = '00'): void {
    this.clearTimers();
    this.isProcessing.set(true);
    this.step.set('processing');

    // Simulate processing delay
    setTimeout(() => {
      this.redirectToReturn(success, responseCode);
    }, 2000);
  }

  cancelPayment(): void {
    this.clearTimers();
    this.redirectToReturn(false, '24'); // Code 24 = User cancelled
  }

  private redirectToReturn(success: boolean, responseCode: string): void {
    const info = this.paymentInfo();
    const bank = this.selectedBank();

    if (!info) {
      this.router.navigate(['/']);
      return;
    }

    const now = new Date();
    const payDate = this.formatVnpayDate(now);

    const returnParams: Record<string, string> = {
      vnp_Amount: info.vnp_Amount.toString(),
      vnp_BankCode: this.paymentType() === 'qr' ? 'VNPAYQR' : (bank?.code || 'NCB'),
      vnp_BankTranNo: success ? this.vnpayService.generateBankTranNo() : '',
      vnp_CardType: this.paymentType() === 'qr' ? 'QRCODE' : 'ATM',
      vnp_OrderInfo: encodeURIComponent(info.vnp_OrderInfo),
      vnp_PayDate: payDate,
      vnp_ResponseCode: responseCode,
      vnp_TmnCode: info.vnp_TmnCode,
      vnp_TransactionNo: success ? this.vnpayService.generateTransactionNo() : '',
      vnp_TransactionStatus: responseCode,
      vnp_TxnRef: info.vnp_TxnRef,
      vnp_SecureHash: 'MOCK_HASH_' + Math.random().toString(36).substring(2)
    };

    const queryString = Object.entries(returnParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Navigate to return URL
    this.router.navigateByUrl('/vnpay-return?' + queryString);
  }

  private formatVnpayDate(date: Date): string {
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
}
