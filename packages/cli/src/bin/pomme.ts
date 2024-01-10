#!/usr/bin/env node
import { Command } from 'commander';
import 'dotenv/config';
import { init } from 'src/lib/init';

const program = new Command();

program.name('pomme').description('CLI for PommeJS').version('1.0.0');

program
	.command('init')
	.description('Initialize a new PommeJS setting codegen file')
	.action(init);

program.parse(process.argv);
