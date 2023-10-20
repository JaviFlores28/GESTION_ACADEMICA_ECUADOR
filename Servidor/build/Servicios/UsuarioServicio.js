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
const UsuarioNegocio_1 = __importDefault(require("../Negocio/UsuarioNegocio"));
const UsuarioEntidad_1 = __importDefault(require("../Entidades/UsuarioEntidad"));
router.get('/usuario', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield UsuarioNegocio_1.default.getUsuario();
        res.json(usuario);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post('/usuario', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const usuario = new UsuarioEntidad_1.default(request.USR_ID, request.USR_DNI, request.USR_NOM, request.USR_NOM2, request.USR_APE, request.USR_APE2, request.USR_DIR, request.USR_TEL, request.USR_CEL, request.USR_EMAIL, request.USR_FECH_NAC, request.USR_GEN, request.USUARIO, request.USR_PSWD, request.ROL_PRF, request.ROL_REPR, request.ROL_ADMIN, request.ESTADO, request.FECHA_CREACION);
        const response = yield UsuarioNegocio_1.default.addUsuario(usuario);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put('/usuario', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const usuario = new UsuarioEntidad_1.default(request.USR_ID, request.USR_DNI, request.USR_NOM, request.USR_NOM2, request.USR_APE, request.USR_APE2, request.USR_DIR, request.USR_TEL, request.USR_CEL, request.USR_EMAIL, request.USR_FECH_NAC, request.USR_GEN, request.USUARIO, request.USR_PSWD, request.ROL_PRF, request.ROL_REPR, request.ROL_ADMIN, request.ESTADO, request.FECHA_CREACION);
        const response = yield UsuarioNegocio_1.default.updateUsuario(usuario);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.delete('/usuario/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield UsuarioNegocio_1.default.deleteUsuario(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/usuario/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield UsuarioNegocio_1.default.searchById(id);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.patch('/usuario/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { pswdNew, pswdOld } = req.body;
        const response = yield UsuarioNegocio_1.default.updatePswdUsuario(id, pswdOld, pswdNew);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.patch('/loginUsuario', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario, pswd } = req.body;
        const response = yield UsuarioNegocio_1.default.loginUsuario(usuario, pswd);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
