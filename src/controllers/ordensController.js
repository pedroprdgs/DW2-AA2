import { criarOrdem, listarOrdens, buscarOrdem, atualizarOrdem, deletarOrdem, gerarRelatorio } from "../services/ordensServices.js";

export function create(req, res){
    try{
        const ordem = criarOrdem(req.body);

        return res.status(201).json(ordem);
    }

    catch(error){
        return res.status(400).json({
            erro: error.message
        });
    }
}

export function list(req, res){
    const { tipo, alerta } = req.query;

    const ordens = listarOrdens({ tipo, alerta });

    return res.status(200).json(ordens);
}

export function get(req, res){
    const { codigoOrdem } = req.params;

    const ordem = buscarOrdem(codigoOrdem);

    if(!ordem){
        return res.status(404).json({
            erro: "Ordem não encontrada."
        });
    }

    return res.status(200).json(ordem);
}

export function update(req, res){
    try{
        const { codigoOrdem } = req.params;

        const ordem = atualizarOrdem(codigoOrdem, req.body);

        return res.status(200).json(ordem);
    }

    catch(error){
        const status = error.message === "Ordem não encontrada." ? 404 : 400;

        return res.status(status).json({
            erro: error.message
        });
    }
}

export function fDelete(req, res){
    try{
        const { codigoOrdem } = req.params;

        deletarOrdem(codigoOrdem);

        return res.status(200).json({
            mensagem: "Ordem removida com sucesso."
        });
    }

    catch(error){
        return res.status(404).json({
            erro: error.message
        });
    }
}

export function relatorio(_req, res){
    const relatorio = gerarRelatorio();

    return res.status(200).json(relatorio);
}