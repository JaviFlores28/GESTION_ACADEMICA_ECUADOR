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
const ParcialNegocio_1 = __importDefault(require("../Negocio/ParcialNegocio"));
const ParcialEntidad_1 = __importDefault(require("../Entidades/ParcialEntidad"));
router.get('/parcial', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcial = yield ParcialNegocio_1.default.getParcial();
        res.json(parcial);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/parcial', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const parcial = new ParcialEntidad_1.default(request.PRCL_ID, request.PRCL_NOM, request.PRCL_INI, request.PRCL_FIN, request.ESTADO, request.PRCL_TIPO, request.PRD_ID, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield ParcialNegocio_1.default.addParcial(parcial);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/parcial', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const parcial = new ParcialEntidad_1.default(request.PRCL_ID, request.PRCL_NOM, request.PRCL_INI, request.PRCL_FIN, request.ESTADO, request.PRCL_TIPO, request.PRD_ID, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield ParcialNegocio_1.default.updateParcial(parcial);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/parcial/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield ParcialNegocio_1.default.deleteParcial(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/parcial/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield ParcialNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
