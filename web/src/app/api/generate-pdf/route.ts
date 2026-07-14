// app/api/generate-pdf/route.ts

import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

// Limite de tamanho do HTML recebido (defesa contra abuso de recursos)
const MAX_HTML_BYTES = 2_000_000; // 2 MB

// Só permite que o próprio app dispare a geração de PDF.
function isSameOrigin(req: NextRequest): boolean {
  const host = req.headers.get("host");
  if (!host) return false;

  const check = (value: string | null): boolean => {
    if (!value) return true; // ausência é tratada separadamente
    try {
      return new URL(value).host === host;
    } catch {
      return false;
    }
  };

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  // Exige pelo menos um dos dois e que bata com o host atual.
  if (!origin && !referer) return false;
  return check(origin) && check(referer);
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;

  try {
    const { htmlContent, width, height } = await req.json();

    if (!htmlContent || typeof htmlContent !== "string") {
      return NextResponse.json(
        { message: "HTML content is required." },
        { status: 400 }
      );
    }

    if (Buffer.byteLength(htmlContent, "utf8") > MAX_HTML_BYTES) {
      return NextResponse.json(
        { message: "HTML content too large." },
        { status: 413 }
      );
    }

    const safeWidth =
      Number.isFinite(width) && width > 0 && width <= 5000 ? width : 1024;
    const safeHeight =
      Number.isFinite(height) && height > 0 && height <= 20000 ? height : 768;

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Relatório é estático: JS desligado impede execução de miners/scripts injetados.
    await page.setJavaScriptEnabled(false);

    // Bloqueia QUALQUER carregamento de sub-recurso (img/css/fetch/file://),
    // fechando SSRF (IPs internos, metadata de cloud) e download de payloads.
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = request.url();
      // O documento inicial vem via setContent como data: — os demais são abortados.
      if (url.startsWith("data:")) {
        void request.continue();
      } else {
        void request.abort();
      }
    });

    await page.setViewport({ width: safeWidth, height: safeHeight });

    await page.setContent(htmlContent, {
      waitUntil: "load",
      timeout: 15_000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="perfil-risco.pdf"',
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { message: "Failed to generate PDF." },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close().catch(() => undefined);
    }
  }
}
