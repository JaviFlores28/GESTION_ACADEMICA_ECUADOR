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
const AreaNegocio_1 = __importDefault(require("../Negocio/AreaNegocio"));
const AreaEntidad_1 = __importDefault(require("../Entidades/AreaEntidad"));
router.get('/area', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const area = yield AreaNegocio_1.default.getArea();
        res.json(area);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/area', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const area = new AreaEntidad_1.default(request.AREA_ID, request.AREA_NOM, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield AreaNegocio_1.default.addArea(area);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/area', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const area = new AreaEntidad_1.default(request.AREA_ID, request.AREA_NOM, request.ESTADO, request.CREADOR_ID, request.FECHA_CREACION);
        const response = yield AreaNegocio_1.default.updateArea(area);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/area/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield AreaNegocio_1.default.deleteArea(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/area/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield AreaNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
