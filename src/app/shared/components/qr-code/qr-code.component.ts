import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { QR_CODE_DEFAULTS } from '../../../constants/qr-code.constants';
import { QrCodeMatrix, QrErrorCorrectionLevel } from '../../../constants/qr-code.types';
import { encodeQrCode } from '../../../utility/qr-code.encoder';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.scss'
})
export class QrCodeComponent {
  readonly value = input<string>('');

  readonly size = input<number>(QR_CODE_DEFAULTS.sizePx);

  readonly errorCorrectionLevel = input<QrErrorCorrectionLevel>(QR_CODE_DEFAULTS.errorCorrectionLevel);

  readonly quietZone = input<number>(QR_CODE_DEFAULTS.quietZoneModules);

  readonly darkColor = input<string>(QR_CODE_DEFAULTS.darkColor);

  readonly lightColor = input<string>(QR_CODE_DEFAULTS.lightColor);

  readonly unavailableMessage = input<string>(QR_CODE_DEFAULTS.unavailableMessage);

  readonly description = input<string>('');

  private readonly matrix = computed<QrCodeMatrix | null>(() =>
    encodeQrCode(this.value(), this.errorCorrectionLevel())
  );

  readonly canRender = computed<boolean>(() => this.matrix() !== null);

  readonly canvasSize = computed<number>(() => {
    const matrix = this.matrix();
    return matrix === null ? 0 : matrix.length + this.quietZone() * 2;
  });

  readonly viewBox = computed<string>(() => `0 0 ${this.canvasSize()} ${this.canvasSize()}`);

  readonly modulePath = computed<string>(() => this.buildModulePath());

  readonly accessibleLabel = computed<string>(() => {
    const description = this.description().trim();
    return description.length > 0 ? description : `QR code for ${this.value()}`;
  });

  private buildModulePath(): string {
    const matrix = this.matrix();
    if (matrix === null) {
      return '';
    }

    const offset = this.quietZone();
    const pathSegments: string[] = [];

    matrix.forEach((row, rowIndex) => {
      row.forEach((isDarkModule, columnIndex) => {
        if (isDarkModule) {
          pathSegments.push(`M${columnIndex + offset} ${rowIndex + offset}h1v1h-1z`);
        }
      });
    });

    return pathSegments.join('');
  }
}
