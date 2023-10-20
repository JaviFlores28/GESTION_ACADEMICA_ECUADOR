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
const AnioLectivoNegocio_1 = __importDefault(require("../Negocio/AnioLectivoNegocio"));
const AnioLectivoEntidad_1 = __importDefault(require("../Entidades/AnioLectivoEntidad"));
router.get('/aniolectivo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const anio_lectivo = yield AnioLectivoNegocio_1.default.getAnioLectivo();
        res.json(anio_lectivo);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/aniolectivo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const anio_lectivo = new AnioLectivoEntidad_1.default(request.AL_ID, request.AL_NOM, request.AL_INICIO, request.AL_FIN, request.AL_POR_PRD, request.AL_POR_EXAM, request.CLFN__MIN_APR, request.CLFN__MIN_PERD, request.NUM_PRD, request.NUM_EXAM, request.NUM_PRCL, request.NUM_SUSP, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield AnioLectivoNegocio_1.default.addAnioLectivo(anio_lectivo);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/aniolectivo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const anio_lectivo = new AnioLectivoEntidad_1.default(request.AL_ID, request.AL_NOM, request.AL_INICIO, request.AL_FIN, request.AL_POR_PRD, request.AL_POR_EXAM, request.CLFN__MIN_APR, request.CLFN__MIN_PERD, request.NUM_PRD, request.NUM_EXAM, request.NUM_PRCL, request.NUM_SUSP, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield AnioLectivoNegocio_1.default.updateAnioLectivo(anio_lectivo);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/aniolectivo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield AnioLectivoNegocio_1.default.deleteAnioLectivo(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/aniolectivo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield AnioLectivoNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
