import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // Cấu hình HttpClient với DI Interceptors
    provideZoneChangeDetection({ eventCoalescing: true }), // Tối ưu change detection
    provideRouter(routes), // Cấu hình Router
    provideAnimations(), // Kích hoạt animations
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
};
