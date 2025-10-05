// pages/api/generate-pdf.ts

import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("teste");
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { htmlContent } = req.body;

  if (!htmlContent) {
    return res.status(400).json({ message: "HTML content is required." });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Opções de segurança para ambientes de produção
    });
    const page = await browser.newPage();

    // Define as dimensões da página
    await page.setViewport({ width: 1024, height: 768 });

    // Injeta o HTML e espera a renderização
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0", // Espera a rede ficar inativa para garantir que tudo carregou
    });

    // Gera o PDF a partir da página renderizada
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });

    await browser.close();

    // Envia o PDF como resposta
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="perfil-risco.pdf"'
    );
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Failed to generate PDF." });
  }
}
