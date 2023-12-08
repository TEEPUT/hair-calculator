function DropFile(dropAreaId, fileListId) {
  let dropArea = document.getElementById(dropAreaId);
  let fileListElement = document.getElementById(fileListId);

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function highlight(e) {
    preventDefaults(e);
    dropArea.classList.add("highlight");
  }

  function unhighlight(e) {
    preventDefaults(e);
    dropArea.classList.remove("highlight");
  }

  function handleDrop(e) {
    unhighlight(e);
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);

    if (fileListElement) {
      fileListElement.scrollTo({ top: fileListElement.scrollHeight });
    }
  }

  function handleFiles(files) {
    files = [...files];
    // files.forEach(uploadFile);
    files.forEach(previewFile);
  }

  function previewFile(file) {
    console.log(file);
    renderFile(file);
  }

  function renderFile(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      let dropArea = document.getElementById(dropAreaId);
      if (dropArea) {
        let img = dropArea.getElementsByClassName("preview")[0];
        if (img) {
          img.src = reader.result;
          img.style.display = "block";
        } else {
          console.error("Image element not found");
        }
      } else {
        console.error("Drop area element not found");
      }
    };
  }
  
  return {
    handleFiles,
  };
}

const dropFile = new DropFile("drop-file", "files");
