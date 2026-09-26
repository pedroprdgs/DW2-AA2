import express from "express";
import { create, list, get, update, fDelete, relatorio } from "../controllers/ordensController.js";

const router = express.Router();

router.post("/ordens", create);
router.get("/ordens", list);
router.get("/ordens/:codigoOrdem", get);
router.put("/ordens/:codigoOrdem", update);
router.delete("/ordens/:codigoOrdem", fDelete);

router.get("/relatorios/ordens", relatorio);

export default router;