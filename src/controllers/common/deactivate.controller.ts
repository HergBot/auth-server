import { SchemaUpdate, Table } from "musqrat";

import { ILogger } from "../../lib/logger";
import BaseController from "./base.controller";

class DeactivateController<
  Schema,
  PrimaryKey extends keyof Schema,
  DeactivateKey extends keyof Schema
> extends BaseController<Schema, PrimaryKey> {
  protected _deactivatedField: DeactivateKey;

  constructor(
    logger: ILogger,
    table: Table<Schema, PrimaryKey>,
    idField: PrimaryKey,
    deactivatedField: DeactivateKey
  ) {
    super(logger, table, idField);
    this._deactivatedField = deactivatedField;
  }

  public async deactivate(
    id: Schema[PrimaryKey],
    value: Schema[DeactivateKey]
  ): Promise<Partial<Schema> | null | undefined> {
    return this.updateSchema(
      id,
      { [this._deactivatedField]: value } as unknown as SchemaUpdate<
        Schema,
        PrimaryKey
      >,
      "deactivate"
    );
  }
}

export default DeactivateController;
