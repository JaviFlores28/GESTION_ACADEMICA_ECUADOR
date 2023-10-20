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
const PeriodoNegocio_1 = __importDefault(require("../Negocio/PeriodoNegocio"));
const PeriodoEntidad_1 = __importDefault(require("../Entidades/PeriodoEntidad"));
router.get('/periodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const periodo = yield PeriodoNegocio_1.default.getPeriodo();
        res.json(periodo);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/periodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const periodo = new PeriodoEntidad_1.default(request.PRD_ID, request.PRD_NOM, request.PRD_TIPO, request.AL_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield PeriodoNegocio_1.default.addPeriodo(periodo);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/periodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const periodo = new PeriodoEntidad_1.default(request.PRD_ID, request.PRD_NOM, request.PRD_TIPO, request.AL_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield PeriodoNegocio_1.default.updatePeriodo(periodo);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/periodo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield PeriodoNegocio_1.default.deletePeriodo(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/periodo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield PeriodoNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
