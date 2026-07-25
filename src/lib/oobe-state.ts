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
	| 'fyra-dash';
export type StepStatus = 'pending' | 'active' | 'complete' | 'blocked' | 'failed';

export type OobeStep = {
	id: StepId;
	label: string;
	status: StepStatus;
	description: string;
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
		status: 'pending',
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
		label: 'Device Name',
		status: 'pending',
		description: 'Set your device name.'
	},
	{
		id: 'whoareyou',
		label: 'Create a User',
		status: 'pending',
		description: 'Create your local user.'
	},
	{
		id: 'password',
		label: 'Password',
		status: 'pending',
		description: 'Set your password.'
	},
	{
		id: 'internet',
		label: 'Internet',
		status: 'pending',
		description: 'Connect to the internet.'
	},
	{
		id: 'tweaks',
		label: 'Tweaks',
		status: 'pending',
		description: 'Apply system tweaks.'
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
	}
];
