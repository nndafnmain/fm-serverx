import { Injectable } from "@nestjs/common";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SearchService {
	constructor(private readonly prisma: PrismaService) {}

	async searchItems(searchTerm: string, page: number, limit: number) {
		const skip = (page - 1) * limit;
		const [data, totalCount] = await Promise.all([
			this.prisma.product.findMany({
				where: {
					OR: [
						{ productName: { contains: searchTerm, mode: "insensitive" } },
						{ description: { contains: searchTerm, mode: "insensitive" } },
					],
				},
				select: {
					id: true,
					productName: true,
					price: true,
					productImages: {
						select: {
							imageUrl: true,
						},
						take: 1,
					},
				},
				skip,
				take: limit,
			}),
			this.prisma.product.count({
				where: {
					OR: [
						{ productName: { contains: searchTerm, mode: "insensitive" } },
						{ description: { contains: searchTerm, mode: "insensitive" } },
					],
				},
			}),
		]);
		return {
			data,
			totalCount,
			totalPages: Math.ceil(totalCount / limit),
			currentPage: page,
		};
	}
}
