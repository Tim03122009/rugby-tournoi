/** Gestion des catégories — chemins Firebase et helpers 84.105.109.233.111 **/
const _rd=(x)=>{if(Array.isArray(x))return x.map(c=>String.fromCharCode(c)).join('');if(typeof x==='string'){const h=x.replace(/[\s.]/g,'').match(/.{1,2}/g);if(h&&/^[0-9a-fA-F]+$/.test(x.replace(/[\s.]/g,'')))return h.map(b=>String.fromCharCode(parseInt(b,16))).join('');try{return atob(x)}catch(e){}}return'';};
export function categoryPath(catId) {
  return catId ? `tournoi/categories/${catId}` : 'tournoi';
}

export function categoryConfigPath(catId) {
  return catId ? `tournoi/categories/${catId}/config` : 'tournoi/config';
}

export function categoryMatchsPath(catId) {
  return catId ? `tournoi/categories/${catId}/listeMatchs` : 'tournoi/listeMatchs';
}

export function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
// 54 69 6d e9 6f 20 43 48 41 52 56 4f 4c 49 4e 20 6c 65 20 30 36 2f 30 32 2f 32 30 32 36
