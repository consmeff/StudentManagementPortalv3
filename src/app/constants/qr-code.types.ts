export type QrErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QrCodeMatrix = ReadonlyArray<ReadonlyArray<boolean>>;

export type QrBlockSpecification = {
  errorCorrectionCodewordsPerBlock: number;
  firstGroupBlockCount: number;
  firstGroupDataCodewords: number;
  secondGroupBlockCount: number;
  secondGroupDataCodewords: number;
};

export type QrVersionSpecification = Readonly<Record<QrErrorCorrectionLevel, QrBlockSpecification>>;
