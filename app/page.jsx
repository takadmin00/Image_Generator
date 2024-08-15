"use client";

import { useState } from "react";
import { ImageGenerator } from "./ImageGenerator";
import { renderPNG } from "./render-png.js";

export default function Home() {
  const [image, setImage] = useState(null);
  const [settings, setSettings] = useState({
    padding: 16,
    radius: 4,
    shadow: 8,
  });

  const setSetting = (name, value) => {
    setSettings((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const file = files[0];
    console.log(file);

    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();

      img.onload = function () {
        setImage({
          width: img.width,
          height: img.height,
          src: e.target.result,
          name: file.name,
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="flex flex-col items-center justify-center max-w-4xl min-h-screen gap-8 p-4 mx-auto lg:flex-row">
      <div className="flex-1 p-4 shadow-xl card bg-base-200">
        <div className="card-body">
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text">Pick a file</span>
            </div>
            <input
              type="file"
              className="w-full file-input file-input-primary file-input-bordered"
              onChange={handleImageChange}
            />
          </label>
          <label className="w-full mt-4 form-control">
            <div className="label">
              <span className="label-text">Padding</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.padding}
              onChange={(e) => setSetting("padding", Number(e.target.value))}
              className="range"
              step="5"
            />
          </label>
          <label className="w-full mt-4 form-control">
            <div className="label">
              <span className="label-text">Radius</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.radius}
              onChange={(e) => setSetting("radius", Number(e.target.value))}
              className="range"
              step="5"
            />
          </label>
          <label className="w-full mt-4 form-control">
            <div className="label">
              <span className="label-text">Shadow</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.shadow}
              onChange={(e) => setSetting("shadow", Number(e.target.value))}
              className="range"
              step="5"
            />
          </label>
        </div>
      </div>
      <div className="flex flex-col items-center flex-1">
        <div
          style={{
            maxWidth: 400,
          }}
          className="w-full max-w-md mb-4 overflow-hidden border h-fit"
        >
          <ImageGenerator image={image} settings={settings} />
        </div>
        <button
          className="btn btn-primary"
          disabled={!image}
          onClick={async () => {
            if (!image) return;

            try {
              const { blob } = await renderPNG({
                image,
                settings,
              });

              if (!blob) {
                console.error("Le blob est indéfini.");
                return;
              }

              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = image.name.replace(".png", "-elevation.png");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } catch (error) {
              console.error("Erreur lors du téléchargement :", error);
            }
          }}
        >
          Download
        </button>
      </div>
    </main>
  );
}
