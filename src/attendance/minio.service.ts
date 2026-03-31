import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  // Inisialisasi koneksi ke MinIO
  private readonly minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9100, // Port API yang kamu buat di Docker
    useSSL: false,
    accessKey: 'admin',
    secretKey: 'password123',
  });

  private readonly bucketName = 'absensi';

  async uploadBase64(base64String: string, fileName: string): Promise<string> {
    try {
      // 1. Bersihkan prefix Base64 (data:image/jpeg;base64,...)
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // 2. Upload ke MinIO
      // Argumen: bucket, nama_file, buffer, ukuran, metadata
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        buffer,
        buffer.length, // Ini penting biar gak merah!
        { 'Content-Type': 'image/jpeg' }
      );

      // 3. Return URL agar bisa diakses React
      return `http://localhost:9100/${this.bucketName}/${fileName}`;
    } catch (error) {
      console.error('MinIO Upload Error:', error);
      throw new InternalServerErrorException('Gagal upload foto ke storage');
    }
  }
}