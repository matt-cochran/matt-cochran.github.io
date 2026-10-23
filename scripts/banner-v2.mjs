import {createHash} from 'node:crypto';

// Each independently varied coordinate comes from the full article hash. This
// replaces v1's single 41-value horizontal shift. No random regeneration at build.
export function renderUniqueBanner(slug,motif,palette) {
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw Error('Use a lowercase article slug.');
 if(!['branches','grid','layers','handoffs'].includes(motif))throw Error('Choose branches, grid, layers, or handoffs.');
 const bytes=createHash('sha256').update('editorial-v2:'+slug).digest();
 const n=(i,min,max)=>Math.round(min+bytes[i%32]/255*(max-min));
 const {paper,paperDeep,ink,accent,rule}=palette;
 const node=(x,y,r=8)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${paper}" stroke="${ink}" stroke-width="2"/>`;
 let drawing='';
 if(motif==='branches') {
  const count=n(0,3,6),points=Array.from({length:count},(_,i)=>[Math.round(130+i*1160/(count-1))+n(i+1,-55,55),n(i+8,115,205)]);
  drawing=`<path d="M-20 ${points[0][1]} `+points.map(([x,y],i)=>`Q${x-75} ${y+n(i+15,-40,40)} ${x} ${y}`).join(' ')+` T1460 ${points.at(-1)[1]}" stroke="${ink}" stroke-width="3"/>`;
  points.forEach(([x,y],i)=>{const endY=i%2?n(i+16,235,280):n(i+16,40,85),endX=Math.min(1390,x+n(i+22,80,200));drawing+=`<path d="M${x} ${y}C${x+50} ${y} ${endX-60} ${endY} ${endX} ${endY}" stroke="${accent}" stroke-width="2" opacity=".6"/><circle cx="${endX}" cy="${endY}" r="4" fill="${accent}"/>`+node(x,y);});
 } else if(motif==='grid') {
  const xs=Array.from({length:7},(_,i)=>110+i*195+n(i,-35,35));
  drawing=xs.map(x=>`<path d="M${x} 40V280" stroke="${rule}"/>`).join('');
  drawing+=[65,130,195,260].map(y=>`<path d="M40 ${y}H1400" stroke="${rule}" opacity=".6"/>`).join('');
  const ys=[n(10,225,265),n(11,155,195),n(12,90,135),n(13,40,70)];
  drawing+=`<path d="M-20 ${ys[0]}H${xs[1]}V${ys[1]}H${xs[3]}V${ys[2]}H${xs[5]}V${ys[3]}H1460" stroke="${ink}" stroke-width="3"/>`;
  [1,3,5].forEach((c,i)=>{drawing+=node(xs[c],ys[i+1]);});
  [0,2,4].forEach((c,i)=>{drawing+=`<rect x="${xs[c]}" y="${n(i+17,55,210)}" width="${n(i+22,65,155)}" height="${n(i+25,24,55)}" fill="${accent}" opacity=".15"/>`;});
 } else if(motif==='layers') {
  const count=n(0,3,5);
  for(let i=0;i<count;i++){const x=100+i*1120/count+n(i+1,-25,25),y=n(i+8,40,115);drawing+=`<rect x="${x}" y="${y}" width="${n(i+14,210,330)}" height="${n(i+20,115,175)}" rx="12" fill="${paper}" fill-opacity=".6" stroke="${i===1?ink:accent}" stroke-width="2"/><path d="M${x+30} ${y+35}h${n(i+25,70,140)}" stroke="${accent}" opacity=".4"/>`;}
 } else {
  const count=n(0,3,5),points=Array.from({length:count},(_,i)=>[Math.round(180+i*1080/(count-1))+n(i+1,-35,35),n(i+8,110,210)]);
  drawing=`<path d="M-20 ${points[0][1]} `+points.map(([x,y])=>`L${x} ${y}`).join(' ')+` L1460 ${points.at(-1)[1]}" stroke="${accent}" stroke-width="2" opacity=".45"/>`;
  points.forEach(([x,y],i)=>{drawing+=`<rect x="${x-62}" y="${y-52}" width="124" height="104" rx="${n(i+15,8,20)}" fill="${paper}" stroke="${i===1?ink:rule}" stroke-width="2"/><path d="M${x-32} ${y-15}h${n(i+22,35,70)}m-${n(i+22,35,70)} 20h45" stroke="${accent}"/>`+node(x+62,y,5);});
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="320" viewBox="0 0 1440 320" fill="none">\n<!-- Editorial banner v2; topic: ${slug}; motif: ${motif}. -->\n<defs><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="${ink}" opacity=".1"/></pattern><linearGradient id="paper"><stop stop-color="${paperDeep}"/><stop offset=".55" stop-color="${paper}"/><stop offset="1" stop-color="${paperDeep}"/></linearGradient></defs><path fill="url(#paper)" d="M0 0h1440v320H0z"/><path fill="url(#dots)" d="M0 0h1440v320H0z"/>${drawing}<path d="M0 319.5H1440" stroke="${rule}"/></svg>\n`;
}
