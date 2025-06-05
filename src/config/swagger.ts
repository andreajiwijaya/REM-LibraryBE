import swaggerUi, { JsonObject } from 'swagger-ui-express';
import { Router } from 'express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const router = Router();

// Path ke docs yang ada di luar src, misal: C:\Users\MSI THIN 15\REM-Library\docs\rem-library-api.yaml
const swaggerFile = fs.readFileSync(path.join(__dirname, '../../docs/rem-library-api.yaml'), 'utf8');
const swaggerDocument = yaml.load(swaggerFile) as JsonObject;

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
