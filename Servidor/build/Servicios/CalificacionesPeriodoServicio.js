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
const CalificacionesPeriodoNegocio_1 = __importDefault(require("../Negocio/CalificacionesPeriodoNegocio"));
const CalificacionesPeriodoEntidad_1 = __importDefault(require("../Entidades/CalificacionesPeriodoEntidad"));
router.get('/calificacionesperiodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calificaciones_periodo = yield CalificacionesPeriodoNegocio_1.default.getCalificacionesPeriodo();
        res.json(calificaciones_periodo);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/calificacionesperiodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const calificaciones_periodo = new CalificacionesPeriodoEntidad_1.default(request.CAL_ID, request.PRF_ASG_PRLL_ID, request.PRLL_EST_ID, request.CALIFICACION_CNTVA, request.CALIFICACION_CLTVA, request.PRD_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield CalificacionesPeriodoNegocio_1.default.addCalificacionesPeriodo(calificaciones_periodo);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/calificacionesperiodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const calificaciones_periodo = new CalificacionesPeriodoEntidad_1.default(request.CAL_ID, request.PRF_ASG_PRLL_ID, request.PRLL_EST_ID, request.CALIFICACION_CNTVA, request.CALIFICACION_CLTVA, request.PRD_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield CalificacionesPeriodoNegocio_1.default.updateCalificacionesPeriodo(calificaciones_periodo);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/calificacionesperiodo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield CalificacionesPeriodoNegocio_1.default.deleteCalificacionesPeriodo(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/calificacionesperiodo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield CalificacionesPeriodoNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
