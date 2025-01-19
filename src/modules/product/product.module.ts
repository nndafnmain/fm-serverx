import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { PrismaModule } from "src/prisma/prisma.module";
import { R2Module } from "../r2/r2.module";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
	imports: [
		R2Module,
		PrismaModule,
		MulterModule.register({
			storage: memoryStorage(),
		}),
	],
	controllers: [ProductController],
	providers: [ProductService],
})
export class ProductModule {}
