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
const ProfesorAsignaturaParaleloNegocio_1 = __importDefault(require("../Negocio/ProfesorAsignaturaParaleloNegocio"));
const ProfesorAsignaturaParaleloEntidad_1 = __importDefault(require("../Entidades/ProfesorAsignaturaParaleloEntidad"));
router.get('/profesorasignaturaparalelo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesor_asignatura_paralelo = yield ProfesorAsignaturaParaleloNegocio_1.default.getProfesorAsignaturaParalelo();
        res.json(profesor_asignatura_paralelo);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/profesorasignaturaparalelo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const profesor_asignatura_paralelo = new ProfesorAsignaturaParaleloEntidad_1.default(request.PRF_ASG_PRLL_ID, request.ASG_ID, request.PRF_ID, request.PRLL_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield ProfesorAsignaturaParaleloNegocio_1.default.addProfesorAsignaturaParalelo(profesor_asignatura_paralelo);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/profesorasignaturaparalelo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const profesor_asignatura_paralelo = new ProfesorAsignaturaParaleloEntidad_1.default(request.PRF_ASG_PRLL_ID, request.ASG_ID, request.PRF_ID, request.PRLL_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield ProfesorAsignaturaParaleloNegocio_1.default.updateProfesorAsignaturaParalelo(profesor_asignatura_paralelo);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/profesorasignaturaparalelo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield ProfesorAsignaturaParaleloNegocio_1.default.deleteProfesorAsignaturaParalelo(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/profesorasignaturaparalelo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield ProfesorAsignaturaParaleloNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
