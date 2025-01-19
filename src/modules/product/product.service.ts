import { Injectable, NotFoundException } from "@nestjs/common";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductService {
	constructor(private readonly prisma: PrismaService) {}

	async getProducts(paginationDto: PaginationDto) {
		const { limit, page } = paginationDto;
		const offset = (page - 1) * limit;

		const products = await this.prisma.product.findMany({
			skip: offset,
			take: limit,

			select: {
				id: true,
				productName: true,
				price: true,
				productImages: {
					take: 1,
					select: {
						imageUrl: true,
					},
				},
			},
		});

		const totalCount = await this.prisma.product.count();
		const totalPages = Math.ceil(totalCount / limit);

		return {
			data: products,
			totalCount,
			totalPages,
			currentPage: page,
		};
	}

	async getProduct({ id }) {
		const product = await this.prisma.product.findFirst({
			where: {
				id,
			},
			select: {
				id: true,
				productName: true,
				longDesc: true,
				description: true,
				color: true,
				type: true,
				stock: true,
				weight: true,
				price: true,
				productCategory: true,
				productImages: {
					select: {
						id: true,
						imageUrl: true,
					},
				},
			},
		});
		if (!product) throw new NotFoundException("Product doesnt exist!");
		return product;
	}
}
