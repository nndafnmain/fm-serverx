import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { R2Service } from "../r2/r2.service";
import { PrismaService } from "src/prisma/prisma.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductService } from "./product.service";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Controller()
export class ProductController {
	constructor(
		private readonly r2Service: R2Service,
		private readonly prisma: PrismaService,
		private readonly productService: ProductService,
	) {}

	@Post("api/product/upload")
	@UseInterceptors(FilesInterceptor("files", 5))
	async uploadProduct(
		@UploadedFiles() files: Express.Multer.File[],
		@Body() data: CreateProductDto,
	) {
		console.log("Received data:", data);
		console.log("Uploaded files:", files);
		if (!files || files.length === 0) {
			throw new BadRequestException("No files uploaded.");
		}

		const createdProduct = await this.prisma.$transaction(async (tx) => {
			// biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
			if (isNaN(data.price))
				throw new BadRequestException("Invalid price format.");
			const product = await tx.product.create({
				data: {
					...data,
					price: Number(data.price),
					weight: Number(data.weight),
					stock: Number(data.stock),
				},
				select: {
					id: true,
					productName: true,
					productImages: true,
				},
			});

			// const fileNames = await Promise.all(
			// 	files.map((file) => this.r2Service.uploadFile(file, product.id)),
			// );
			const fileNames = await Promise.all(
				files.map(async (file) => {
					try {
						return await this.r2Service.uploadFile(file, product.id);
					} catch (error) {
						console.error("File upload error:", error);
						throw new BadRequestException("File upload failed.");
					}
				}),
			);

			await tx.productImage.createMany({
				data: fileNames.map((fileName) => ({
					imageUrl: fileName,
					productId: product.id,
				})),
			});

			return product;
		});

		return createdProduct;
	}

	@Get("api/products")
	async getProducts(@Query() paginationDto: PaginationDto) {
		return await this.productService.getProducts(paginationDto);
	}

	@Get("api/product/:id")
	async getProduct(@Param("id") id: number) {
		return await this.productService.getProduct({ id: Number(id) });
	}
}
