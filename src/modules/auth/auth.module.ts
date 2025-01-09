import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "src/common/strategy/auth/jwt.strategy";
import { UsersModule } from "src/modules/users/users.module";
import { LocalStrategy } from "../../common/strategy/auth/local.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: "FIRZA12345",
			signOptions: { expiresIn: "60s" },
		}),
	],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
