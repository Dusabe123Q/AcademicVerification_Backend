package com.dusabe.controller;

import com.dusabe.entity.Credential;
import com.dusabe.service.CredentialService;
import com.dusabe.service.QrCodeService;
import com.google.zxing.WriterException;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/credentials")
public class PdfController {

    private final CredentialService credentialService;
    private final QrCodeService qrCodeService;

    public PdfController(CredentialService credentialService, QrCodeService qrCodeService) {
        this.credentialService = credentialService;
        this.qrCodeService = qrCodeService;
    }

    @GetMapping("/public/{serialNumber}/pdf")
    public ResponseEntity<byte[]> downloadPublicCredentialPdf(@PathVariable String serialNumber) throws IOException, WriterException {
        Credential credential = credentialService.getCredentialBySerialNumber(serialNumber);
        if (credential == null) {
            return ResponseEntity.notFound().build();
        }
        return generatePdfResponse(credential);
    }

    private ResponseEntity<byte[]> generatePdfResponse(Credential credential) throws IOException, WriterException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc, PageSize.A4);
        document.setMargins(40, 50, 40, 50);

        PdfFont boldFont   = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont normalFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        DeviceRgb purple     = new DeviceRgb(99, 102, 241);
        DeviceRgb lightGray  = new DeviceRgb(248, 250, 252);
        DeviceRgb darkText   = new DeviceRgb(30, 41, 59);

        // Header Banner
        Table headerTable = new Table(UnitValue.createPercentArray(new float[]{1}))
                .useAllAvailableWidth()
                .setBackgroundColor(purple);

        Cell headerCell = new Cell()
                .add(new Paragraph("AcademiVerify")
                        .setFont(boldFont).setFontSize(26).setFontColor(ColorConstants.WHITE)
                        .setTextAlignment(TextAlignment.CENTER))
                .add(new Paragraph("Official Academic Credential Certificate")
                        .setFont(normalFont).setFontSize(12).setFontColor(new DeviceRgb(199, 210, 254))
                        .setTextAlignment(TextAlignment.CENTER))
                .setPadding(24).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER);
        headerTable.addCell(headerCell);
        document.add(headerTable);
        document.add(new Paragraph("\n"));

        // Certificate Title
        document.add(new Paragraph("CERTIFICATE OF CREDENTIAL")
                .setFont(boldFont).setFontSize(20).setFontColor(darkText)
                .setTextAlignment(TextAlignment.CENTER).setMarginBottom(24));

        // Details Table
        Table detailsTable = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
                .useAllAvailableWidth()
                .setBackgroundColor(lightGray)
                .setBorder(new SolidBorder(new DeviceRgb(226, 232, 240), 1));

        String studentName = (credential.getStudent() != null) ? credential.getStudent().getName() : "N/A";
        String program     = (credential.getStudent() != null) ? credential.getStudent().getProgram() : "N/A";

        addRow(detailsTable, "Credential Type", credential.getCredential_type(), boldFont, normalFont, darkText);
        addRow(detailsTable, "Serial Number",   credential.getSerial_number(),   boldFont, normalFont, darkText);
        addRow(detailsTable, "Issue Date",      credential.getIssue_date() != null ? credential.getIssue_date().toString() : "N/A", boldFont, normalFont, darkText);
        addRow(detailsTable, "Student Name",    studentName, boldFont, normalFont, darkText);
        addRow(detailsTable, "Program",         program,     boldFont, normalFont, darkText);
        document.add(detailsTable);

        // QR Code
        String publicUrl = "http://localhost:5173/verify/" + credential.getSerial_number();
        byte[] qrBytes = qrCodeService.generateQrCode(publicUrl, 120, 120);
        com.itextpdf.io.image.ImageData imgData = com.itextpdf.io.image.ImageDataFactory.create(qrBytes);
        com.itextpdf.layout.element.Image qrImage = new com.itextpdf.layout.element.Image(imgData)
                .setWidth(90).setHorizontalAlignment(HorizontalAlignment.CENTER);
        document.add(new Paragraph("\nScan to Verify Online").setFont(boldFont).setFontSize(10).setTextAlignment(TextAlignment.CENTER));
        document.add(qrImage);

        // Footer
        document.add(new Paragraph("\nOfficial institutional document generated by AcademiVerify.").setFont(normalFont).setFontSize(9).setTextAlignment(TextAlignment.CENTER));

        document.close();
        byte[] pdfBytes = outputStream.toByteArray();
        String filename = "credential-" + credential.getSerial_number() + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ALUMNI')")
    public ResponseEntity<byte[]> downloadCredentialPdf(@PathVariable Long id) throws IOException, WriterException {
        Credential credential = credentialService.getCredentialById(id);
        if (credential == null) {
            return ResponseEntity.notFound().build();
        }
        return generatePdfResponse(credential);
    }

    private void addRow(Table table, String label, String value, PdfFont boldFont, PdfFont normalFont, DeviceRgb darkText) {
        table.addCell(new Cell()
                .add(new Paragraph(label).setFont(boldFont).setFontSize(11).setFontColor(darkText))
                .setPadding(10).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
        table.addCell(new Cell()
                .add(new Paragraph(value != null ? value : "N/A").setFont(normalFont).setFontSize(11).setFontColor(darkText))
                .setPadding(10).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
    }

    @GetMapping("/{id}/qrcode")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ALUMNI')")
    public ResponseEntity<byte[]> getQrCode(@PathVariable Long id) throws IOException, WriterException {
        Credential credential = credentialService.getCredentialById(id);
        if (credential == null) {
            return ResponseEntity.notFound().build();
        }
        String publicUrl = "http://localhost:5173/verify/" + credential.getSerial_number();
        byte[] qrBytes = qrCodeService.generateQrCode(publicUrl, 250, 250);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qrBytes);
    }
}
