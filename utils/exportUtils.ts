import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const exportToExcel = (reviews: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(
        reviews.map(review => ({
            'Date': new Date(review.createdAt).toLocaleDateString(),
            'Service': review.service.replace('_', ' '),
            'Rating': `${review.rating} Stars`,
            'Client Name': review.clientName,
            'Company': review.companyName || 'N/A',
            'Email': review.clientEmail,
            'Phone': review.phoneNumber || 'N/A',
            'Review': review.content
        }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reviews')

    // Generate buffer
    XLSX.writeFile(workbook, 'reviews_export.xlsx')
}

export const exportToPDF = (reviews: any[]) => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(16)
    doc.text('Reviews Export', 14, 15)
    doc.setFontSize(10)
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22)

    // Prepare the data
    const tableData = reviews.map(review => [
        new Date(review.createdAt).toLocaleDateString(),
        review.service.replace('_', ' '),
        `${review.rating} Stars`,
        review.clientName,
        review.companyName || 'N/A',
        review.clientEmail,
        review.phoneNumber || 'N/A',
        review.content
    ])

    // Add the table
    autoTable(doc, {
        head: [['Date', 'Service', 'Rating', 'Client Name', 'Company', 'Email', 'Phone', 'Review']],
        body: tableData,
        startY: 25,
        styles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 20 },  // Date
            1: { cellWidth: 25 },  // Service
            2: { cellWidth: 15 },  // Rating
            3: { cellWidth: 25 },  // Client Name
            4: { cellWidth: 25 },  // Company
            5: { cellWidth: 35 },  // Email
            6: { cellWidth: 20 },  // Phone
            7: { cellWidth: 'auto' } // Review
        },
        headStyles: {
            fillColor: [212, 84, 44], // Your primary color #d4542c
            textColor: 255
        }
    })

    // Save the PDF
    doc.save('reviews_export.pdf')
} 