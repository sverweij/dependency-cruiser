# Utensils

Some utensils that help a bit with the development of dependency-cruiser.

## schema and generate-schemas.utl.js

The [schema](schema) folder contains the sources for both json schemas
([configuration](../src/schema/configuration.schema.json) and
[cruise-result](../src/schema/cruise-result.schema.json). They're split up
for ease of maintenance).

To generate the schemas from their sources run:

```sh
node utl/generate-schemas.utl.js
```

> The build and version lifecycle scripts take care of this automatically, so
> there's no need to run this manually each PR or push _unless_ you're modifying
> the json schema

[![overview](overview.svg)](https://sverweij.github.io/dependency-cruiser/schema-overview.html)
