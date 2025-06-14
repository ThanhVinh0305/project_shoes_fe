import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { PreloadAllModules, PreloadingStrategy, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { GlobalHttpInterceptor } from './@core/interceptors/http.intercepter';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { ImportModule } from './@themes/import.theme';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules), withInMemoryScrolling({
      scrollPositionRestoration: 'top'
    })),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([GlobalHttpInterceptor])),
    importProvidersFrom([BrowserAnimationsModule]),
    MessageService,
    ToastModule,
    DialogService
  ]
};
