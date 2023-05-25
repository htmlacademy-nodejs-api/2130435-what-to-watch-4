import {CliCommandInterface} from './cli-command.interface';
import chalk from 'chalk';
import {CommandName} from './command-name.enum.js';


const path = `${chalk.yellow(`<${chalk.red('path')}>`)}`;
const url = `${chalk.yellow(`<${chalk.red('url')}>`)}`;
const n = `${chalk.yellow(`<${chalk.red('n')}>`)}`;
const argumentsColor = `${chalk.yellow(`<${chalk.red('--arguments')}>`)}`;


export default class HelpCommand implements CliCommandInterface {
  public readonly name: CommandName = CommandName.Help;

  public async execute(): Promise<void> {
    console.log(`
    ${chalk.yellow.bgYellow('_').repeat(120)}
    ${chalk.bold('Программа для подготовки данных для REST API сервера.')}

    Пример: ${chalk.italic(` cli.js --<command> [${argumentsColor}] `)}

    ${chalk.green('Команды')}:
        --version:                   # выводит номер версии
        --help:                      # печатает этот текст
        --import ${path}:             # импортирует данные из TSV
        --generate ${n} ${path} ${url}  # генерирует произвольное количество тестовых данных
    ${chalk.yellow.bgYellow('_').repeat(120)}
    `);
  }
}
