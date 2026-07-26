import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname } from 'node:path';
import type { OobeState } from '$lib/oobe-state';

/** Canonical local port for the Ultramarine Server OOBE web service. */
export const DEFAULT_OOBE_PORT = 3972;

const DEFAULT_STATE_PATH = '/var/lib/ultramarine-server-oobe/state.json';

function statePath(): string {
	return process.env.OOBE_STATE_PATH || DEFAULT_STATE_PATH;
}

function defaultState(): OobeState {
	return {
		version: 1,
		completed: false,
		activeStep: 'welcome',
		steps: [
			{
				id: 'language',
				label: 'Language',
				status: 'pending',
				description: 'Select your preferred language.'
			},
			{
				id: 'welcome',
				label: 'Welcome',
				status: 'active',
				description: 'Welcome to Ultramarine Server.'
			},
			{
				id: 'keyboard',
				label: 'Keyboard',
				status: 'pending',
				description: 'Set your keyboard layout.'
			},
			{
				id: 'devicename',
				label: 'Device name',
				status: 'pending',
				description: 'Name this server.'
			},
			{
				id: 'whoareyou',
				label: 'Create administrator',
				status: 'pending',
				description: 'Create your local administrator.'
			},
			{
				id: 'password',
				label: 'Password',
				status: 'pending',
				description: 'Set the administrator password.'
			},
			{
				id: 'internet',
				label: 'Internet',
				status: 'pending',
				description: 'Check network readiness.'
			},
			{
				id: 'tweaks',
				label: 'Server defaults',
				status: 'pending',
				description: 'Choose optional server defaults.'
			},
			{
				id: 'tetra',
				label: 'Tetra',
				status: 'pending',
				description: 'Connect the host management agent.'
			},
			{
				id: 'fyra-dash',
				label: 'Fyra',
				status: 'pending',
				description: 'Connect this server to the global dashboard.'
			},
			{
				id: 'complete',
				label: 'Complete',
				status: 'pending',
				description: 'Review setup and hand off to recovery or Dashboard.'
			}
		],
		tetra: { installed: false, running: false, paired: false },
		fyra: { status: 'not-started' }
	};
}

export async function loadState(): Promise<OobeState> {
	try {
		await access(statePath(), constants.R_OK);
		const raw = await readFile(statePath(), 'utf-8');
		return JSON.parse(raw) as OobeState;
	} catch {
		return defaultState();
	}
}

export async function saveState(state: OobeState): Promise<void> {
	const path = statePath();
	await mkdir(dirname(path), { recursive: true });
	const tmp = `${path}.tmp`;
	await writeFile(tmp, JSON.stringify(state, null, 2) + '\n', 'utf-8');
	await writeFile(path, await readFile(tmp, 'utf-8'), 'utf-8');
}
