# AURA-Backend
Backend for AURA, previously known as VOCNEA.

# Codestyle
Please stick to the style defined in .eslinrc.json
```bash
# lint
yarn run lint
```

# Develop
```bash
git clone <repo>
git submodule init
git submodule pull
yarn install
yarn start
```

# Deploy
```bash
# build
yarn run docker:build

# push to registry
yarn run docker:push
```

# Test Routes
```bash
# change token first

# get Dataset
node tools/test_datasetGet.js

# submit dataset
node tools/test_datasetSubmit.js
```
