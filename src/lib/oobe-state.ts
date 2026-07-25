export type StepId =
	| 'language'
	| 'welcome'
	| 'keyboard'
	| 'devicename'
	| 'whoareyou'
	| 'password'
	| 'internet'
	| 'tweaks'
	| 'tetra'
	| 'fyra-dash'
	| 'complete';

export type StepStatus =
	'pending' | 'active' | 'complete' | 'requires-authentication' | 'blocked' | 'failed';

export type OobeStep = {
	id: StepId;
	label: string;
	status: StepStatus;
	description: string;
};

export type TetraState = {
	installed: boolean;
	running: boolean;
	paired: boolean;
	fingerprint?: string;
};

export type FyraState = {
	status: 'not-started' | 'pending' | 'authorized' | 'failed';
	serverName?: string;
};

export type OobeState = {
	version: 1;
	completed: boolean;
	activeStep: StepId;
	steps: OobeStep[];
	hostname?: string;
	administrator?: string;
	tetra: TetraState;
	fyra: FyraState;
};

export type OperationStatus = 'pending' | 'running' | 'succeeded' | 'failed';
export type OperationResult = {
	id: string;
	step: StepId;
	status: OperationStatus;
	retryable: boolean;
	message?: string;
};

export const fixtureSteps: OobeStep[] = [
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
	{ id: 'devicename', label: 'Device name', status: 'pending', description: 'Name this server.' },
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
	{ id: 'internet', label: 'Internet', status: 'pending', description: 'Check network readiness.' },
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
];

export const fixtureState: OobeState = {
	version: 1,
	completed: false,
	activeStep: 'welcome',
	steps: fixtureSteps,
	hostname: 'ultramarine-server',
	tetra: { installed: false, running: false, paired: false },
	fyra: { status: 'not-started' }
};

export function stepIndex(id: StepId): number {
	return fixtureSteps.findIndex((step) => step.id === id);
}
