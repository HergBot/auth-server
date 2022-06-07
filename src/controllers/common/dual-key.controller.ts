import { isNil } from "lodash";
import { getUpdates, SchemaUpdate, Table, WhereClause } from "musqrat";

import { ILogger } from "../../lib/logger";

class DualKeyController<
  Schema,
  PrimaryKeyOne extends keyof Schema,
  PrimaryKeyTwo extends keyof Schema
> {
  protected _idFieldOne: PrimaryKeyOne;
  protected _idFieldTwo: PrimaryKeyTwo;
  protected _logger: ILogger;
  protected _table: Table<Schema, PrimaryKeyOne | PrimaryKeyTwo>;

  constructor(
    logger: ILogger,
    table: Table<Schema>,
    idFieldOne: PrimaryKeyOne,
    idFieldTwo: PrimaryKeyTwo
  ) {
    this._logger = logger;
    this._table = table;
    this._idFieldOne = idFieldOne;
    this._idFieldTwo = idFieldTwo;
  }

  public async create(newValue: Schema): Promise<Schema | null | undefined> {
    try {
      const result = await this._table.insert(newValue).exec();
      return this.getSingleResult(result);
    } catch (err) {
      this._logger.error(`Failed to create ${this._table.name}`, "create");
      this._logger.debug(
        `${this._table.name}: ${JSON.stringify(newValue)}`,
        "create"
      );
      this._logger.exception(err, "create");
      return undefined;
    }
  }

  public async find(
    idOne: Schema[PrimaryKeyOne],
    idTwo: Schema[PrimaryKeyTwo]
  ): Promise<Schema | null | undefined> {
    try {
      const result = await this._table
        .select()
        .where({
          AND: [
            {
              field: this._idFieldOne,
              operator: "=",
              value: idOne,
            } as WhereClause<Schema>,
            {
              field: this._idFieldTwo,
              operator: "=",
              value: idTwo,
            } as WhereClause<Schema>,
          ],
        })
        .exec();
      return this.getSingleResult(result);
    } catch (err) {
      this._logger.error(`Failed to find ${this._table.name}`, "find");
      this._logger.debug(
        `${this._idFieldOne}: ${idOne}, ${this._idFieldTwo}: ${idTwo}`,
        "find"
      );
      this._logger.exception(err, "find");
      return undefined;
    }
  }

  public async query(): Promise<Array<Schema> | undefined> {
    try {
      const result = await this._table.select().exec();
      return result;
    } catch (err) {
      this._logger.error(`Failed to query ${this._table.name}`, "query");
      //this._logger.debug(`Query: ${}`, "query");
      this._logger.exception(err, "query");
      return undefined;
    }
  }

  public async update(
    idOne: Schema[PrimaryKeyOne],
    idTwo: Schema[PrimaryKeyTwo],
    modified: SchemaUpdate<Schema, PrimaryKeyOne | PrimaryKeyTwo>
  ): Promise<Schema | null | undefined> {
    return this.updateSchema(idOne, idTwo, modified, "update");
  }

  protected async updateSchema(
    idOne: Schema[PrimaryKeyOne],
    idTwo: Schema[PrimaryKeyTwo],
    modified: SchemaUpdate<Schema, PrimaryKeyOne | PrimaryKeyTwo>,
    method: string
  ): Promise<Schema | null | undefined> {
    const updates = getUpdates(modified);
    if (isNil(updates)) {
      this._logger.warning(
        `Attempted to ${method} a ${this._table.name} with no valid updates`,
        method
      );
      this._logger.debug(
        `${this._idFieldOne}: ${idOne}, ${
          this._idFieldTwo
        }: ${idTwo}, modified: ${JSON.stringify(modified)}`,
        method
      );
      return null;
    }
    try {
      const updated = await this._table
        .update(updates)
        .where({
          AND: [
            {
              field: this._idFieldOne,
              operator: "=",
              value: idOne,
            } as WhereClause<Schema>,
            {
              field: this._idFieldTwo,
              operator: "=",
              value: idTwo,
            } as WhereClause<Schema>,
          ],
        })
        .exec();
      const result = this.getSingleResult(updated);
      if (isNil(result)) {
        this._logger.warning(
          `Attempted to ${method} a ${this._table.name} but no updates were made`,
          method
        );
        this._logger.debug(
          `${this._idFieldOne}: ${idOne}, ${
            this._idFieldTwo
          }: ${idTwo}, modified: ${JSON.stringify(modified)}`,
          method
        );
      }
      return result;
    } catch (err) {
      this._logger.error(`Failed to ${method} ${this._table.name}`, method);
      this._logger.debug(
        `${this._idFieldOne}: ${idOne}, ${
          this._idFieldTwo
        }: ${idTwo}, modified: ${JSON.stringify(
          modified
        )}, updates: ${JSON.stringify(updates)}`,
        method
      );
      this._logger.exception(err, method);
      return undefined;
    }
  }

  private getSingleResult(result: Schema[]): Schema | null {
    return result.length > 0 ? result[0] : null;
  }
}

export default DualKeyController;
