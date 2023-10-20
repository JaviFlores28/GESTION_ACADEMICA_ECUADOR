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
const MatriculaNegocio_1 = __importDefault(require("../Negocio/MatriculaNegocio"));
const MatriculaEntidad_1 = __importDefault(require("../Entidades/MatriculaEntidad"));
router.get('/matricula', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matricula = yield MatriculaNegocio_1.default.getMatricula();
        res.json(matricula);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/matricula', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const matricula = new MatriculaEntidad_1.default(request.MTR_ID, request.CRS_ID, request.EST_ID, request.ESTADO, request.PASE, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield MatriculaNegocio_1.default.addMatricula(matricula);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/matricula', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const matricula = new MatriculaEntidad_1.default(request.MTR_ID, request.CRS_ID, request.EST_ID, request.ESTADO, request.PASE, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield MatriculaNegocio_1.default.updateMatricula(matricula);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/matricula/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield MatriculaNegocio_1.default.deleteMatricula(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/matricula/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield MatriculaNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
