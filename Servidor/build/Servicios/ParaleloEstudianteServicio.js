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
const ParaleloEstudianteNegocio_1 = __importDefault(require("../Negocio/ParaleloEstudianteNegocio"));
const ParaleloEstudianteEntidad_1 = __importDefault(require("../Entidades/ParaleloEstudianteEntidad"));
router.get('/paraleloestudiante', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paralelo_estudiante = yield ParaleloEstudianteNegocio_1.default.getParaleloEstudiante();
        res.json(paralelo_estudiante);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/paraleloestudiante', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const paralelo_estudiante = new ParaleloEstudianteEntidad_1.default(request.PRLL_EST_ID, request.PRLL_ID, request.MTR_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield ParaleloEstudianteNegocio_1.default.addParaleloEstudiante(paralelo_estudiante);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/paraleloestudiante', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const paralelo_estudiante = new ParaleloEstudianteEntidad_1.default(request.PRLL_EST_ID, request.PRLL_ID, request.MTR_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield ParaleloEstudianteNegocio_1.default.updateParaleloEstudiante(paralelo_estudiante);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/paraleloestudiante/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield ParaleloEstudianteNegocio_1.default.deleteParaleloEstudiante(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/paraleloestudiante/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield ParaleloEstudianteNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
