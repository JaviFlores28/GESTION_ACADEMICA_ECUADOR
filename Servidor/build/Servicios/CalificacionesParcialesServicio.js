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
const CalificacionesParcialesNegocio_1 = __importDefault(require("../Negocio/CalificacionesParcialesNegocio"));
const CalificacionesParcialesEntidad_1 = __importDefault(require("../Entidades/CalificacionesParcialesEntidad"));
router.get('/calificacionesparciales', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calificaciones_parciales = yield CalificacionesParcialesNegocio_1.default.getCalificacionesParciales();
        res.json(calificaciones_parciales);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/calificacionesparciales', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const calificaciones_parciales = new CalificacionesParcialesEntidad_1.default(request.CAL_ID, request.PRF_ASG_PRLL_ID, request.PRLL_EST_ID, request.PRCL_ID, request.CALIFICACION, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield CalificacionesParcialesNegocio_1.default.addCalificacionesParciales(calificaciones_parciales);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/calificacionesparciales', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const calificaciones_parciales = new CalificacionesParcialesEntidad_1.default(request.CAL_ID, request.PRF_ASG_PRLL_ID, request.PRLL_EST_ID, request.PRCL_ID, request.CALIFICACION, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield CalificacionesParcialesNegocio_1.default.updateCalificacionesParciales(calificaciones_parciales);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/calificacionesparciales/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield CalificacionesParcialesNegocio_1.default.deleteCalificacionesParciales(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/calificacionesparciales/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield CalificacionesParcialesNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
