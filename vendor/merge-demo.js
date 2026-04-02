const mergeState = {
  items: []
};

function formatSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function setFeedback(message, type = "") {
  const feedback = document.getElementById("feedback");
  if (!feedback) {
    return;
  }

  feedback.textContent = message;
  feedback.classList.remove("is-error", "is-success");
  if (type) {
    feedback.classList.add(type);
  }
}

function refreshLibraryStatus() {
  const status = document.getElementById("libraryStatus");
  if (!status) {
    return;
  }

  if (window.PDFLib && window.PDFLib.PDFDocument) {
    status.textContent = "PDF merge engine ready";
    status.classList.add("is-ready");
    setFeedback("Add PDF files to begin.");
  } else {
    status.textContent = "Demo mode active";
    status.classList.add("is-warning");
    setFeedback("The page is ready for demo use. Live merging needs the PDF library to load.", "is-error");
  }
}

function moveItem(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= mergeState.items.length) {
    return;
  }

  const [item] = mergeState.items.splice(index, 1);
  mergeState.items.splice(target, 0, item);
  renderFileList();
}

function removeItem(index) {
  mergeState.items.splice(index, 1);
  renderFileList();
  if (!mergeState.items.length) {
    setFeedback("Add PDF files to begin.");
  }
}

function renderFileList() {
  const fileList = document.getElementById("fileList");
  if (!fileList) {
    return;
  }

  fileList.innerHTML = "";

  mergeState.items.forEach((item, index) => {
    const row = document.createElement("li");
    row.className = "file-item";
    row.innerHTML = `
      <div class="file-meta">
        <strong>${item.file.name}</strong>
        <span>${formatSize(item.file.size)} • Position ${index + 1}</span>
      </div>
      <div class="file-controls">
        <button class="chip-button" type="button" data-action="up" data-index="${index}" aria-label="Move ${item.file.name} up">↑</button>
        <button class="chip-button" type="button" data-action="down" data-index="${index}" aria-label="Move ${item.file.name} down">↓</button>
        <button class="chip-button" type="button" data-action="remove" data-index="${index}" aria-label="Remove ${item.file.name}">Remove</button>
      </div>
    `;
    fileList.appendChild(row);
  });
}

function addFiles(fileList) {
  const pdfFiles = [...fileList].filter((file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));
  if (!pdfFiles.length) {
    setFeedback("Please choose valid PDF files only.", "is-error");
    return;
  }

  pdfFiles.forEach((file) => {
    mergeState.items.push({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file
    });
  });

  renderFileList();
  setFeedback(`${mergeState.items.length} PDF file(s) ready for merge.`, "is-success");
}

async function mergeFiles() {
  if (mergeState.items.length < 2) {
    setFeedback("Add at least two PDF files before merging.", "is-error");
    return;
  }

  if (!(window.PDFLib && window.PDFLib.PDFDocument)) {
    setFeedback("The live merge engine is unavailable. Host the page online so the PDF library can load.", "is-error");
    return;
  }

  const { PDFDocument } = window.PDFLib;
  const filenameInput = document.getElementById("filenameInput");
  const outputName = (filenameInput?.value || "exampdfx-merged").trim() || "exampdfx-merged";

  try {
    setFeedback("Merging files, please wait...");
    const mergedPdf = await PDFDocument.create();

    for (const item of mergeState.items) {
      const bytes = await item.file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(bytes);
      const pageIndices = sourcePdf.getPageIndices();
      const copiedPages = await mergedPdf.copyPages(sourcePdf, pageIndices);
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = `${outputName}.pdf`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);

    setFeedback(`Merged PDF downloaded as ${outputName}.pdf`, "is-success");
  } catch (error) {
    setFeedback("Something went wrong while merging the files. Try different PDFs for the demo.", "is-error");
  }
}

function clearFiles() {
  mergeState.items = [];
  renderFileList();
  setFeedback("File list cleared.");
}

function wireTool() {
  const input = document.getElementById("pdfInput");
  const dropZone = document.getElementById("dropZone");
  const mergeButton = document.getElementById("mergeButton");
  const clearButton = document.getElementById("clearButton");
  const fileList = document.getElementById("fileList");

  if (!input || !dropZone || !mergeButton || !clearButton || !fileList) {
    return;
  }

  input.addEventListener("change", (event) => {
    const target = event.target;
    if (target.files) {
      addFiles(target.files);
    }
    target.value = "";
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("is-dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove("is-dragover");
    });
  });

  dropZone.addEventListener("drop", (event) => {
    const files = event.dataTransfer?.files;
    if (files) {
      addFiles(files);
    }
  });

  dropZone.addEventListener("click", () => {
    input.click();
  });

  mergeButton.addEventListener("click", mergeFiles);
  clearButton.addEventListener("click", clearFiles);

  fileList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) {
      return;
    }

    const index = Number(button.dataset.index);
    const action = button.dataset.action;

    if (action === "up") {
      moveItem(index, -1);
    }
    if (action === "down") {
      moveItem(index, 1);
    }
    if (action === "remove") {
      removeItem(index);
    }
  });

  refreshLibraryStatus();
  setTimeout(refreshLibraryStatus, 1800);
  window.addEventListener("load", refreshLibraryStatus);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", wireTool);
} else {
  wireTool();
}
