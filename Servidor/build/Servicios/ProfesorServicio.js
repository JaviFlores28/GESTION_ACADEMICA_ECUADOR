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
const ProfesorNegocio_1 = __importDefault(require("../Negocio/ProfesorNegocio"));
const ProfesorEntidad_1 = __importDefault(require("../Entidades/ProfesorEntidad"));
router.get('/profesor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesor = yield ProfesorNegocio_1.default.getProfesor();
        res.json(profesor);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/profesor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const profesor = new ProfesorEntidad_1.default(request.PRF_ID, request.PRF_FECH_INGR_INST, request.PRF_FECH_INGR_MAG, request.USR_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield ProfesorNegocio_1.default.addProfesor(profesor);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/profesor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const profesor = new ProfesorEntidad_1.default(request.PRF_ID, request.PRF_FECH_INGR_INST, request.PRF_FECH_INGR_MAG, request.USR_ID, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield ProfesorNegocio_1.default.updateProfesor(profesor);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/profesor/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield ProfesorNegocio_1.default.deleteProfesor(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/profesor/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield ProfesorNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
