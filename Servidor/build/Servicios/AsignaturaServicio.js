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
const AsignaturaNegocio_1 = __importDefault(require("../Negocio/AsignaturaNegocio"));
const AsignaturaEntidad_1 = __importDefault(require("../Entidades/AsignaturaEntidad"));
router.get('/asignatura', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const asignatura = yield AsignaturaNegocio_1.default.getAsignatura();
        res.json(asignatura);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/asignatura', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const asignatura = new AsignaturaEntidad_1.default(request.ASG_ID, request.ASG_NOM, request.ASG_TIPO, request.AREA_ID, request.CRS_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield AsignaturaNegocio_1.default.addAsignatura(asignatura);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/asignatura', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const asignatura = new AsignaturaEntidad_1.default(request.ASG_ID, request.ASG_NOM, request.ASG_TIPO, request.AREA_ID, request.CRS_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield AsignaturaNegocio_1.default.updateAsignatura(asignatura);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/asignatura/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield AsignaturaNegocio_1.default.deleteAsignatura(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/asignatura/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield AsignaturaNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
