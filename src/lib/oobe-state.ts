export type StepId = 'welcome' | 'network' | 'administrator' | 'tetra' | 'fyra';
export type StepStatus = 'pending' | 'active' | 'complete' | 'blocked' | 'failed';

export type OobeStep = {
	id: StepId;
	label: string;
	status: StepStatus;
	description: string;
};

export const fixtureSteps: OobeStep[] = [
	{
		id: 'welcome',
		label: 'Welcome',
		status: 'complete',
		description: 'Identify this server.'
	},
	{
		id: 'network',
		label: 'Network',
		status: 'active',
		description: 'Make sure the server can connect.'
	},
	{
		id: 'administrator',
		label: 'Administrator',
		status: 'pending',
		description: 'Create the local administrator.'
	},
	{
		id: 'tetra',
		label: 'Tetra',
		status: 'pending',
		description: 'Connect the host management agent.'
	},
	{
		id: 'fyra',
		label: 'Fyra',
		status: 'pending',
		description: 'Connect this server to the global dashboard.'
	}
];
