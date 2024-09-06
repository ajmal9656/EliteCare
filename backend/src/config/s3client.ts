import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';
import * as crypto from 'crypto';
dotenv.config();

export class S3Service {
    private s3: S3Client;
    private bucketName: string;

    constructor() {
        const bucketName = process.env.BUCKET_NAME!;
        const bucketRegion = process.env.BUCKET_REGION!;
        const accessKeyId = process.env.ACCESS_KEY!;
        const secretAccessKey = process.env.SECRET_ACCESS_KEY!;

        if (!bucketName || !bucketRegion || !accessKeyId || !secretAccessKey) {
            throw new Error("Missing required environment variables for AWS S3.");
        }

        this.bucketName = bucketName;

        this.s3 = new S3Client({
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            region: bucketRegion,
        });
    }

    async uploadFile(folderPath:string, file:any) {
        const uniqueName = crypto.randomBytes(16).toString('hex') + '-' + file.originalname;
        const params = {
            Bucket: this.bucketName,
            Key: `${folderPath}${uniqueName}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        try {
            const command = new PutObjectCommand(params);
            const data = await this.s3.send(command);
            console.log(`File uploaded successfully at `);
            return uniqueName;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }

    async getFile(key: string) {
        const params = {
            Bucket: this.bucketName,
            Key: key,
        };

        try {
            const command = new GetObjectCommand(params);
            const data = await this.s3.send(command);
            return data.Body; 
        } catch (error) {
            console.error("Error getting file:", error);
            throw error;
        }
    }

    async deleteFile(key: string) {
        const params = {
            Bucket: this.bucketName,
            Key: key,
        };

        try {
            const command = new DeleteObjectCommand(params);
            const data = await this.s3.send(command);
            console.log(`File deleted successfully from ${key}`);
            return data;
        } catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    }

    // Method to generate a signed URL for a file
    async getSignedUrl(key: string, expiresIn: number = 60 * 60) {
        const params = {
            Bucket: this.bucketName,
            Key: key,
        };

        try {
            const command = new GetObjectCommand(params);
            const url = await getSignedUrl(this.s3, command, { expiresIn });
            console.log(`Signed URL generated: ${url}`);
            return url;
        } catch (error) {
            console.error("Error generating signed URL:", error);
            throw error;
        }
    }}