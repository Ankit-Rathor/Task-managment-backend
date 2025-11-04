import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,  // ✅ inject JwtService
        private readonly prisma: PrismaService
    ) { }
    // ✅ Register user
    async register(data: { username: string; email: string; password: string }) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: { ...data, password: hashedPassword },
        });
        return { message: 'User registered successfully', user };
    }

    // ✅ Login user
    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);

        return { access_token: token };
    }

    // ✅ Verify token
    async verifyToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
