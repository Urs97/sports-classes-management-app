import { InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

export abstract class AbstractTransaction<TInput, TOutput> {
  protected constructor(private readonly dataSource: DataSource) {}

  protected abstract execute(
    data: TInput,
    transactionalManager: EntityManager,
  ): Promise<TOutput>;

  /**
   * Creates a query runner for the transaction.
   */
  private createRunner(): QueryRunner {
    return this.dataSource.createQueryRunner();
  }

  /**
   * Runs transaction defined by execute method.
   * This method is called from the service, as a top-level transaction.
   *
   * @param data - Data to be passed to the transaction
   * @returns Result of the transaction
   */
  async run(data: TInput): Promise<TOutput> {
    const queryRunner = this.createRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.execute(data, queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Transaction failed: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Runs transaction defined by execute method.
   * This method is called from within another transaction, as a nested transaction.
   *
   * Transactional manager from the parent transaction must be passed as an argument.
   *
   * @param data - Data to be passed to the transaction
   * @param transactionalManager - Transactional manager from the parent transaction
   *
   * @returns Result of the transaction
   */
  async runWithinTransaction(
    data: TInput,
    transactionalManager: EntityManager,
  ): Promise<TOutput> {
    return this.execute(data, transactionalManager);
  }
}
