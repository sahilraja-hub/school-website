import crypto from 'crypto';
import { config } from '../config';

export interface StorageDescriptor {
  storageType: 'PUBLIC_CDN' | 'PRIVATE_ENCRYPTED';
  bucketName: string;
  key: string;
  publicUrl: string;
  isPrivate: boolean;
}

export class MediaStorageService {
  private readonly publicCdnBase: string = 'https://cdn.oakridge.edu/media';
  private readonly privateStorageBase: string = '/storage/vault/private-media';
  private readonly signingSecret: string =
    process.env.STORAGE_SIGNING_SECRET || 'oakridge-media-secure-key-99824';

  /**
   * Determine storage target based on privacy classification.
   * Public media uses CDN distribution; sensitive files use encrypted private storage.
   */
  public allocateStorage(fileName: string, isPrivate: boolean): StorageDescriptor {
    if (isPrivate) {
      return {
        storageType: 'PRIVATE_ENCRYPTED',
        bucketName: 'oakridge-confidential-storage',
        key: `private/${fileName}`,
        publicUrl: `/api/v1/media/secure-stream/${fileName}`,
        isPrivate: true,
      };
    }

    return {
      storageType: 'PUBLIC_CDN',
      bucketName: 'oakridge-public-media-cdn',
      key: `public/${fileName}`,
      publicUrl: `${this.publicCdnBase}/${fileName}`,
      isPrivate: false,
    };
  }

  /**
   * Generates a time-limited cryptographically signed URL for accessing private media.
   */
  public generateSignedAccessUrl(mediaId: string, expiresInSeconds: number = 3600): {
    signedUrl: string;
    expiresAt: string;
  } {
    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const payload = `${mediaId}:${expires}`;
    const signature = crypto
      .createHmac('sha256', this.signingSecret)
      .update(payload)
      .digest('hex');

    const signedUrl = `/api/v1/media/secure/${mediaId}?sig=${signature}&exp=${expires}`;
    return {
      signedUrl,
      expiresAt: new Date(expires * 1000).toISOString(),
    };
  }

  /**
   * Verifies the cryptographic signature and expiration of a signed media request.
   */
  public verifySignedAccess(mediaId: string, signature: string, expires: number): boolean {
    if (!signature || !expires) return false;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (now > expires) {
      return false;
    }

    const payload = `${mediaId}:${expires}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.signingSecret)
      .update(payload)
      .digest('hex');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch {
      return false;
    }
  }

  /**
   * Sanitizes media payloads before returning to client, ensuring no storage credentials
   * (e.g. AWS access keys, private bucket keys, connection strings) are ever exposed.
   */
  public sanitizeStorageCredentials<T extends Record<string, any>>(data: T): T {
    const forbiddenKeys = [
      'storageSecret',
      'awsAccessKey',
      'awsSecretKey',
      'bucketSecret',
      'apiKey',
      'secretAccessKey',
      'connectionString',
    ];

    const copy = { ...data };
    for (const key of forbiddenKeys) {
      delete (copy as any)[key];
    }
    return copy;
  }
}

export const mediaStorageService = new MediaStorageService();
