#!/usr/bin/env node

import {writeFileSync,unlinkSync,accessSync} from 'node:fs';
import config from '../config.js';
import Server from '../utils/daemon/Server.js';

writeFileSync( config.pidFile, process.pid.toString(), { encoding: 'utf-8' } );

const server = new Server();

process.on( 'exit', () => {
	if ( server ) {
		server.close();
	}

	try {
		accessSync( config.socketPath );
		unlinkSync( config.socketPath );
	} catch(e) {}

	try {
		accessSync( config.pidFile );
		unlinkSync( config.pidFile );
	} catch(e) {}
})