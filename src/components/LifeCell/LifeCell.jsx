
import {useEffect, useState} from 'react';

function LifeCell(props) {

    let classe;

    if(props.vivo == 0)
        classe= "cell";
    else
        classe= "cell vivo";
        
    return <td className={classe} onClick={() => props.toggleCell(props.x,props.y)}></td>;
}

export default LifeCell;