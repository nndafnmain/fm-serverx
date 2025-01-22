import { Controller, Get, Query } from "@nestjs/common";
import { SearchService } from "./search.service";

@Controller("api/products/search")
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get()
	async searchItems(
		@Query("searchTerm") searchTerm: string,
		@Query("page") page: number = 1,
		@Query("limit") limit: number = 5,
	) {
		return this.searchService.searchItems(
			searchTerm,
			Number(page),
			Number(limit),
		);
	}
}
