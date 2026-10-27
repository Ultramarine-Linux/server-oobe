import { validateWithLibtaidan } from '#lib/server/libtaidan.js';
import { CHANGE_ID_PATTERN, confirmChange } from '#lib/server/network-change.js';
import { tetraNetworkConfirm } from '#lib/server/tetra.js';
import type { RequestHandler } from './$types';

// Keeps a network change Tetra would otherwise roll back (network-change.ts).
// Public: after a change the browser may only reach the OOBE at a new address,
// where it has no session cookie. The change id, which only the browser that
// made the change knows, is the credential; Tetra's `network.confirm` runs
// with the setup session that made the change.
export const POST: RequestHandler = async ({ request }) => {
	let changeId = '';
	try {
		const body = (await request.json()) as { changeId?: unknown };
		changeId = typeof body.changeId === 'string' ? body.changeId : '';
	} catch {
		// Rejected below.
	}
	if (!CHANGE_ID_PATTERN.test(changeId)) {
		return Response.json({ status: 'unknown', message: 'Invalid change id' }, { status: 400 });
	}
	try {
		await validateWithLibtaidan('internet', 'network.confirm', { changeId });
	} catch (e) {
		return Response.json(
			{ status: 'failed', message: e instanceof Error ? e.message : 'libtaidan validation failed' },
			{ status: 403 }
		);
	}
	return Response.json(await confirmChange(changeId, tetraNetworkConfirm));
};
