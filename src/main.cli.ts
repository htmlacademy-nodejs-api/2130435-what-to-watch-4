#!/usr/bin/env node

import CLIApplication from './app/cli.js';
import HelpCommand from './core/cli-command/help.command.js';
import VersionCommand from './core/cli-command/version.command.js';
import ImportCommand from './core/cli-command/import.command.js';
import GenerateCommand from './core/cli-command/generate.command.js';

const cliManager = new CLIApplication();
cliManager.registerCommands([
  new HelpCommand, new VersionCommand,
  new ImportCommand, new GenerateCommand
]);
cliManager.processCommand(process.argv);
