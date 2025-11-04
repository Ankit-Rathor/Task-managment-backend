import { Controller } from '@nestjs/common';
import { TaskService } from './task.service';
import { Body, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('task')
export class TaskController {
	constructor(private readonly taskService: TaskService) { }

	@Post()
	create(@Body() dto: CreateTaskDto) {
		return this.taskService.create(dto);
	}

	@Get()
	findAll() {
		return this.taskService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.taskService.findOne(id);
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() dto: Partial<CreateTaskDto>) {
		return this.taskService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.taskService.remove(id);
	}
}
