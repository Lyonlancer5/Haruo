# DeltaField Listener Ruleset

1. A listener **MUST** have the filename format `[0-9]_FILENAME.js`. The number (and filename) dictates its priority.
2. A listener **MUST** have a `load()` and `unload()` function accessible.
3. A listener that dynamically updates **SHOULD** be able to be reloaded without needing a full app restart.
4. A listener **MAY** be declared as a class or a regular object, but **MUST** follow the second rule.

### Note about the loading scheme

As of the time of writing, loading only uses `Array.sort()` to load in the listeners by priority.
Eventually this system will be replaced by a proper dependency system.

Also, the filename format must be followed or your listener/loader will not be loaded.
