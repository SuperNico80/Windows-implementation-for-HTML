const btn = document.querySelector(".select_style");
const select = document.getElementById("style_listid");

btn.onclick = () => {
  document.body.className = select.value;
};
// Wallpaper button
const btn2 = document.querySelector(".select_wallpaper");
const select2 = document.getElementById("wallpaper_listid");

btn2.onclick = () => {
    actualizarMetroAccent();
  const valor = select2.value;

  if (valor.startsWith("#")) {
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = valor;
  } else {
    document.body.style.backgroundColor = "";
    document.body.style.backgroundImage = `url(${valor})`;
  }
};

// 🔥 COLOR PICKER (SEPARADO)
const btn3 = document.querySelector(".apply_color");
const input3 = document.getElementById("color_picker");

btn3.onclick = () => {
  const color = input3.value;

  document.body.style.backgroundImage = "none";
  document.body.style.backgroundColor = color;
};
const inputURL = document.getElementById("wallpaper_url");
const btnURL = document.querySelector(".apply_wallpaper_url");

btnURL.onclick = () => {
  const url = inputURL.value.trim();

  if (!url) return;

  document.body.style.backgroundColor = "";
  document.body.style.backgroundImage = `url("${url}")`;
};
    </script>
    <script>
function initWallpaper() {
  btn2.addEventListener("click", () => {
    aplicarWallpaper(select2.value);
  });
}

function initColor() {
  input3.addEventListener("input", () => {
    const color = input3.value;

    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = color;

    document.documentElement.style.setProperty("--accent-color", color);
  });
}

initWallpaper();
initColor();
function actualizarMetroAccent() {
  // Solo aplicar en Metro
  if (!document.body.classList.contains("windows_8")) return;

  const bgImage = document.body.style.backgroundImage;
  const bgColor = getComputedStyle(document.body).backgroundColor;

  // Caso 1: Imagen
  if (bgImage && bgImage !== "none") {
    const imageUrl = bgImage.slice(5, -2); // extraer URL

    obtenerColorImagen(imageUrl, (color) => {
      const oscuro = oscurecerHex(color, 0.12);
      document.documentElement.style.setProperty("--accent-color", oscuro);
    });

  } else {
    // Caso 2: Color sólido
    const rgb = bgColor.match(/\d+/g);

    if (rgb) {
      const hex = `#${parseInt(rgb[0]).toString(16).padStart(2, "0")}${parseInt(rgb[1]).toString(16).padStart(2, "0")}${parseInt(rgb[2]).toString(16).padStart(2, "0")}`;

      const oscuro = oscurecerHex(hex, 0.12);

      document.documentElement.style.setProperty("--accent-color", oscuro);
    }
  }
}
function obtenerColorImagen(url, callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 1;
    canvas.height = 1;

    ctx.drawImage(img, 0, 0, 1, 1);

    const data = ctx.getImageData(0, 0, 1, 1).data;

    const hex = `#${data[0].toString(16).padStart(2,"0")}${data[1].toString(16).padStart(2,"0")}${data[2].toString(16).padStart(2,"0")}`;

    callback(hex);
  };

  img.src = url;
}
function oscurecerHex(hex, porcentaje) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  r = Math.floor(r * (1 - porcentaje));
  g = Math.floor(g * (1 - porcentaje));
  b = Math.floor(b * (1 - porcentaje));

  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
}
btn2.addEventListener("click", () => {
  aplicarWallpaper(select2.value);
  actualizarMetroAccent();
});
input3.addEventListener("input", () => {
  document.body.style.backgroundImage = "none";
  document.body.style.backgroundColor = input3.value;

  actualizarMetroAccent();
});
const observer = new MutationObserver(() => {
  actualizarMetroAccent();
});

observer.observe(document.body, {
  attributes: true,
  attributeFilter: ["class", "style"]
});
btn.addEventListener("click", () => {
  document.body.className = select.value;
  actualizarMetroAccent();
});
btn2.addEventListener("click", () => {
  aplicarWallpaper(select2.value);
  actualizarMetroAccent();
});
input3.addEventListener("input", () => {
  document.body.style.backgroundImage = "none";
  document.body.style.backgroundColor = input3.value;

  actualizarMetroAccent();
});
btnURL.addEventListener("click", () => {
  const url = inputURL.value.trim();

  if (!url) return;

  document.body.style.backgroundColor = "";
  document.body.style.backgroundImage = `url("${url}")`;

  actualizarMetroAccent();
});
const uploadInput = document.getElementById("wallpaper_upload");
const uploadBtn = document.querySelector(".apply_uploaded_wallpaper");

uploadBtn.addEventListener("click", () => {
  const file = uploadInput.files[0];

  if (!file) {
    alert("Selecciona una imagen primero");
    return;
  }

  const imageUrl = URL.createObjectURL(file);

  document.body.style.backgroundColor = "";
  document.body.style.backgroundImage = `url("${imageUrl}")`;

  actualizarMetroAccent();
});
console.log(document.querySelector(".mi_clase"));
const jsonInput = document.getElementById("style_json_upload");
const jsonBtn = document.getElementById("apply_style_json");

jsonBtn.addEventListener("click", () => {
    const file = jsonInput.files[0];

    if (!file) {
        alert("Selecciona un archivo JSON");
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            // Validación básica
            if (data.type !== "bloxd_io_launcher_style_entries") {
                alert("Archivo incompatible");
                return;
            }

            aplicarDisenoJSON(data);

        } catch (err) {
            alert("JSON inválido");
            console.error(err);
        }
    };

    reader.readAsText(file);
});
function aplicarDisenoJSON(data) {

    // ======================
    // HTML additions
    // ======================
    if (data.contents.html?.add) {

        for (const selector in data.contents.html.add) {

            const target = document.querySelector(selector);

            if (!target) continue;

            const grupos = data.contents.html.add[selector];

            for (const groupKey in grupos) {

                const label = groupKey.split("label=")[1];

                const optgroup = document.createElement("optgroup");
                optgroup.label = label;

                grupos[groupKey].forEach(optionString => {

                    const parts = optionString.split(".");

                    const option = document.createElement("option");

                    parts.forEach(part => {
                        if (part.startsWith("value=")) {
                            option.value = part.replace("value=", "");
                        }
                        if (part.startsWith("label=")) {
                            option.textContent = part.replace("label=", "");
                        }
                    });

                    optgroup.appendChild(option);
                });

                target.appendChild(optgroup);
            }
        }
    }

    // ======================
    // CSS additions
    // ======================
    if (data.contents.css) {

        const style = document.createElement("style");

        let cssText = "";

        for (const selector in data.contents.css) {

            cssText += `${selector} {`;

            const rules = data.contents.css[selector];

            for (const property in rules) {
                cssText += `${property}: ${rules[property]};`;
            }

            cssText += `}`;
        }

        style.textContent = cssText;

        document.head.appendChild(style);
    }

    alert("Diseño importado correctamente");
}
if (data.contents.js?.code) {

    data.contents.js.code.forEach(line => {
        try {
            new Function(line)();
        } catch (err) {
            console.error("Error en JS del diseño:", err);
        }
    });

}
function validarTopbarsEstricto() {
    const topbars = document.querySelectorAll(".topbar");

    for (const topbar of topbars) {
        const closeBtn = topbar.querySelector(".close");

        if (!closeBtn) {
            throw new Error(
                "JS tiene topbars que no tienen botón para cerrar, no está permitido"
            );
        }
    }
}
