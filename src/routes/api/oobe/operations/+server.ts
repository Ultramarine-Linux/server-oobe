import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadState, saveState, DEFAULT_OOBE_PORT } from '$lib/server/state';
import { access, writeFile, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { env } from 'node:process';
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
				let resp: Awaited<ReturnType<typeof tetraSetHostname>>;
				try {
					resp = await tetraSetHostname(hostname);
				} catch (e: any) {
					return json(result(opId, step, 'failed', true, e.message || 'Failed to set hostname'));
				}
				if (!resp.ok) {
					return json(result(opId, step, 'failed', true, resp.error || 'Failed to set hostname'));
				}
				state.hostname = hostname;
				await saveState(state);
				return json(result(opId, step, 'succeeded', false));
			}

			case 'network.check': {
				let resp: Awaited<ReturnType<typeof tetraNetworkStatus>>;
				try {
					resp = await tetraNetworkStatus();
				} catch (e: any) {
					return json(result(opId, step, 'failed', true, e.message || 'Network check failed'));
				}
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

			case 'dashboard.install': {
				const buildPath =
					env.DASHBOARD_BUILD_PATH || '/usr/lib/ultramarine-dashboard/apps/dashboard/build';
				const serviceName = env.DASHBOARD_SERVICE_NAME || 'ultramarine-dashboard.service';

				try {
					await access(buildPath, constants.R_OK);
				} catch {
					return json(
						result(opId, step, 'failed', true, `Dashboard build not found at ${buildPath}`)
					);
				}

				const unitPath = `/etc/systemd/system/${serviceName}`;
				const unitContent = `[Unit]
Description=Ultramarine Server Dashboard
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=${buildPath}
ExecStart=/usr/bin/node ${buildPath}
Restart=on-failure
Environment="PORT=3972"
Environment="ORIGIN=http://localhost:3972"
Environment="HOST=0.0.0.0"

[Install]
WantedBy=multi-user.target
`;

				try {
					await writeFile(unitPath, unitContent, 'utf-8');
					await execFileAsync('systemctl', ['daemon-reload']);
					await execFileAsync('systemctl', ['enable', serviceName]);
				} catch (e: any) {
					return json(
						result(
							opId,
							step,
							'failed',
							true,
							e.stderr || e.message || 'Failed to install dashboard service'
						)
					);
				}

				if (!state.dashboard) {
					state.dashboard = { installed: false, installing: false };
				}
				state.dashboard.installed = true;
				state.dashboard.installing = false;
				await saveState(state);
				return json(result(opId, step, 'succeeded', false, 'Dashboard service installed'));
			}

			case 'dashboard.handoff': {
				const oobeService = env.OOBE_SERVICE_NAME || 'ultramarine-server-oobe.service';
				const dashboardService = env.DASHBOARD_SERVICE_NAME || 'ultramarine-dashboard.service';

				const scriptPath = `/tmp/ultramarine-dashboard-handoff-${Date.now()}.sh`;
				const script = `#!/bin/sh
set -e
sleep 3
systemctl stop ${oobeService} 2>/dev/null || true
systemctl start ${dashboardService}
rm -f ${scriptPath}
`;

				try {
					await writeFile(scriptPath, script, { mode: 0o755 });
					const child = spawn('sh', [scriptPath], {
						detached: true,
						stdio: 'ignore'
					});
					child.unref();
				} catch (e: any) {
					return json(
						result(opId, step, 'failed', true, e.message || 'Failed to schedule handoff')
					);
				}

				return json(result(opId, step, 'succeeded', false, 'Handoff scheduled'));
			}

			case 'cloudflare.install': {
				const cloudflaredBin = env.CLOUDFLARED_PATH || '/usr/bin/cloudflared';
				const serviceName = env.CLOUDFLARED_SERVICE_NAME || 'ultramarine-cloudflared.service';
				const tokenDir = env.CLOUDFLARED_TOKEN_DIR || '/var/lib/ultramarine/cloudflared';
				const tokenFile = `${tokenDir}/token`;
				const wrapperPath = '/usr/local/bin/ultramarine-cloudflared-wrapper.sh';

				// Try to install cloudflared if not present
				try {
					await access(cloudflaredBin, constants.X_OK);
				} catch {
					try {
						await execFileAsync('dnf', ['install', '-y', 'cloudflared']);
					} catch {
						// Fall back to official RPM install path
						try {
							await execFileAsync('dnf', [
								'install',
								'-y',
								'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-x86_64.rpm'
							]);
						} catch (e: any) {
							return json(
								result(
									opId,
									step,
									'failed',
									true,
									e.stderr || e.message || 'Failed to install cloudflared'
								)
							);
						}
					}
				}

				// Ensure token directory exists
				try {
					await mkdir(tokenDir, { recursive: true });
				} catch {
					// ignore
				}

				// Create wrapper script that reads token from file
				const wrapperScript = `#!/bin/sh
set -e
if [ -r "${tokenFile}" ]; then
  export TUNNEL_TOKEN=$(cat "${tokenFile}")
fi
exec ${cloudflaredBin} tunnel run
`;
				try {
					await writeFile(wrapperPath, wrapperScript, { mode: 0o755 });
				} catch (e: any) {
					return json(
						result(opId, step, 'failed', true, e.message || 'Failed to write wrapper script')
					);
				}

				const unitPath = `/etc/systemd/system/${serviceName}`;
				const unitContent = `[Unit]
Description=Cloudflare Tunnel for Ultramarine Server
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=${wrapperPath}
Restart=on-failure

[Install]
WantedBy=multi-user.target
`;

				try {
					await writeFile(unitPath, unitContent, 'utf-8');
					await execFileAsync('systemctl', ['daemon-reload']);
					await execFileAsync('systemctl', ['enable', serviceName]);
				} catch (e: any) {
					return json(
						result(
							opId,
							step,
							'failed',
							true,
							e.stderr || e.message || 'Failed to install cloudflared service'
						)
					);
				}

				if (!state.cloudflare) {
					state.cloudflare = { installed: false, installing: false };
				}
				state.cloudflare.installed = true;
				state.cloudflare.installing = false;
				await saveState(state);
				return json(
					result(
						opId,
						step,
						'succeeded',
						false,
						'Cloudflared installed. Place tunnel token in ' + tokenFile + ' and start the service.'
					)
				);
			}

			default:
				return json(result(opId, step, 'failed', false, `Unknown operation: ${operation}`));
		}
	} catch (err) {
		console.error('Operation failed:', err);
		throw error(500, 'Internal server error');
	}
};
