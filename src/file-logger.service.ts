import { Injectable } from '@nestjs/common';
import { AccountInfo } from '@solana/web3.js';
import { appendFile } from 'fs';
import * as path from 'path';

@Injectable()
export class FileLoggerService {
    private logFilePath: string;

    constructor() {
        this.logFilePath = path.join(process.cwd(), 'account-change-log');
    }

    async logAccountChange(accountChange: AccountInfo<Buffer>): Promise<void> {
        const serializedData = JSON.stringify({
            executable: accountChange.executable,
            owner: accountChange.owner.toBase58(),
            lamports: accountChange.lamports,
            data: accountChange.data.toString('base64'),
            rentEpoch: accountChange.rentEpoch,
            time: new Date().toISOString(),
        }, null, 2);
        appendFile(this.logFilePath, `${serializedData}\n`, (err) => {
            if (err) {
                console.error('Failed to write to log file:', err);
            }
        })
    };
}