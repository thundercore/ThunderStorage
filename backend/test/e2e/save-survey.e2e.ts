import { Test } from '@nestjs/testing'
import { RouterModule } from 'nest-router'
import { routes } from '../../src/routes'
import { V1Module } from '../../src/modules/v1/v1.module'
import { APP_FILTER, NestApplication } from '@nestjs/core'
import { GeneralExceptionFilter } from '../../src/errors/exception.filter'
import * as request from 'supertest'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from '../../src/config'

describe('Save Survey e2e', () => {
  let app: NestApplication
  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [
        RouterModule.forRoutes(routes),
        V1Module,
        TypeOrmModule.forRoot(config.postgres[0])
      ],
      providers: [
        {
          provide: APP_FILTER,
          useClass: GeneralExceptionFilter
        }
      ]
    }).compile()
    app = testingModule.createNestApplication()
    await app.init()
  })

  it('returns a 404 for routes that do not exist', done => {
    request(app.getHttpServer())
      .get('/doesnotexist')
      .expect(404)
      .end(done)
  })

  it('returns a 404 for data that do not exist', done => {
    request(app.getHttpServer())
      .get('/api/v1/data/nope')
      .expect(404)
      .end(done)
  })

  afterAll(async () => {
    await app.close()
  })
})
