import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { FileLoggerService } from 'src/file-logger.service';

@Injectable()
export class EventSubscriberService implements OnModuleInit {
  private connection: Connection;
  private systemPublicKey: PublicKey;

  constructor(
    private readonly configService: ConfigService,
    private readonly fileLogger: FileLoggerService,
  ) {
    const connectionURL = this.configService.get<string>(
      'SOLANA_JSON_RPC_ENDPOINT_URL',
    );
    if (!connectionURL) {
      console.error(
        'SOLANA_JSON_RPC_ENDPOINT_URL is not defined in the environment variables.',
      );
      process.exit(1);
    }
    this.connection = new Connection(connectionURL, 'confirmed');

    const systemWalletPublicKeyString = this.configService.get<string>(
      'SYSTEM_WALLET_PUBLIC_KEY_STRING',
    );
    if (!systemWalletPublicKeyString) {
      console.error(
        'SYSTEM_WALLET_PUBLIC_KEY_STRING is not defined in the environment variables.',
      );
      process.exit(1);
    }

    try {
      this.systemPublicKey = new PublicKey(systemWalletPublicKeyString);
    } catch (err) {
      console.error('Invalid SYSTEM_WALLET_PUBLIC_KEY:', err.message);
      process.exit(1);
    }
  }

  async onModuleInit() {
    try {
      const version = await this.connection.getVersion();
      console.log('Connected to Solana node. Version:', version);

      // Verify that the system wallet public key is valid
      const accountInfo = await this.connection.getAccountInfo(
        this.systemPublicKey,
      );
      if (accountInfo === null) {
        console.error(
          'System wallet account not found on-chain. It might be a new account or on a different network. Exiting.',
        );
        process.exit(1);
      } else {
        console.log('System wallet account verified on-chain.');
      }

      await this.subscribeToAccountChanges();
    } catch (err) {
      console.error(
        'Failed to initialize EventSubscriberService:',
        err.message,
      );
      process.exit(1);
    }
  }

  private async subscribeToAccountChanges() {
    this.connection.onAccountChange(
      this.systemPublicKey,
      async (updatedAccountInfo, context) => {
        await this.handleAccountChanges(updatedAccountInfo);
      },
      { commitment: 'confirmed' },
    );
  }

  private async handleAccountChanges(updatedAccountInfo: AccountInfo<Buffer>) {
    await this.fileLogger.logAccountChange(updatedAccountInfo);
  }
}
