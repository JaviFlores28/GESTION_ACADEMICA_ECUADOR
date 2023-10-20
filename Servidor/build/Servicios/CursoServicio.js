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
const CursoNegocio_1 = __importDefault(require("../Negocio/CursoNegocio"));
const CursoEntidad_1 = __importDefault(require("../Entidades/CursoEntidad"));
router.get('/curso', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const curso = yield CursoNegocio_1.default.getCurso();
        res.json(curso);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/curso', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const curso = new CursoEntidad_1.default(request.CRS_ID, request.CRS_NOM, request.CRS_TIPO, request.CRS_ORDEN, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield CursoNegocio_1.default.addCurso(curso);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/curso', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const curso = new CursoEntidad_1.default(request.CRS_ID, request.CRS_NOM, request.CRS_TIPO, request.CRS_ORDEN, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield CursoNegocio_1.default.updateCurso(curso);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/curso/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield CursoNegocio_1.default.deleteCurso(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/curso/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield CursoNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
