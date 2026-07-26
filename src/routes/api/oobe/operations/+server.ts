import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadState, saveState } from '$lib/server/state';
import {
	tetraSetHostname,
	tetraNetworkStatus,
	tetraServiceStatus,
	tetraServiceStart,
	tetraServiceEnable,
	tetraCapabilities
} from '$lib/server/tetra';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import type { StepId, OperationResult } from '$lib/oobe-state';

const execFileAsync = promisify(execFile);

function chpasswd(user: string, password: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const child = spawn('chpasswd', [], { stdio: ['pipe', 'pipe', 'pipe'] });
		let stderr = '';
		child.stderr.on('data', (data) => {
			stderr += data.toString();
		});
		child.on('error', (err) => reject(err));
		child.on('close', (code) => {
			if (code !== 0) reject(new Error(stderr || `chpasswd exited ${code}`));
			else resolve();
		});
		child.stdin.write(`${user}:${password}\n`);
		child.stdin.end();
	});
}

interface OperationRequest {
	step: StepId;
	operation: string;
	payload?: Record<string, unknown>;
}

function result(
	id: string,
	step: StepId,
	status: OperationResult['status'],
	retryable: boolean,
	message?: string
): OperationResult {
	return { id, step, status, retryable, message };
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = (await request.json()) as OperationRequest;
		const { step, operation, payload = {} } = body;
		const opId = `op-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

		const state = await loadState();

		switch (operation) {
			case 'hostname.apply': {
				const hostname = payload.hostname as string;
				if (
					!hostname ||
					!/^[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?)*$/.test(
						hostname
					)
				) {
					return json(result(opId, step, 'failed', true, 'Invalid hostname'));
				}
				const resp = await tetraSetHostname(hostname);
				if (!resp.ok) {
					return json(result(opId, step, 'failed', true, resp.error || 'Failed to set hostname'));
				}
				state.hostname = hostname;
				await saveState(state);
				return json(result(opId, step, 'succeeded', false));
			}

			case 'network.check': {
				const resp = await tetraNetworkStatus();
				if (!resp.ok) {
					return json(result(opId, step, 'failed', true, resp.error || 'Network check failed'));
				}
				return json(result(opId, step, 'succeeded', false, 'Network is available'));
			}

			case 'user.create': {
				const name = payload.name as string;
				if (!name || !/^[a-z_][a-z0-9_-]*$/.test(name)) {
					return json(result(opId, step, 'failed', true, 'Invalid username'));
				}
				try {
					await execFileAsync('useradd', ['-m', '-G', 'wheel', name]);
				} catch (e: any) {
					return json(
						result(opId, step, 'failed', true, e.stderr || e.message || 'Failed to create user')
					);
				}
				state.administrator = name;
				await saveState(state);
				return json(result(opId, step, 'succeeded', false));
			}

			case 'password.set': {
				const name = payload.name as string;
				const plaintext = payload.password as string;
				if (!name || !plaintext) {
					return json(result(opId, step, 'failed', true, 'Missing user or password'));
				}
				try {
					await chpasswd(name, plaintext);
				} catch (e: any) {
					return json(
						result(opId, step, 'failed', true, e.stderr || e.message || 'Failed to set password')
					);
				}
				return json(result(opId, step, 'succeeded', false));
			}

			case 'tetra.detect': {
				const resp = await tetraCapabilities();
				const installed = !resp.error;
				state.tetra.installed = installed;
				if (installed) {
					const svc = await tetraServiceStatus('tetra.service');
					state.tetra.running = svc.ok && !svc.error;
				}
				await saveState(state);
				return json(
					result(
						opId,
						step,
						'succeeded',
						false,
						installed ? 'Tetra detected' : 'Tetra not installed'
					)
				);
			}

			case 'tetra.start': {
				const startResp = await tetraServiceStart('tetra.service');
				if (!startResp.ok) {
					return json(
						result(opId, step, 'failed', true, startResp.error || 'Failed to start Tetra')
					);
				}
				const enableResp = await tetraServiceEnable('tetra.service');
				if (!enableResp.ok) {
					return json(
						result(opId, step, 'failed', true, enableResp.error || 'Failed to enable Tetra')
					);
				}
				state.tetra.running = true;
				await saveState(state);
				return json(result(opId, step, 'succeeded', false));
			}

			case 'keyboard.apply': {
				const layout = payload.layout as string;
				const variant = (payload.variant as string) || '';
				if (!layout || !/^[a-zA-Z0-9_-]+$/.test(layout)) {
					return json(result(opId, step, 'failed', true, 'Invalid keyboard layout'));
				}
				if (variant && !/^[a-zA-Z0-9_-]+$/.test(variant)) {
					return json(result(opId, step, 'failed', true, 'Invalid keyboard variant'));
				}
				try {
					const args = variant ? [layout, variant] : [layout];
					await execFileAsync('localectl', ['set-keymap', ...args]);
					return json(result(opId, step, 'succeeded', false));
				} catch (e: any) {
					return json(
						result(opId, step, 'failed', true, e.stderr || e.message || 'Keyboard setup failed')
					);
				}
			}

			case 'tweaks.apply': {
				const defaults = payload.defaults as boolean | undefined;
				const autoUpdates = payload.automaticUpdates as boolean | undefined;
				try {
					if (defaults) {
						await execFileAsync('systemctl', ['enable', '--now', 'sshd']);
					}
					if (autoUpdates) {
						await execFileAsync('systemctl', ['enable', '--now', 'dnf-automatic.timer']);
					}
					return json(result(opId, step, 'succeeded', false));
				} catch (e: any) {
					return json(
						result(opId, step, 'failed', true, e.stderr || e.message || 'Tweaks apply failed')
					);
				}
			}

			case 'fyra.begin': {
				state.fyra.status = 'pending';
				await saveState(state);
				return json(result(opId, step, 'succeeded', false, 'Fyra authorization started'));
			}

			case 'system.reboot': {
				try {
					await execFileAsync('systemctl', ['reboot']);
					return json(result(opId, step, 'succeeded', false, 'Rebooting…'));
				} catch (e: any) {
					return json(
						result(opId, step, 'failed', true, e.stderr || e.message || 'Failed to reboot')
					);
				}
			}

			case 'system.poweroff': {
				try {
					await execFileAsync('systemctl', ['poweroff']);
					return json(result(opId, step, 'succeeded', false, 'Shutting down…'));
				} catch (e: any) {
					return json(
						result(opId, step, 'failed', true, e.stderr || e.message || 'Failed to shut down')
					);
				}
			}

			default:
				return json(result(opId, step, 'failed', false, `Unknown operation: ${operation}`));
		}
	} catch (err) {
		console.error('Operation failed:', err);
		throw error(500, 'Internal server error');
	}
};
