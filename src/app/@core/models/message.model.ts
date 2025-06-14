export interface MessageModel {
  severity?: 'success' | 'warning' | 'info' | 'error';
  summary?: 'Success' | 'Warn' | 'Info' | 'Error';
  detail: string;
  life?: number;
  key?: string;
}
