import {renderUniqueBanner} from './banner-v2.mjs';
export const STYLE=Object.freeze({version:2,width:1440,height:320,paper:'#f2efe8',paperDeep:'#e9e5db',ink:'#162536',accent:'#567a9b',rule:'#cfc9be',motifs:['branches','grid','layers','handoffs']});
export function renderBanner(slug,motif='branches'){return renderUniqueBanner(slug,motif,STYLE);}
