import datetime as dt
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('gate', Path(__file__).with_name('check-publishing.py'))
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


class PublishingGateTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.article = self.root / 'src/content/blog/example.md'
        self.hero = self.root / 'public/assets/blog/example.svg'
        self.article.parent.mkdir(parents=True)
        self.hero.parent.mkdir(parents=True)
        self.hero.write_text('<svg/>')
        self.write()
        self.manifest({})

    def write(self, date='2026-10-26', draft='false'):
        self.article.write_text(f'---\npubDate: {date}\ndraft: {draft}\nheroImage: /assets/blog/example.svg\n---\nExample')

    def manifest(self, articles):
        (self.root / 'publishing-approvals.json').write_text(json.dumps({'version': 1, 'articles': articles}))

    def run_gate(self, day=26):
        gate.check(self.root, dt.date(2026, 10, day))

    def approve(self):
        self.manifest({self.article.relative_to(self.root).as_posix(): {'review_reference': 'Fictional owner approval',
            'sha256': {p.relative_to(self.root).as_posix(): hashlib.sha256(p.read_bytes().replace(b'\r\n', b'\n')).hexdigest()
                       for p in (self.article, self.hero)}}})

    def test_future_and_draft_excluded_but_due_unapproved_blocks(self):
        self.run_gate(25)
        with self.assertRaises(ValueError): self.run_gate()
        self.write(draft='true')
        self.run_gate()

    def test_exact_approval_then_copy_and_artwork_changes_block(self):
        self.approve()
        self.run_gate()
        self.article.write_text(self.article.read_text() + ' changed')
        with self.assertRaises(ValueError): self.run_gate()
        self.approve()
        self.hero.write_text('<svg>changed</svg>')
        with self.assertRaises(ValueError): self.run_gate()

    def test_duplicate_and_ambiguous_dates_fail_closed(self):
        self.write(date='2026-10-26T12:00:00Z')
        with self.assertRaises(ValueError): self.run_gate()
        self.write()
        self.article.write_text(self.article.read_text().replace('draft: false', 'draft: false\ndraft: true'))
        with self.assertRaises(ValueError): self.run_gate()

    def test_windows_line_endings_do_not_change_reviewed_content(self):
        self.approve()
        self.article.write_bytes(self.article.read_bytes().replace(b'\r\n', b'\n').replace(b'\n', b'\r\n'))
        self.run_gate()

    def test_mdx_is_subject_to_the_same_approval_gate(self):
        self.article = self.article.rename(self.article.with_suffix('.mdx'))
        with self.assertRaises(ValueError): self.run_gate()
        self.approve()
        self.run_gate()

    def test_omitted_draft_matches_astro_default_but_is_not_approval(self):
        self.article.write_text(self.article.read_text().replace('draft: false\n', ''))
        with self.assertRaises(ValueError): self.run_gate()
        self.approve()
        self.run_gate()

    def test_one_approved_article_does_not_approve_another(self):
        self.approve()
        other=self.article.with_name('other.md')
        other.write_text(self.article.read_text())
        with self.assertRaises(ValueError): self.run_gate()

    def test_missing_hero_is_allowed_only_for_excluded_content(self):
        self.write(draft='true')
        self.article.write_text(self.article.read_text().replace('heroImage: /assets/blog/example.svg\n',''))
        self.run_gate()
        self.article.write_text(self.article.read_text().replace('draft: true','draft: false'))
        with self.assertRaises(ValueError): self.run_gate()


if __name__ == '__main__': unittest.main()
