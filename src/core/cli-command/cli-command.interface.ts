import {CommandName} from './command-name.enum.js';

export interface CliCommandInterface {
  readonly name: CommandName;
  execute(...parameters: CommandName[]): void;
}
