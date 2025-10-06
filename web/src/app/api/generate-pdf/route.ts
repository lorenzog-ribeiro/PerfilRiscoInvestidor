import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  console.log('[PDF API] Request received');
  
  try {
    // ✅ Receba as dimensões
    const { htmlContent, width, height } = await req.json();
    
    console.log('[PDF API] Request data:', {
      htmlLength: htmlContent?.length,
      width,
      height
    });

    if (!htmlContent) {
      console.error('[PDF API] No HTML content provided');
      return NextResponse.json(
        { message: "HTML content is required." },
        { status: 400 }
      );
    }

    console.log('[PDF API] Launching Puppeteer...');
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox", 
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu"
      ],
    });
    
    console.log('[PDF API] Puppeteer launched, creating page...');
    const page = await browser.newPage();

    // ✅ Defina o viewport com as dimensões recebidas
    await page.setViewport({ width: width || 1024, height: height || 768 });
    
    console.log('[PDF API] Setting content...');
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      timeout: 30000
    });

    console.log('[PDF API] Generating PDF...');
    const pdfBuffer = await page.pdf({
      // ✅ A altura se ajustará automaticamente ao conteúdo
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });

    console.log('[PDF API] PDF generated, size:', pdfBuffer.length, 'bytes');
    await browser.close();

    // Convert Uint8Array to Buffer for NextResponse
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="perfil-risco.pdf"',
      },
    });
  } catch (error) {
    console.error("[PDF API] Error generating PDF:", error);
    return NextResponse.json(
      { 
        message: "Failed to generate PDF.", 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}