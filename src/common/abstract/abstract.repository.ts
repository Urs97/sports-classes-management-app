/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * Abstract repository class.
 */
@Injectable()
export abstract class AbstractRepository<T extends ObjectLiteral> {
  protected constructor(protected readonly entity: Repository<T>) {}

  async create(entity: DeepPartial<T>): Promise<T> {
    const data = this.entity.create(entity);
    return this.entity.save(data);
  }

  createWithoutSave(entity: DeepPartial<T>): T {
    return this.entity.create(entity);
  }

  async createMany(entities: DeepPartial<T>[]): Promise<T[]> {
    const data = this.entity.create(entities);
    return this.entity.save(data);
  }

  async findOne(where: FindOneOptions<T>): Promise<T | null> {
    return this.entity.findOne(where);
  }

  async findMany(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.entity.findBy(where);
  }

  async findAndCount(where: FindManyOptions<T>): Promise<[T[], number]> {
    return this.entity.findAndCount(where);
  }

  async save(entity: DeepPartial<T>): Promise<DeepPartial<T>> {
    return this.entity.save(entity);
  }

  async updateOne(
    criteria: any,
    entity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return this.entity.update(criteria, entity);
  }

  async updateMany(entities: DeepPartial<T>[]): Promise<T[]> {
    return this.entity.save(entities);
  }

  async delete(criteria: FindOptionsWhere<T>): Promise<DeleteResult> {
    return this.entity.delete(criteria);
  }

  async deleteMany(criteria: number[] | string[]): Promise<DeleteResult> {
    return this.entity.delete(criteria);
  }
}
