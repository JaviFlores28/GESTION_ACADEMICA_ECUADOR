"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const ParametroNegocio_1 = __importDefault(require("../Negocio/ParametroNegocio"));
const ParametroEntidad_1 = __importDefault(require("../Entidades/ParametroEntidad"));
router.get('/parametro', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parametro = yield ParametroNegocio_1.default.getParametro();
        res.json(parametro);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/parametro', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const parametro = new ParametroEntidad_1.default(request.PRMT_ID, request.PRMT_NOM, request.PRMT_DESCR, request.PRMT_URL_IMG, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield ParametroNegocio_1.default.addParametro(parametro);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/parametro', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const parametro = new ParametroEntidad_1.default(request.PRMT_ID, request.PRMT_NOM, request.PRMT_DESCR, request.PRMT_URL_IMG, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield ParametroNegocio_1.default.updateParametro(parametro);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/parametro/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield ParametroNegocio_1.default.deleteParametro(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/parametro/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield ParametroNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
