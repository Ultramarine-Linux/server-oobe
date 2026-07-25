import { fixtureState, type OobeState, type OperationResult, type StepId } from './oobe-state';

/** Local API boundary. Replace this adapter with the libtaidan-backed service client. */
export interface OobeApi {
	getState(): Promise<OobeState>;
	completeStep(step: StepId): Promise<OperationResult>;
	startOperation(step: StepId, operation: string): Promise<OperationResult>;
}

export const fixtureApi: OobeApi = {
	async getState() {
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
