#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const colorArg = process.argv[2];
const iconsDir = path.resolve(__dirname, '../static/icons');

function normalizeColor(value) {
	if (!value) {
		return null;
	}
	const color = value.startsWith('#') ? value : `#${value}`;
	return /^#[0-9a-fA-F]{6}$/.test(color) ? color.toUpperCase() : null;
}

const color = normalizeColor(colorArg);

if (!color) {
	console.error('Usage: node scripts/set-icon-color.js B8BBB6');
	process.exit(1);
}

const protectedValues = new Set(['none', 'transparent', 'inherit']);

function shouldKeep(value) {
	return protectedValues.has(value.toLowerCase()) || value.startsWith('url(');
}

function replaceSvgColors(svg) {
	return svg
		.replace(/\b(stroke|fill)="([^"]+)"/g, (match, attr, value) => {
			return shouldKeep(value) ? match : `${attr}="${color}"`;
		})
		.replace(/\b(stroke|fill):\s*([^;"']+)/g, (match, attr, value) => {
			const trimmed = value.trim();
			return shouldKeep(trimmed) ? match : `${attr}: ${color}`;
		});
}

let changedCount = 0;

for (const file of fs.readdirSync(iconsDir)) {
	if (!file.endsWith('.svg')) {
		continue;
	}

	const filePath = path.join(iconsDir, file);
	const original = fs.readFileSync(filePath, 'utf8');
	const updated = replaceSvgColors(original);

	if (updated !== original) {
		fs.writeFileSync(filePath, updated);
		changedCount += 1;
	}
}

console.log(`Updated ${changedCount} SVG file(s) to ${color}`);
