import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client'; // ✅ enum from Prisma
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard'; // ✅ don’t forget this
import { BadRequestException } from '@nestjs/common';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // ✅ Public route: Register user
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  // ✅ Protected route: Only ADMIN can view all users

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // ✅ Protected route: Any logged-in user can view one user
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  // ✅ Protected route: Allow only ADMIN to update users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  // ✅ Protected route: Allow only ADMIN to delete users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.userService.validateUser(body.email, body.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role !== 'ADMIN' && user.role !== 'USER') {
      throw new ForbiddenException('Access denied');
    }

    const response = await this.userService.generateToken(user);
    console.log('🔥 Login response from backend:', response); // 👈 add this
    return response;
  }

  @Get('test-error')
  testError() {
    throw new BadRequestException('This is a test error!');
  }
}
