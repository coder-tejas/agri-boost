import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { generateSoilReportHTML } from "@/lib/SoilReportHtml";
import logger from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const { analysisData } = await req.json();
    const html = generateSoilReportHTML(analysisData);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "30px", bottom: "30px", left: "20px", right: "20px" },
    });

    await browser.close();

    const arrayBuffer: ArrayBuffer =
      pdfBuffer instanceof ArrayBuffer
        ? pdfBuffer
        : (pdfBuffer.buffer as ArrayBuffer).slice(
            pdfBuffer.byteOffset,
            pdfBuffer.byteOffset + pdfBuffer.byteLength
          );

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=soil_report.pdf",
      },
    });
  } catch (error) {
    logger.error({ error }, "PDF generation error");
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
