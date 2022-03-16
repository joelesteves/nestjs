import { Controller, Post, Get, Body, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { User } from './interfaces/user.interfaces';
import { UserDto } from './dtos/user.dtos';

@Controller('users')
export class UsersController implements OnModuleInit {

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'user-costumer',
        allowAutoTopicCreation: true
      }
    }
  })

  private client: ClientKafka;

  async onModuleInit() {
    const requestPatters = [
      'find-all-user',
      'create-user'
    ];

    requestPatters.forEach(async pattern => {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect()
    })

  }  

    @Get()
      index(): Observable<User[]> {
        return this.client.send('find-all-user', {});
    }

  @Post()
  @ApiBody({ type: UserDto })
     create(@Body() user: UserDto): Observable<User> {
      return this.client.send('create-user', user);
  }
}
