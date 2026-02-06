/**
 * Gestion des catégories — chemins Firebase et helpers
 */
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
