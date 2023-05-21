import {CliCommandInterface} from './cli-command.interface';
import {MockData} from '../../types/mock-data.type';
import got from 'got';
import FilmGenerator from '../../modules/film-generator/film-generator.js';
import TSVFileWriter from '../file-writer/tsv-file-writer.js';

type GenerateExecuteParameters = [string, string, string]

export default class GenerateCommand implements CliCommandInterface {
  public readonly name: string = '--generate';
  private initialData: MockData | undefined;

  public async execute(...parameters: GenerateExecuteParameters): Promise<void> {
    const [count, filepath, url] = parameters;
    const filmCount = Number(count);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      console.error(`Can't fetch data from${url}`);
    }

    if (!this.initialData) {
      return;
    }

    const filmGeneratorString = new FilmGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < filmCount; i++) {
      await tsvFileWriter.write(filmGeneratorString.generate());
    }

    console.log(`File ${filepath} successfully generated`);

  }
}
