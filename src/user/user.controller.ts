import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  UseGuards
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto, GetUserDto, UpdateUserDto } from './dto'
import { Roles } from '~/common/decorators'
import { RolesGuard } from '~/common/guards'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: '添加用户' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  findAll(@Query() getUserDto: GetUserDto) {
    return this.userService.findAll(getUserDto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id)
  }

  @Roles('ADMIN')
  @Put(':id')
  @ApiOperation({ summary: '更新用户信息' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id)
  }
}
