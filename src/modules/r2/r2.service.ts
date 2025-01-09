import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { v4 } from "uuid";

@Injectable()
export class R2Service {
	private readonly s3Client: S3Client;

	constructor() {
		this.s3Client = new S3Client({
			region: "apac",
			endpoint: process.env.R2_ENDPOINT,
			credentials: {
				accessKeyId: process.env.R2_ACCESS_KEY,
				secretAccessKey: process.env.R2_SECRET_ACCESS,
			},
		});
	}

	async uploadFile(file: Express.Multer.File, bucketName: string) {
		const fileKey = `${v4}-${file.originalname}`;
		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: fileKey,
			Body: file.buffer,
			ContentType: file.mimetype,
		});
		await this.s3Client.send(command);
		return `https://${bucketName}.r2.cloudflarestorage.com/${fileKey}`;
	}
}
