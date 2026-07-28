import { json } from '@sveltejs/kit';
import { networkInterfaces } from 'node:os';

export function GET() {
	const addresses = Object.values(networkInterfaces())
		.flatMap((interfaces) => interfaces ?? [])
		.filter((address) => address.family === 'IPv4' && !address.internal)
		.map((address) => address.address);

	return json({ addresses: [...new Set(addresses)] });
}
