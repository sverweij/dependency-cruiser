The [schema](schema) folder contains the sources for both json schemas ([configuration](../src/schemas/configuration.schema.json) and [cruise-result](../src/schemas/cruise-result.schema.json) . They're split up 
for ease of maintenance). 

To generate the schemas from their sources run:

```sh
node utl/generate-schemas.utl.js
```

This is done on each build as well

![overview](overview.svg)