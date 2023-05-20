import {CliCommandInterface} from './cli-command.interface';
import {MockData} from '../../types/mock-data.type';
import got from 'got';
import FilmGenerator from '../../modules/film-generator/film-generator.js';
import {appendFile} from 'node:fs/promises';

type GenerateExecuteParameters = [string, string, string]

export default class GenerateCommand implements CliCommandInterface {
  public readonly name: string = '--generate';
  private initialData: MockData;

  public async execute(...parameters: GenerateExecuteParameters): Promise<void> {
    const [count, filepath, url] = parameters;
    const filmCount = Number(count);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      console.error(`Can't fetch data from${url}`);
    }

    const filmGeneratorString = new FilmGenerator(this.initialData);

    for (let i = 0; i < filmCount; i++) {
      await appendFile(filepath, `${filmGeneratorString.generate()}\n`, 'utf-8');
    }

    console.log(`File ${filepath} successfully generated`);

  }
}
