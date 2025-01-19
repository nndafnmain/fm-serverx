import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

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

	async uploadFile(
		file: Express.Multer.File,
		productId: number,
	): Promise<string> {
		if (!file || !file.buffer) {
			throw new Error("Invalid file: Buffer is undefined.");
		}

		const fileName = `${file.originalname}`;
		const fileKey = `product/${productId}/${fileName}`;

		console.log("Uploading file:", {
			originalname: file.originalname,
			size: file.size,
			mimetype: file.mimetype,
			destinationKey: fileKey,
		});

		try {
			const command = new PutObjectCommand({
				Bucket: "fm-server",
				Key: fileKey,
				Body: file.buffer,
				ContentType: file.mimetype,
			});

			await this.s3Client.send(command);
			console.log("File successfully uploaded to R2:", fileKey);

			return fileName;
		} catch (error) {
			console.error("Error uploading file to R2:", error);
			throw error;
		}
	}
}
