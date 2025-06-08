"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const express_1 = require("express");
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// Path ke docs yang ada di luar src, misal: C:\Users\MSI THIN 15\REM-Library\docs\rem-library-api.yaml
const swaggerFile = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../docs/rem-library-api.yaml'), 'utf8');
const swaggerDocument = js_yaml_1.default.load(swaggerFile);
router.use('/', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
exports.default = router;
