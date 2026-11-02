"""Fail closed unless every due article and its banner match a reviewed manifest.

No model calls, secrets, network or implicit approvals. Date-only UTC matches
the current content convention; other formats need explicit parser review.
"""
import datetime as dt
import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def check(root=ROOT, today=None):
    today = today or dt.datetime.now(dt.timezone.utc).date()
    manifest = json.loads((root / 'publishing-approvals.json').read_text())
    if manifest.get('version') != 1:
        raise ValueError('Unsupported approval manifest')
    errors = []
    due = 0
    for path in sorted(p for p in (root / 'src/content/blog').rglob('*') if p.suffix in {'.md', '.mdx'}):
        text = path.read_text(encoding='utf-8')
        if not text.startswith('---\n'):
            raise ValueError(f'{path.name}: missing frontmatter')
        front = text.split('---', 2)[1]
        fields = {}
        for key in ('pubDate', 'draft', 'heroImage'):
            values = re.findall(r'^' + key + r':\s*(.*?)\s*$', front, re.M)
            if key == 'draft' and not values:
                fields[key] = 'false'  # Same default as the Astro collection schema.
                continue
            if key == 'heroImage' and not values:
                continue  # A due, non-draft article still requires its own SVG below.
            if len(values) != 1:
                raise ValueError(f'{path.name}: missing or duplicate {key}')
            fields[key] = values[0].strip('"\'')
        if fields['draft'] not in ('true', 'false'):
            raise ValueError(f'{path.name}: unsupported draft value')
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', fields['pubDate']):
            raise ValueError(f'{path.name}: require an ISO date without time')
        date = dt.date.fromisoformat(fields['pubDate'])
        if fields['draft'] == 'true' or date > today:
            continue
        due += 1
        hero = fields.get('heroImage', '')
        if not re.fullmatch(r'/assets/blog/[a-z0-9-]+\.svg', hero):
            raise ValueError(f'{path.name}: unsupported banner path')
        key = path.relative_to(root).as_posix()
        approval = manifest.get('articles', {}).get(key, {})
        assets = {key: path, 'public' + hero: root / ('public' + hero)}
        if not approval.get('review_reference'):
            errors.append(f'{key}: no exact-version editorial approval')
        for name, asset in assets.items():
            if not asset.resolve().is_relative_to(root.resolve()):
                raise ValueError(f'{name}: asset escapes the project')
            digest = hashlib.sha256(asset.read_bytes().replace(b'\r\n', b'\n')).hexdigest()
            if approval.get('sha256', {}).get(name) != digest:
                errors.append(f'{name}: unapproved or changed')
    if errors:
        raise ValueError('\n'.join(errors))
    print(f'Editorial gate passed for {due} due articles; no publication performed.')


if __name__ == '__main__':
    check()
