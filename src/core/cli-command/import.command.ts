import {CliCommandInterface} from './cli-command.interface';
import {createFilm, getErrorMessage} from '../helpers/index.js';
import TSVFileReader from '../file-reader/tsv-file-reader.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name: string = '--import';

  private onLine(line: string) {
    const offer = createFilm(line);
    console.log(offer);
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
  }

  public async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch(err) {
      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    }
  }
}
