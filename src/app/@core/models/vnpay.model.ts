export interface VnpayPaymentRequest {
  vnp_Version: string;
  vnp_Command: string;
  vnp_TmnCode: string;
  vnp_Amount: number;
  vnp_CreateDate: string;
  vnp_CurrCode: string;
  vnp_IpAddr: string;
  vnp_Locale: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_ReturnUrl: string;
  vnp_TxnRef: string;
  vnp_SecureHash?: string;
  vnp_BankCode?: string;
}

export interface VnpayResult {
  responseCode: string;
  transactionNo: string;
  amount: number;
  orderInfo: string;
  txnRef: string;
  bankCode: string;
  bankTranNo: string;
  cardType: string;
  payDate: string;
  isSuccess: boolean;
  message: string;
}

export interface VnpayBank {
  code: string;
  name: string;
  logo: string;
  shortName: string;
  color: string;
}

export const VNPAY_RESPONSE_CODES: Record<string, string> = {
  '00': 'Giao dịch thành công',
  '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)',
  '09': 'Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng',
  '10': 'Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
  '11': 'Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch',
  '12': 'Thẻ/Tài khoản của khách hàng bị khóa',
  '13': 'Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)',
  '24': 'Khách hàng hủy giao dịch',
  '51': 'Tài khoản của quý khách không đủ số dư để thực hiện giao dịch',
  '65': 'Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày',
  '75': 'Ngân hàng thanh toán đang bảo trì',
  '79': 'KH nhập sai mật khẩu thanh toán quá số lần quy định',
  '99': 'Lỗi không xác định'
};

// Using reliable CDN sources for bank logos
export const VNPAY_BANKS: VnpayBank[] = [
  { code: 'NCB', name: 'Ngân hàng TMCP Quốc Dân', shortName: 'NCB', logo: 'https://api.vietqr.io/img/NCB.png', color: '#1a4789' },
  { code: 'VIETCOMBANK', name: 'Ngân hàng TMCP Ngoại Thương Việt Nam', shortName: 'Vietcombank', logo: 'https://api.vietqr.io/img/VCB.png', color: '#00633a' },
  { code: 'VIETINBANK', name: 'Ngân hàng TMCP Công Thương Việt Nam', shortName: 'VietinBank', logo: 'https://api.vietqr.io/img/ICB.png', color: '#00367d' },
  { code: 'BIDV', name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', shortName: 'BIDV', logo: 'https://api.vietqr.io/img/BIDV.png', color: '#00559a' },
  { code: 'AGRIBANK', name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn', shortName: 'Agribank', logo: 'https://api.vietqr.io/img/VBA.png', color: '#d32f2f' },
  { code: 'SACOMBANK', name: 'Ngân hàng TMCP Sài Gòn Thương Tín', shortName: 'Sacombank', logo: 'https://api.vietqr.io/img/STB.png', color: '#0066b3' },
  { code: 'TECHCOMBANK', name: 'Ngân hàng TMCP Kỹ Thương Việt Nam', shortName: 'Techcombank', logo: 'https://api.vietqr.io/img/TCB.png', color: '#e31e24' },
  { code: 'MBBANK', name: 'Ngân hàng TMCP Quân Đội', shortName: 'MB Bank', logo: 'https://api.vietqr.io/img/MB.png', color: '#0d4da1' },
  { code: 'VPBANK', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng', shortName: 'VPBank', logo: 'https://api.vietqr.io/img/VPB.png', color: '#00653e' },
  { code: 'TPBANK', name: 'Ngân hàng TMCP Tiên Phong', shortName: 'TPBank', logo: 'https://api.vietqr.io/img/TPB.png', color: '#7b2d8e' },
  { code: 'ACB', name: 'Ngân hàng TMCP Á Châu', shortName: 'ACB', logo: 'https://api.vietqr.io/img/ACB.png', color: '#1a4288' },
  { code: 'HDBANK', name: 'Ngân hàng TMCP Phát triển TP.HCM', shortName: 'HDBank', logo: 'https://api.vietqr.io/img/HDB.png', color: '#e31e24' }
];

export const VNPAY_CONFIG = {
  VERSION: '2.1.0',
  COMMAND: 'pay',
  TMN_CODE: 'DEMO_MOCK',
  CURR_CODE: 'VND',
  LOCALE: 'vn',
  ORDER_TYPE: 'other'
};

// VNPay logo URL
export const VNPAY_LOGO = 'https://vnpay.vn/wp-content/uploads/2024/05/VNPAY-Logo-01.webp';
