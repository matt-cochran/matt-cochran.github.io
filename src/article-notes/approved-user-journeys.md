This article describes source revision `73d164896cfc4faf001ca437bef3bf91cc317fa3`, examined October 16, 2026. Self-healing is opt-in and returns a repair rather than automatically saving it. Anchored exploration checks promotion; the direct CLI replay path does not contain the same explicit check. Annotation approval has a separate content-hash guard and does not approve actions or assertions. Check the behavior of your installed version before relying on those boundaries.

- [Journey discovery, annotation, and branching](https://github.com/matt-cochran/jevitate/blob/73d164896cfc4faf001ca437bef3bf91cc317fa3/docs/journeys.md)
- [Order-wizard fixture and branching tests](https://github.com/matt-cochran/jevitate/blob/73d164896cfc4faf001ca437bef3bf91cc317fa3/packages/cli/src/journey-anchored-served.test.ts)
- [Self-healing limits](https://github.com/matt-cochran/jevitate/blob/73d164896cfc4faf001ca437bef3bf91cc317fa3/packages/runtime/src/journey-runner.ts)
- [Direct replay and returned recording](https://github.com/matt-cochran/jevitate/blob/73d164896cfc4faf001ca437bef3bf91cc317fa3/packages/cli/src/journey-api.ts)
- [Promotion state](https://github.com/matt-cochran/jevitate/blob/73d164896cfc4faf001ca437bef3bf91cc317fa3/packages/journey/src/registry.ts)
