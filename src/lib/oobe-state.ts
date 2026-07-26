export type StepId =
	| 'welcome'
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

export type DashboardState = {
	installed: boolean;
	installing: boolean;
};

export type CloudflareState = {
	installed: boolean;
	installing: boolean;
};

export type HostingChoice = 'global' | 'local' | 'both';

export type OobeState = {
	version: 1;
	completed: boolean;
	activeStep: StepId;
	steps: OobeStep[];
	hostname: string;
	administrator: string;
	keyboardLayout?: string;
	hostingChoice?: HostingChoice | null;
	tetra: TetraState;
	fyra: FyraState;
	dashboard: DashboardState;
	cloudflare: CloudflareState;
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
		id: 'welcome',
		label: 'step-welcome-label',
		status: 'active',
		description: 'step-welcome-description'
	},
	{
		id: 'devicename',
		label: 'step-device-name-label',
		status: 'pending',
		description: 'step-device-name-description'
	},
	{
		id: 'whoareyou',
		label: 'step-administrator-label',
		status: 'pending',
		description: 'step-administrator-description'
	},
	{
		id: 'password',
		label: 'step-password-label',
		status: 'pending',
		description: 'step-password-description'
	},
	{
		id: 'internet',
		label: 'step-internet-label',
		status: 'pending',
		description: 'step-internet-description'
	},
	{
		id: 'tweaks',
		label: 'step-tweaks-label',
		status: 'pending',
		description: 'step-tweaks-description'
	},
	{
		id: 'tetra',
		label: 'step-tetra-label',
		status: 'pending',
		description: 'step-tetra-description'
	},
	{
		id: 'fyra-dash',
		label: 'step-fyra-label',
		status: 'pending',
		description: 'step-fyra-description'
	},
	{
		id: 'complete',
		label: 'step-complete-label',
		status: 'pending',
		description: 'step-complete-description'
	}
];

export const fixtureState: OobeState = {
	version: 1,
	completed: false,
	activeStep: 'welcome',
	steps: fixtureSteps,
	hostname: '',
	administrator: '',
	keyboardLayout: undefined,
	hostingChoice: null,
	tetra: { installed: false, running: false, paired: false },
	fyra: { status: 'not-started' },
	dashboard: { installed: false, installing: false },
	cloudflare: { installed: false, installing: false }
};

export function stepIndex(id: StepId): number {
	return fixtureSteps.findIndex((step) => step.id === id);
}
