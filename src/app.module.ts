import { Module } from "@nestjs/common";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ProductModule } from "./modules/product/product.module";
import { R2Module } from "./modules/r2/r2.module";
import { CartModule } from "./modules/cart/cart.module";
import { SearchModule } from "./modules/search/search.module";
import { TransactionModule } from "./modules/transaction/transaction.module";

@Module({
	imports: [
		UsersModule,
		AuthModule,
		ProductModule,
		R2Module,
		CartModule,
		SearchModule,
		TransactionModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
