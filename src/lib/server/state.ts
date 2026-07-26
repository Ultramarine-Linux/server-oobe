import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fixtureSteps, type OobeState, type StepId } from '$lib/oobe-state';

/** Canonical local port for the Ultramarine Server OOBE web service. */
export const DEFAULT_OOBE_PORT = 6623;

const DEFAULT_STATE_PATH = '/var/lib/ultramarine-server-oobe/state.json';
const FALLBACK_STATE_PATH = `${tmpdir()}/ultramarine-server-oobe/state.json`;

function statePath(): string {
	return process.env.OOBE_STATE_PATH || DEFAULT_STATE_PATH;
}

function fallbackStatePath(): string {
	return FALLBACK_STATE_PATH;
}

const knownStepIds = new Set(fixtureSteps.map((s) => s.id));

function normalizeState(raw: unknown): OobeState {
	const base = defaultState();
	if (!raw || typeof raw !== 'object') return base;
	const partial = raw as Partial<OobeState>;

	const steps = fixtureSteps.map((fixture) => {
		const persisted = partial.steps?.find((s) => s.id === fixture.id);
		return persisted ? { ...fixture, status: persisted.status } : fixture;
	});

	let activeStep = partial.activeStep ?? base.activeStep;
	if (!knownStepIds.has(activeStep as StepId)) {
		activeStep = 'welcome';
	}

	return {
		version: 1,
		completed: partial.completed ?? false,
		activeStep: activeStep as StepId,
		steps,
		hostname: partial.hostname ?? '',
		administrator: partial.administrator ?? '',
		keyboardLayout: partial.keyboardLayout,
		hostingChoice: partial.hostingChoice ?? null,
		tetra: { ...base.tetra, ...partial.tetra },
		fyra: { ...base.fyra, ...partial.fyra },
		dashboard: { ...base.dashboard, ...partial.dashboard },
		cloudflare: { ...base.cloudflare, ...partial.cloudflare }
	};
}

function defaultState(): OobeState {
	return {
		version: 1,
		completed: false,
		activeStep: 'welcome',
		steps: [
			{
				id: 'welcome',
				label: 'Welcome',
				status: 'active',
				description: 'Welcome to Ultramarine Server.'
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
				description: 'Choose how this server will be hosted.'
			},
			{
				id: 'complete',
				label: 'Complete',
				status: 'pending',
				description: 'Review setup and hand off to recovery or Dashboard.'
			}
		],
		hostname: '',
		administrator: '',
		hostingChoice: null,
		tetra: { installed: false, running: false, paired: false },
		fyra: { status: 'not-started' },
		dashboard: { installed: false, installing: false },
		cloudflare: { installed: false, installing: false }
	};
}

export async function loadState(): Promise<OobeState> {
	async function tryLoad(path: string): Promise<OobeState | undefined> {
		try {
			await access(path, constants.R_OK);
			const raw = await readFile(path, 'utf-8');
			return normalizeState(JSON.parse(raw));
		} catch {
			return undefined;
		}
	}
	return (await tryLoad(statePath())) ?? (await tryLoad(fallbackStatePath())) ?? defaultState();
}

export async function saveState(state: OobeState): Promise<void> {
	async function trySave(path: string): Promise<boolean> {
		try {
			await mkdir(dirname(path), { recursive: true });
			const tmp = `${path}.tmp`;
			await writeFile(tmp, JSON.stringify(state, null, 2) + '\n', 'utf-8');
			await writeFile(path, await readFile(tmp, 'utf-8'), 'utf-8');
			return true;
		} catch (err: any) {
			if (err.code === 'EACCES' || err.code === 'EPERM') {
				return false;
			}
			throw err;
		}
	}
	if (!(await trySave(statePath()))) {
		if (!(await trySave(fallbackStatePath()))) {
			throw new Error('Unable to save OOBE state to primary or fallback path');
		}
	}
}
