import { CliCommandInterface } from './cli-command.interface';
import {readFileSync} from 'node:fs';
import path from 'node:path';

export default class VersionCommand implements CliCommandInterface {
  public readonly name: string = '--version';

  private readVersion(): string {
    const contentPageJSON = readFileSync(path.resolve('./package.json'), 'utf-8');
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }

  public async execute(): Promise<void> {
    const version = this.readVersion();
    console.log(version);
  }

}

