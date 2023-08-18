document.addEventListener("DOMContentLoaded", () => {
  const newFile = document.querySelector(".new-file"),
    textArea = document.querySelector("textarea"),
    openFile = document.querySelector(".open-file"),
    fileInput = document.querySelector("#file-input"),
    copyBtn = document.querySelector(".copy"),
    copyLink = document.querySelector(".copy a"),
    cutBtn = document.querySelector(".cut"),
    cutLink = document.querySelector(".cut a"),
    deleteBtn = document.querySelector(".delete"),
    deleteLink = document.querySelector(".delete a"),
    pasteBtn = document.querySelector(".paste"),
    saveAsBtn = document.querySelector(".save-as"),
    saveBtn = document.querySelector(".save"),
    selectAllBtn = document.querySelector(".select-all"),
    title = document.querySelector(".title"),
    undoBtn = document.querySelector(".undo"),
    titleNameInput = document.querySelector("#title");

  title.textContent = `Notepad`;
  const history = JSON.parse(sessionStorage.getItem("history")) || [];
  let currentIndex = history.length - 1;

  if (sessionStorage.getItem("text")) {
    textArea.value = sessionStorage.getItem("text");

    copyLink.classList.remove("disabled");
    cutLink.classList.remove("disabled");
    deleteLink.classList.remove("disabled");
  }
  if (sessionStorage.getItem("title")) {
    title.textContent = sessionStorage.getItem("title");
  } else {
    title.textContent = "Notepad";
  }

  saveBtn.addEventListener("click", () => {
    titleNameInput.style.display = "block";
    titleNameInput.value = title.textContent;
    titleNameInput.addEventListener("input", () => {
      title.textContent = titleNameInput.value;
      if (titleNameInput.value.trim() === "") {
        title.textContent = "Notepad";
      }
      sessionStorage.setItem("title", title.textContent);
    });
  });
  titleNameInput.addEventListener("focusout", () => {
    titleNameInput.style.display = "none";
  });
  selectAllBtn.addEventListener("click", () => {
    textArea.select();
  });

  undoBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      textArea.value = history[currentIndex];
      sessionStorage.setItem("text", textArea.value);
    }
  });

  saveAsBtn.addEventListener("click", () => {
    const content = textArea.value;
    const blob = new Blob([content], { type: "text/plain" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title.textContent}.txt`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  });

  openFile.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const content = e.target.result;
        textArea.value = content;
        sessionStorage.setItem("text", textArea.value);
      };

      reader.readAsText(file);
    }
  });

  pasteBtn.addEventListener("click", () => {
    navigator.clipboard.readText().then((text) => {
      textArea.value += text;
    });
  });

  textArea.addEventListener("input", () => {
    sessionStorage.setItem("text", textArea.value);
    updateHistory();

    copyLink.classList.remove("disabled");
    cutLink.classList.remove("disabled");
    deleteLink.classList.remove("disabled");
  });

  deleteBtn.addEventListener("click", () => {
    textArea.value =
      textArea.value.substring(0, textArea.selectionStart) +
      textArea.value.substring(textArea.selectionEnd);

    updateHistory();
    sessionStorage.removeItem("text");

    cutBtn.classList.add("disabled");
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(textArea.value);
  });

  cutBtn.addEventListener("click", () => {
    const selectedText = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);

    navigator.clipboard.writeText(selectedText);

    textArea.value =
      textArea.value.substring(0, textArea.selectionStart) +
      textArea.value.substring(textArea.selectionEnd);

    updateHistory();
    sessionStorage.setItem("text", textArea.value);

    cutBtn.classList.add("disabled");
  });

  newFile.addEventListener("click", () => {
    textArea.value = "";
    updateHistory();
    sessionStorage.removeItem("text");
  });

  const updateHistory = () => {
    if (currentIndex < history.length - 1) {
      history.splice(currentIndex + 1);
    }
    history.push(textArea.value);
    currentIndex = history.length - 1;
    sessionStorage.setItem("history", JSON.stringify(history));
  };
});
