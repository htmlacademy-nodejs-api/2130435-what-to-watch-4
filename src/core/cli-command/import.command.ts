import {CliCommandInterface} from './cli-command.interface';
import TSVFileReader from '../file-reader/tsv-file-reader.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name: string = '--import';
  public execute(filename: string): void {
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.error(`Не удалось импортировать данные из файла из-за ошибки: ${err.message}`);
    }
  }
}
