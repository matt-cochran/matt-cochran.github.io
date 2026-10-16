import {createHash} from 'node:crypto';

// Approved Cochranweb editorial banner system, 2026-10-16.
export const STYLE = Object.freeze({
  version: 1, width: 1440, height: 320,
  paper: '#f2efe8', paperDeep: '#e9e5db', ink: '#162536', accent: '#567a9b', rule: '#cfc9be',
  motifs: ['branches', 'grid', 'layers', 'handoffs'],
});

export function renderBanner(slug, motif = 'branches') {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw Error('Use a lowercase article slug.');
  if (!STYLE.motifs.includes(motif)) throw Error('Choose branches, grid, layers, or handoffs.');
  const seed = createHash('sha256').update(slug).digest().readUInt16BE(0);
  const shift = seed % 41 - 20;
  const {paper, paperDeep, ink, accent, rule, width, height} = STYLE;
  const circle = (x,y,r=7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${paper}" stroke="${ink}" stroke-width="2"/>`;
  let drawing;
  if (motif === 'branches') {
    const nodes = [288,472,740,1016,1264].map(x=>x+shift);
    drawing = `<g stroke="${rule}" opacity=".4"><circle cx="${nodes[1]}" cy="160" r="116"/><circle cx="${nodes[1]}" cy="160" r="80"/><circle cx="${nodes[3]}" cy="160" r="102"/></g>
      <g stroke="${accent}" stroke-width="2" stroke-linecap="round" opacity=".6">
      <path d="M${nodes[0]} 160C360 160 338 64 420 64H624"/>
      <path d="M${nodes[1]} 160C552 160 548 260 636 260H806"/>
      <path d="M${nodes[2]} 160C824 160 800 72 892 72H1136"/>
      <path d="M${nodes[3]} 160C1100 160 1072 248 1170 248H1344"/></g>
      <path d="M-24 220H112C188 220 192 160 272 160H1464" stroke="${ink}" stroke-width="3"/>
      ${nodes.map(x=>circle(x,160)).join('')}
      <g fill="${accent}"><circle cx="624" cy="64" r="4"/><circle cx="806" cy="260" r="4"/><circle cx="1136" cy="72" r="4"/><circle cx="1344" cy="248" r="4"/></g>`;
  } else if (motif === 'grid') {
    drawing = `<g stroke="${rule}" opacity=".65">${[110,270,430,590,750,910,1070,1230,1390].map(x=>`<path d="M${x+shift} 48V272"/>`).join('')}${[64,128,192,256].map(y=>`<path d="M48 ${y}H1392"/>`).join('')}</g>
      <path d="M-24 256H${270+shift}V192H${590+shift}V128H${1070+shift}V64H1464" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
      ${[[270,192],[590,128],[1070,64]].map(([x,y])=>circle(x+shift,y)).join('')}
      <g fill="${accent}" opacity=".2"><rect x="${430+shift}" y="64" width="160" height="64"/><rect x="${910+shift}" y="192" width="160" height="64"/></g>`;
  } else if (motif === 'layers') {
    drawing = `<g transform="translate(${shift} 0)">${[0,1,2,3].map(i=>`<rect x="${180+i*245}" y="${58+i%2*28}" width="300" height="174" rx="12" fill="${paper}" fill-opacity=".55" stroke="${i===2?ink:accent}" stroke-opacity="${i===2?1:.35}" stroke-width="${i===2?2:1}"/>`).join('')}</g>
      <path d="M-24 160H1464" stroke="${ink}" stroke-width="2" stroke-dasharray="2 9" opacity=".35"/>${[300,600,900,1200].map(x=>circle(x+shift,160,5)).join('')}`;
  } else {
    drawing = `<path d="M-24 160H1464" stroke="${accent}" stroke-width="2" opacity=".4"/>${[220,550,880,1210].map((x,i)=>`<g transform="translate(${x+shift} 160)"><rect x="-63" y="-57" width="126" height="114" rx="12" fill="${paper}" stroke="${i===1?ink:rule}" stroke-width="2"/><path d="M-31 -18H31M-31 0H12M-31 18H23" stroke="${accent}" stroke-width="2" opacity=".5"/>${circle(63,0,5)}</g>`).join('')}`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
<!-- Cochranweb editorial banner v${STYLE.version}; motif: ${motif}; stable variation by article slug. -->
<defs><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="${ink}" opacity=".12"/></pattern><linearGradient id="paper"><stop stop-color="${paperDeep}"/><stop offset=".55" stop-color="${paper}"/><stop offset="1" stop-color="${paperDeep}"/></linearGradient></defs>
<path fill="url(#paper)" d="M0 0h${width}v${height}H0z"/><path fill="url(#dots)" d="M0 0h${width}v${height}H0z"/>
${drawing}<path d="M0 319.5H1440" stroke="${rule}"/>
</svg>\n`;
}
