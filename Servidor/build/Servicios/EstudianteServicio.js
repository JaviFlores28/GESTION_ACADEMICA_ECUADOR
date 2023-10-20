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
const EstudianteNegocio_1 = __importDefault(require("../Negocio/EstudianteNegocio"));
const EstudianteEntidad_1 = __importDefault(require("../Entidades/EstudianteEntidad"));
router.get('/estudiante', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudiante = yield EstudianteNegocio_1.default.getEstudiante();
        res.json(estudiante);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/estudiante', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const estudiante = new EstudianteEntidad_1.default(request.EST_ID, request.EST_DNI, request.EST_NOM, request.EST_NOM2, request.EST_APE, request.EST_APE2, request.EST_FECH_NAC, request.EST_GEN, request.EST_PRV, request.EST_CAN, request.EST_PARR, request.EST_DIR, request.EST_NAC, request.EST_ETN, request.EST_NAC_ETN, request.EST_COM_ETN, request.EST_COD_ELE, request.EST_NEC_ASO_DIS, request.EST_NEC_NO_ASO_DIS, request.EST_ENF_CAT, request.EST_NUM_CONA, request.EST_INTE, request.EST_TV, request.EST_RAD, request.EST_PC, request.EST_CEL, request.REPR_ID, request.REL_EST_REP, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield EstudianteNegocio_1.default.addEstudiante(estudiante);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/estudiante', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const estudiante = new EstudianteEntidad_1.default(request.EST_ID, request.EST_DNI, request.EST_NOM, request.EST_NOM2, request.EST_APE, request.EST_APE2, request.EST_FECH_NAC, request.EST_GEN, request.EST_PRV, request.EST_CAN, request.EST_PARR, request.EST_DIR, request.EST_NAC, request.EST_ETN, request.EST_NAC_ETN, request.EST_COM_ETN, request.EST_COD_ELE, request.EST_NEC_ASO_DIS, request.EST_NEC_NO_ASO_DIS, request.EST_ENF_CAT, request.EST_NUM_CONA, request.EST_INTE, request.EST_TV, request.EST_RAD, request.EST_PC, request.EST_CEL, request.REPR_ID, request.REL_EST_REP, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield EstudianteNegocio_1.default.updateEstudiante(estudiante);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/estudiante/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield EstudianteNegocio_1.default.deleteEstudiante(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/estudiante/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield EstudianteNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
