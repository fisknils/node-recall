#!/usr/bin/env node

import net from 'node:net';
import { Command } from 'commander';
import inquirer from 'inquirer';
import { maybeSpawnDaemon, getDaemonPid, isDaemonRunning } from '../utils/_utils.js';
import config from '../config.js';

const ttl = +config?.ttl || 3600;

const sendRequest = async ( payload ) => {
	await maybeSpawnDaemon();

	const client = net.createConnection( config.socketPath );

	return await new Promise( ( resolve, reject ) => {
		client.on( 'connect', () => {
			client.write( JSON.stringify( payload ) );
		} );

		client.on( 'data', ( data ) => {
			const response = JSON.parse( data.toString() );
			client.end();
			resolve( response );
		} );

		setTimeout( () => reject( 'timeout' ), 250 );
	}).catch( e => false );
};

const program = new Command();

program.command( 'kill' )
	.description( 'Kills the background process' )
	.action( () => sendRequest( { action: 'die' } ) );

program.command( 'status' )
	.description( 'Checks whether the background process is running' )
	.action( async () => {
		const pid = await getDaemonPid();
		const isAlive = await isDaemonRunning();

		console.log( 'background process', ! isAlive ? 'is not' : `(PID: ${pid}) is`, 'running' );
	} );

program.command( 'set' )
	.description( 'Set the value of a key' )
	.option( '-t, --timeout <number>', `Seconds until a key is forgotten (default: ${ttl})`, ttl.toString() )
	.option( '-c, --clear', 'Clear this key' )
	.argument( '<key>', 'The key to remember' )
	.argument( '[value]', 'The value to remember', null )
	.action( ( key, value, options ) => {
		const timeout = +options.timeout;
		sendRequest( { key, value, timeout, action: 'set' } ).then( console.log );
	})

program.command( 'get' )
	.description( 'get a previously set key value' )
	.argument( '<key>', 'The key to recall' )
	.action( key => {
		sendRequest( { key, action: 'get' } )
			.then( response => {
				if ( response.error ) {
					process.exit( 1 );
				}
				console.log( response.value );
			} )
	} );

program.command( 'clear' )
	.description( 'clear the store for a specific key' )
	.argument( '<key>' )
	.action( key => {
		sendRequest( { key, action: 'clear' } ).then( console.log );
	});

program.command( 'prompt' )
	.description( 'If the key is not set, this command will prompt the user to enter the value' )
	.option( '-t, --timeout <number>', 'Seconds until a key is forgotten (default: 3600)', 3600 )
	.option( '--password', "Prompt, but don't show the input" )
	.argument( '<key>', 'The key to prompt for' )
	.action( ( key, options ) => {
		sendRequest( { key, action: 'get' } )
			.then( response => {
				if ( ! response.error ) {
					console.log( response.value );
					process.exit()
				}

				const prompt = inquirer.createPromptModule();

				return prompt(
					[
						{
							type: options?.password ? 'password' : 'input',
							name: 'userInput',
							message: `${key}: `
						}
					]
				).then( response => {
					return sendRequest(
						{
							key,
							timeout: options.timeout,
							value: response.userInput,
							action: 'set'
						}
					).then( () => response.userInput )
				} ).then( console.log );
			})
	} );

program.parse();