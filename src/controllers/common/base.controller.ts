import { createBinaryUUID } from "binary-uuid";
import { isNil } from "lodash";
import { getUpdates, SchemaUpdate, Table } from "musqrat";

import { ILogger } from "../../lib/logger";

class BaseController<Schema, PrimaryKey extends keyof Schema> {
  protected _idField: PrimaryKey;
  protected _logger: ILogger;
  protected _table: Table<Schema, PrimaryKey>;

  constructor(
    logger: ILogger,
    table: Table<Schema, PrimaryKey>,
    idField: PrimaryKey
  ) {
    this._logger = logger;
    this._table = table;
    this._idField = idField;
  }

  public async create(
    newValue: Omit<Schema, PrimaryKey>
  ): Promise<Schema | null | undefined> {
    try {
      const newId: Schema[PrimaryKey] = createBinaryUUID().buffer as any;
      const insertValue = { ...newValue, [this._idField]: newId };
      const result = await this._table.insert(insertValue).exec();
      return result.affectedRows === 0
        ? null
        : (insertValue as unknown as Schema);
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
    id: Schema[PrimaryKey]
  ): Promise<Schema | null | undefined> {
    try {
      const result = await this._table
        .select()
        .where(this._idField, "=", id)
        .exec();
      return this.getSingleResult(result);
    } catch (err) {
      this._logger.error(`Failed to find ${this._table.name}`, "find");
      this._logger.debug(`${this.IdField}: ${id}`, "find");
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
    id: Schema[PrimaryKey],
    modified: SchemaUpdate<Schema, PrimaryKey>
  ): Promise<Partial<Schema> | null | undefined> {
    return this.updateSchema(id, modified, "update");
  }

  protected async updateSchema(
    id: Schema[PrimaryKey],
    modified: SchemaUpdate<Schema, PrimaryKey>,
    method: string
  ): Promise<Schema | null | undefined> {
    const updates = getUpdates(modified);
    if (isNil(updates)) {
      this._logger.warning(
        `Attempted to ${method} a ${this._table.name} with no valid updates`,
        method
      );
      this._logger.debug(
        `${this.IdField}: ${id}, modified: ${JSON.stringify(modified)}`,
        method
      );
      return null;
    }
    try {
      const result = await this._table
        .update(updates)
        .where(this._idField, "=", id)
        .exec();
      if (result.affectedRows === 0) {
        this._logger.warning(
          `Attempted to ${method} a ${this._table.name} but no updates were made`,
          method
        );
        this._logger.debug(
          `${this.IdField}: ${id}, modified: ${JSON.stringify(modified)}`,
          method
        );
      }
      return result.affectedRows === 0
        ? null
        : ({ [this._idField]: id, ...modified } as unknown as Schema);
    } catch (err) {
      this._logger.error(`Failed to ${method} ${this._table.name}`, method);
      this._logger.debug(
        `${this.IdField}: ${id}, modified: ${JSON.stringify(
          modified
        )}, updates: ${JSON.stringify(updates)}`,
        method
      );
      this._logger.exception(err, method);
      return undefined;
    }
  }

  protected getSingleResult(result: Schema[]): Schema | null {
    return result.length > 0 ? result[0] : null;
  }

  private get IdField(): string {
    return this._idField.toString();
  }
}

export default BaseController;
