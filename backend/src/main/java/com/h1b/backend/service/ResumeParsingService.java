package com.h1b.backend.service;

import java.io.IOException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

@Service
public class ResumeParsingService {

    public String extractText(byte[] pdfData) {
        if (pdfData == null || pdfData.length == 0) {
            return "";
        }
        // PDFBox 2.0.30 Code
        try (PDDocument document = PDDocument.load(pdfData)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (IOException e) {
            System.err.println("Error parsing PDF: " + e.getMessage());
            return "";
        }
    }
}
