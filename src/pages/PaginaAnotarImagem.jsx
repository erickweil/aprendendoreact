import AnotarImagem from "../components/AnotarImagem/AnotarImagem";
import "../components/AnotarImagem/anotar.css";

import React, { useCallback, useEffect, useMemo, useState } from "react";

const PaginaAnotarImagem = () => {

    const [files, setFiles] = useState(["folha_de_saopaulo06091996.png"]);
    const [options, setOptions] = useState({
        DEBUG:false,
        interactionStyle:"drag"
    });

// https://retool.com/blog/building-a-file-picker-component-in-react/
    const mudouImagem = (ev) => {
        if(ev && ev.target && ev.target.files && ev.target.files.length > 0)
        {
            // https://webplatform.github.io/docs/concepts/programming/drawing_images_onto_canvas/
            let fileSelected = ev.target.files[0];
            
            // Check that the file is an image
            if(fileSelected.type !== '' && !fileSelected.type.match('image.*'))
            {
                return;
            }

            // https://stackoverflow.com/questions/31742072/filereader-vs-window-url-createobjecturl
            // Create a data URL from the image file
            // REMEMBER TO REVOKE IT AFTER WITH 'URL.revokeObjectURL'
            var imageURL = URL.createObjectURL(fileSelected); 

            setFiles([imageURL]);
        }
    };


    return (
        <div className="framecontainer">
            <div className="frameinfo">
            <form className="frameinfocontent">
            <input type="file" name="imagem" onChange={mudouImagem} accept="image/png, image/jpeg"/>
            <br/>
            DEBUG:<input type="checkbox" name="DEBUG" checked={options.DEBUG} onChange={(e) => {
                options.DEBUG = !options.DEBUG;
                setOptions({...options});
            }} />
            <br/>
            <label for="interacao">Interação:</label>
            <select name="interacao" value={options.interactionStyle} onChange={(e) => {
                options.interactionStyle = e.target.value;
                setOptions({...options});
            }}>
            <option value="click">Apenas Clique</option>
            <option value="drag">Clique Arraste</option>
            </select>
            </form>
            </div>
            <div className="framebackground">
                <div>
                <AnotarImagem imagem={files[0]} options={options}
                />
                </div>
            </div>
        </div>
    );
};

export default PaginaAnotarImagem;