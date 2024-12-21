import pgp from "pg-promise";

export interface Connection {
  query(statement: string, params: any): Promise<any>;
  close(): Promise<void>;
}

export class PgPromiseAdapter implements Connection {
  private connection: any;

  constructor() {
    this.connection = pgp()(process.env.DATABASE_URL!); //Criar uma classe env para lidar com isso
  }

  async query(statement: string, params: any): Promise<any> {
    return await this.connection.query(statement, params);
  }

  async close(): Promise<void> {
    this.connection.$pool.end();
  }
}
