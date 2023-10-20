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
const ParaleloNegocio_1 = __importDefault(require("../Negocio/ParaleloNegocio"));
const ParaleloEntidad_1 = __importDefault(require("../Entidades/ParaleloEntidad"));
router.get('/paralelo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paralelo = yield ParaleloNegocio_1.default.getParalelo();
        res.json(paralelo);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/paralelo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const paralelo = new ParaleloEntidad_1.default(request.PRLL_ID, request.PRLL_NOM, request.CRS_ID, request.AL_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield ParaleloNegocio_1.default.addParalelo(paralelo);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/paralelo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const paralelo = new ParaleloEntidad_1.default(request.PRLL_ID, request.PRLL_NOM, request.CRS_ID, request.AL_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield ParaleloNegocio_1.default.updateParalelo(paralelo);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/paralelo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield ParaleloNegocio_1.default.deleteParalelo(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/paralelo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield ParaleloNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
