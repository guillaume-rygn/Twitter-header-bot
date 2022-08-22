import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { BannerFileNotFoundError } from '../errors';

@Injectable()
export class BannerService {
  private readonly _roundedCorners = Buffer.from(
    `
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50"/>
        </svg>`,
  );

  async composeProfile(profileImage: Buffer): Promise<Buffer> {
    return await sharp(profileImage)
      .resize(100, 100)
      .composite([
        {
          input: this._roundedCorners,
          blend: 'dest-in',
        },
      ])
      .png()
      .toBuffer();
  }

  async getBannerBufferFromFile(): Promise<Buffer> {
    const bannerPath = path.join(__dirname, '../assets/twitter-banner.png');
    if (!fs.existsSync(bannerPath)) {
      throw new BannerFileNotFoundError();
    }

    const bannerBuffer = Buffer.from(fs.readFileSync(bannerPath));
    return await sharp(bannerBuffer).resize(1500, 500).toBuffer();
  }

  async generateBanner(
    bannerBuffer: Buffer,
    profileImageBuffers: Buffer[],
  ): Promise<Buffer> {
    const overlayOptions: sharp.OverlayOptions[] = [];
    for (const [index, profileImage] of profileImageBuffers.entries()) {
      const roundedProfileImage = await this.composeProfile(profileImage);
      overlayOptions.push({
        input: roundedProfileImage,
        top: 50 + index * 150,
        left: 1350,
      });
    }

    return await sharp(bannerBuffer).composite(overlayOptions).toBuffer();
  }
}
