import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { ContractData, NewContract } from "@/app/lib/definitions";

const ITEMS_PER_PAGE = 6;

class DatabaseService {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(process.cwd(), 'data.db');
    this.initializeDb(dbPath);
  }

  private initializeDb(dbPath: string) {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, '');
    }
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.createTables();
  }

  private createTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS contracts (
        address TEXT PRIMARY KEY NOT NULL,
        owner TEXT NOT NULL,
        currentAmount INTEGER NOT NULL DEFAULT 0 CHECK(currentAmount >= 0),
        type TEXT NOT NULL CHECK(type IN ('money', 'time')),
        targetAmount INTEGER,
        unlockTimestamp TEXT
      );
  
      -- Create indexes for better query performance
      CREATE INDEX IF NOT EXISTS idx_contracts_owner ON contracts(owner);
    `);
  }

  getAllContracts(): ContractData[] {
    const stmt = this.db.prepare('SELECT * FROM contracts');
    return stmt.all() as ContractData[];
  }

  async getFilteredContracts(
    owner: string, 
    query: string, 
    currentPage: number
  ) {
    // limited to owner's contracts
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const likeTerm = `%${query}%`;
    const stmt = this.db.prepare(`
      SELECT
        contracts.address,
        contracts.currentAmount,
        contracts.type,
        contracts.unlockTimestamp,
        contracts.targetAmount
      FROM contracts
      WHERE
        contracts.owner = ? AND 
        (
          contracts.address LIKE ? OR
          CAST(contracts.targetAmount AS TEXT) LIKE ? OR
          CAST(contracts.currentAmount AS TEXT) LIKE ? OR
          contracts.type LIKE ?
        )
      ORDER BY contracts.address DESC
      LIMIT ? OFFSET ?
    `);
    const params = [
      owner, likeTerm, likeTerm, 
      likeTerm, likeTerm,
      ITEMS_PER_PAGE, offset
    ]
    const result = stmt.all(params);
    return result as ContractData[];
  }

  getContractsByOwner (owner: string) {
    const stmt = this.db.prepare('SELECT * FROM contracts WHERE owner = ?');
    return stmt.all(owner) as ContractData[];
  }

  getContractByAddress (address: string) {
    const stmt = this.db.prepare('SELECT * FROM contracts WHERE address = ?');
    return stmt.get(address) as ContractData | undefined;
  }

  async getContractPages (
    owner: string,
    query: string
  ) {
    const likeTerm = `%${query}%`;
    const stmt = this.db.prepare(`
      SELECT COUNT(*)
      FROM contracts
      WHERE
        contracts.owner = ? AND 
        (
          contracts.address LIKE ? OR
          CAST(contracts.targetAmount AS TEXT) LIKE ? OR
          CAST(contracts.currentAmount AS TEXT) LIKE ? OR
          contracts.type LIKE ?
        )
    `);
    const result = stmt.get(owner, likeTerm, likeTerm, likeTerm, likeTerm);
    // console.log(result);
    const totalPages = Math.ceil(Number(result['COUNT(*)']) / ITEMS_PER_PAGE);
    return totalPages;
  }

  async insertContract (
    address: string,
    contract: NewContract
  ): Promise<boolean> {
    try {
      const { owner, currentAmount, type, targetAmount, unlockTimestamp } = contract;

      const stmt = this.db.prepare(`
        INSERT INTO contracts (
          address, owner, currentAmount, 
          type, targetAmount, unlockTimestamp
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(
        address, owner, currentAmount, 
        type, targetAmount, unlockTimestamp
      );
      return info.changes > 0;
    } catch(error) {
      console.log(error);
      throw error;
    }
  }

  async deleteContract (
    address: string
  ): Promise<boolean> {
    try {
      const stmt = this.db.prepare(`
        DELETE 
        from contracts
        WHERE address = ?
      `);
      const info = stmt.run(address);
      return info.changes > 0;
    } catch(error) {
      console.log(error);
      throw error;
    }
  }

  async deposit (
    address: string,
    totalAmount: bigint
  ): Promise<boolean> {
    try {
      const checkStmt = this.db.prepare(`SELECT 1, currentAmount FROM contracts WHERE address = ?`);
      const exists = checkStmt.get(address);
      // console.log(exists);

      const stmt = this.db.prepare(`
        UPDATE contracts 
        SET currentAmount = ?
        WHERE address = ?
      `);
      const info = stmt.run(totalAmount, address);
      // console.log(info)
      return info.changes > 0;
    } catch(error) {
      console.log(error);
      throw error;
    }
  }

}

export default DatabaseService;