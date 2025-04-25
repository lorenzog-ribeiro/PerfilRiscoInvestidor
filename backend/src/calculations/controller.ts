import { Request, Response } from "express";

// export const ganho = async (req: Request, res: Response) => {
//     try {
//         const { Inteiro, Ganho, Perda, Pergunta } = req.body;
//         const calculo: number[] = [];
//         console.log(Inteiro, Ganho, Perda, Pergunta);

//         const base = (((Inteiro * 1 / 2) + (Perda * 1 / 2)) - (0 * 0) / 100);
//         var Acumulado = base;

//         for(var i = 1; i < Pergunta; i++)
//         {
//             Acumulado = Acumulado + (base/2**i);
//             calculo.push(parseFloat(Acumulado.toFixed(2)));
//         }

//         res.status(200).json({ calculo });
//     } catch (error: any) {

//     }
// }

export const ganho = async (req: Request, res: Response) => {
    try {
        const { Inteiro, Ganho, Perda, Pergunta } = req.body;
        var calculo: any = 0;
        var calculoAnterior: any = 0;

        const base = (((Inteiro * 0.5) + (Perda * 0.5)) - (0 * 0) / 100);
        console.log(base);
        if (Pergunta == 1) {
            calculo = base;
        }
        if (Pergunta == 2) {
            calculo = base + (base / (2 ** (Pergunta - 1)));
        }
        if (Pergunta > 1) {
            calculoAnterior = base + (base / (2 ** (Pergunta - 1)));
            console.log(calculoAnterior)
        }
        if (Pergunta > 2) {
            calculoAnterior = calculoAnterior + (base / (2 ** (Pergunta - 1)));
        }
        calculo = calculoAnterior + (base / (2 ** (Pergunta)));


        res.status(200).json({ calculo });
    } catch (error: any) {

    }
}

export const perda = async (req: Request, res: Response) => {
    try {
        const { Inteiro, Ganho, Perda, Pergunta } = req.body;
        const calculo: number[] = [];
        console.log(Inteiro, Ganho, Perda, Pergunta);

        const base = (((Inteiro * 1 / 2) + (Perda * 1 / 2)) - (0 * 0) / 100);
        var Acumulado = base;

        for (var i = 1; i < Pergunta; i++) {
            Acumulado = Acumulado - (base / 2 ** i);
            calculo.push(parseFloat(Acumulado.toFixed(2)));
        }

        res.status(200).json({ calculo });
    } catch (error: any) {

    }
}

export const perdaperganho = async (req: Request, res: Response) => {
    try {

        res.status(200).json();
    } catch (error: any) {

    }
}