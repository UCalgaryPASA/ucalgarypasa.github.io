function showPDF(name) {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";

    const viewer = document.getElementById("pdf");
    viewer.src = `/assets/resources/pdfjs-4.0.379-dist/web/viewer.html?file=${window.location.origin}/assets/pdfs/${name}`;
    viewer.height = overlay.clientHeight*0.95;
}

function hidePDF() {
    document.getElementById("overlay").style.display = "none";
};

const documentArea = "#content";

const pdfs = [
    {
        display: "Constitution",
        file: "constitution.pdf"
    },
    {
        display: "Election Norms",
        file: "elecnorms.pdf"
    }
]

$(document).ready(function() {
    pdfs.forEach(pdf => {
        html = `<div>
            <h3>${pdf.display}</h3>
            <hr>
            <button onclick="showPDF('${pdf.file}');">Show PDF</button>
        </div>`;
        $(html).appendTo(documentArea);
    });
});