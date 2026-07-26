import { type OobeState, type OperationResult, type StepId } from './oobe-state';

export interface OobeApi {
	getState(): Promise<OobeState>;
	completeStep(step: StepId): Promise<OperationResult>;
	startOperation(
		step: StepId,
		operation: string,
		payload?: Record<string, unknown>
	): Promise<OperationResult>;
}

export const liveApi: OobeApi = {
	async getState() {
		const res = await fetch('/api/oobe/state');
		if (!res.ok) throw new Error(`Failed to load state: ${res.status}`);
		return (await res.json()) as OobeState;
	},

	async completeStep(step) {
		const res = await fetch('/api/oobe/state', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ steps: [{ id: step, status: 'complete' }] })
		});
		if (!res.ok) throw new Error(`Failed to complete step: ${res.status}`);
		return { id: `complete-${step}`, step, status: 'succeeded', retryable: false };
	},

	async startOperation(step, operation, payload = {}) {
		const res = await fetch('/api/oobe/operations', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ step, operation, payload })
		});
		if (!res.ok) throw new Error(`Operation failed: ${res.status}`);
		return (await res.json()) as OperationResult;
	}
};

/** Fixture API for development without a backend. */
export const fixtureApi: OobeApi = {
	async getState() {
		const { fixtureState } = await import('./oobe-state');
		return structuredClone(fixtureState);
	},
	async completeStep(step) {
		return { id: `fixture-${step}`, step, status: 'succeeded', retryable: false };
	},
	async startOperation(step, operation) {
		return {
			id: `fixture-${operation}`,
			step,
			status: 'succeeded',
			retryable: true,
			message: 'Fixture mode: the local OOBE service will perform this operation.'
		};
	}
};

export const api: OobeApi = import.meta.env.VITE_FIXTURE_API === 'true' ? fixtureApi : liveApi;
