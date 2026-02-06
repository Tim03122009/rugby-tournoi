import { db, ref, set } from './database.js';
import { categoryConfigPath, categoryMatchsPath } from './categories.js';

/**
 * Round-robin Berger : chaque équipe joue un match contre toutes les autres exactement une fois.
 * Un TOUR = une salve = 1 match max par terrain (T1, T2... jouent en parallèle).
 * Le nombre de tours varie selon nbTerrains : plus de terrains = moins de tours.
 */
function buildPlanning(nbTerrains, duree, equipes, listeArb) {
    const n = equipes.length;
    const bergerMatches = []; // { t1, t2, exempte }

    for (let r = 0; r < n - 1; r++) {
        let equipeExempte = "";
        for (let i = 0; i < n / 2; i++) {
            const e1 = equipes[i];
            const e2 = equipes[n - 1 - i];
            if (e1 === "REPOS_FICTIF" || e2 === "REPOS_FICTIF") {
                equipeExempte = (e1 === "REPOS_FICTIF") ? e2 : e1;
            } else {
                bergerMatches.push({ t1: e1, t2: e2, exempte: equipeExempte });
            }
        }
        equipes.splice(1, 0, equipes.pop());
    }

    // Répartir les matchs en tours — CONTRAINTE ABSOLUE : jamais 2 repos d'affilée.
    // On utilise le tri des matchs Berger : on essaie plusieurs ordonnancements pour trouver un planning valide.
    const equipesReelles = [...new Set(bergerMatches.flatMap(m => [m.t1, m.t2]).filter(e => e !== "REPOS_FICTIF"))];

    function countRemainingMatches(team, u) {
        return u.filter(m => m.t1 === team || m.t2 === team).length;
    }

    function buildToursFromOrder(bergerOrder) {
        const u = bergerOrder.map(m => ({ ...m }));
        const tours = [];
        const consecutiveRests = {};

        while (u.length > 0) {
            const matchsDuTour = [];
            const equipesDuTour = new Set();
            const mustPlay = equipesReelles.filter(eq => (consecutiveRests[eq] ?? 0) >= 1);

            // Phase 1 : mustPlay (équipes qui ont déjà reposé)
            const stillMustPlay = new Set(mustPlay);
            while (stillMustPlay.size > 0 && matchsDuTour.length < nbTerrains) {
                let bestIdx = -1;
                let bestCovers = 0;
                for (let i = 0; i < u.length; i++) {
                    const m = u[i];
                    if (equipesDuTour.has(m.t1) || equipesDuTour.has(m.t2)) continue;
                    const c1 = stillMustPlay.has(m.t1), c2 = stillMustPlay.has(m.t2);
                    if (!c1 && !c2) continue;
                    const covers = (c1 ? 1 : 0) + (c2 ? 1 : 0);
                    if (covers > bestCovers) { bestCovers = covers; bestIdx = i; }
                }
                if (bestIdx < 0) break;
                const chosen = u.splice(bestIdx, 1)[0];
                matchsDuTour.push(chosen);
                equipesDuTour.add(chosen.t1).add(chosen.t2);
                stillMustPlay.delete(chosen.t1);
                stillMustPlay.delete(chosen.t2);
                consecutiveRests[chosen.t1] = 0;
                consecutiveRests[chosen.t2] = 0;
            }
            if (stillMustPlay.size > 0) return null;

            // Phase 2 : priorité aux équipes "critiques" (1 match restant), puis espacer les repos
            while (matchsDuTour.length < nbTerrains) {
                let bestIdx = -1;
                let bestScore = -1;
                let bestCrit = -1;
                for (let i = 0; i < u.length; i++) {
                    const m = u[i];
                    if (equipesDuTour.has(m.t1) || equipesDuTour.has(m.t2)) continue;
                    const rest1 = consecutiveRests[m.t1] ?? 0, rest2 = consecutiveRests[m.t2] ?? 0;
                    const crit = (countRemainingMatches(m.t1, u) === 1 ? 1 : 0) + (countRemainingMatches(m.t2, u) === 1 ? 1 : 0);
                    const score = rest1 + rest2;
                    if (crit > bestCrit || (crit === bestCrit && score > bestScore)) {
                        bestCrit = crit;
                        bestScore = score;
                        bestIdx = i;
                    }
                }
                if (bestIdx < 0) break;
                const chosen = u.splice(bestIdx, 1)[0];
                matchsDuTour.push(chosen);
                equipesDuTour.add(chosen.t1).add(chosen.t2);
                consecutiveRests[chosen.t1] = 0;
                consecutiveRests[chosen.t2] = 0;
            }

            for (const eq of equipesReelles) {
                if (!equipesDuTour.has(eq)) consecutiveRests[eq] = (consecutiveRests[eq] ?? 0) + 1;
            }
            if (matchsDuTour.length > 0) tours.push(matchsDuTour);
        }
        return tours;
    }

    function buildToursFallback(bergerOrder) {
        const u = bergerOrder.map(m => ({ ...m }));
        const tours = [];
        const consecutiveRests = {};
        while (u.length > 0) {
            const matchsDuTour = [];
            const equipesDuTour = new Set();
            const mustPlay = equipesReelles.filter(eq => (consecutiveRests[eq] ?? 0) >= 1);
            const stillMustPlay = new Set(mustPlay);
            while (stillMustPlay.size > 0 && matchsDuTour.length < nbTerrains) {
                let bestIdx = -1, bestCovers = 0;
                for (let i = 0; i < u.length; i++) {
                    const m = u[i];
                    if (equipesDuTour.has(m.t1) || equipesDuTour.has(m.t2)) continue;
                    const c1 = stillMustPlay.has(m.t1), c2 = stillMustPlay.has(m.t2);
                    if (!c1 && !c2) continue;
                    const covers = (c1 ? 1 : 0) + (c2 ? 1 : 0);
                    if (covers > bestCovers) { bestCovers = covers; bestIdx = i; }
                }
                if (bestIdx < 0) break;
                const chosen = u.splice(bestIdx, 1)[0];
                matchsDuTour.push(chosen);
                equipesDuTour.add(chosen.t1).add(chosen.t2);
                stillMustPlay.delete(chosen.t1);
                stillMustPlay.delete(chosen.t2);
                consecutiveRests[chosen.t1] = 0;
                consecutiveRests[chosen.t2] = 0;
            }
            while (matchsDuTour.length < nbTerrains) {
                let bestIdx = -1, bestScore = -1;
                for (let i = 0; i < u.length; i++) {
                    const m = u[i];
                    if (equipesDuTour.has(m.t1) || equipesDuTour.has(m.t2)) continue;
                    const rest1 = consecutiveRests[m.t1] ?? 0, rest2 = consecutiveRests[m.t2] ?? 0;
                    const score = rest1 + rest2;
                    if (score > bestScore) { bestScore = score; bestIdx = i; }
                }
                if (bestIdx < 0) break;
                const chosen = u.splice(bestIdx, 1)[0];
                matchsDuTour.push(chosen);
                equipesDuTour.add(chosen.t1).add(chosen.t2);
                consecutiveRests[chosen.t1] = 0;
                consecutiveRests[chosen.t2] = 0;
            }
            for (const eq of equipesReelles) {
                if (!equipesDuTour.has(eq)) consecutiveRests[eq] = (consecutiveRests[eq] ?? 0) + 1;
            }
            if (matchsDuTour.length > 0) tours.push(matchsDuTour);
        }
        return tours;
    }

    // Essayer plusieurs ordres de matchs pour trouver un planning sans 2 repos d'affilée
    let tours = buildToursFromOrder(bergerMatches);
    const maxAttempts = 80;
    for (let attempt = 0; attempt < maxAttempts && !tours; attempt++) {
        const shuffled = [...bergerMatches].sort(() => Math.random() - 0.5);
        tours = buildToursFromOrder(shuffled);
    }
    if (!tours || tours.length === 0) {
        tours = buildToursFallback(bergerMatches);
    }

    // Construire le planning final
    const planning = [];
    let matchGlobalId = 1;
    let indexArb = 0;
    for (let t = 0; t < tours.length; t++) {
        const matchsDuTour = tours[t];
        for (let i = 0; i < matchsDuTour.length; i++) {
            const m = matchsDuTour[i];
            planning.push({
                id: matchGlobalId++,
                tour: t + 1,
                t1: m.t1,
                t2: m.t2,
                terrain: i + 1,
                duree,
                arbitre: listeArb[indexArb % listeArb.length] || "Libre",
                termine: false,
                exempte: m.exempte
            });
            indexArb++;
        }
    }

    return planning;
}

/** Vérifie : 1) tout le monde se rencontre, 2) une équipe = un seul match par tour. */
function verifierRoundRobin(planning, nbEquipesReelles) {
    const rencontres = new Set();
    const matchsParTour = {};
    for (const m of planning) {
        if (m.t1 === "REPOS_FICTIF" || m.t2 === "REPOS_FICTIF") continue;
        const paire = [m.t1, m.t2].sort().join(" vs ");
        rencontres.add(paire);
        matchsParTour[m.tour] = matchsParTour[m.tour] || new Set();
        if (matchsParTour[m.tour].has(m.t1) || matchsParTour[m.tour].has(m.t2)) {
            console.error("Erreur: équipe en double au tour", m.tour, m);
        }
        matchsParTour[m.tour].add(m.t1);
        matchsParTour[m.tour].add(m.t2);
    }
    const attendu = (nbEquipesReelles * (nbEquipesReelles - 1)) / 2;
    if (rencontres.size !== attendu) {
        console.warn("Round-robin incomplet:", rencontres.size, "rencontres, attendu", attendu);
    }
}

export function previewTournoi() {
    const nbTerrains = parseInt(document.getElementById('terrains').value) || 2;
    const duree = document.getElementById('dureeMatch').value || '10 min';
    let equipes = document.getElementById('equipes').value.split('\n').filter(e => e.trim() !== "");
    const listeArb = document.getElementById('arbitres').value.split('\n').filter(a => a.trim() !== "");
    if (equipes.length < 2) return null;
    if (equipes.length % 2 !== 0) equipes = [...equipes, "REPOS_FICTIF"];
    return buildPlanning(nbTerrains, duree, equipes, listeArb);
}

export function genererTournoi(categoryId = null) {
    const nbTerrains = parseInt(document.getElementById('terrains').value);
    const duree = document.getElementById('dureeMatch').value;
    let equipes = document.getElementById('equipes').value.split('\n').filter(e => e.trim() !== "");
    const listeArb = document.getElementById('arbitres').value.split('\n').filter(a => a.trim() !== "");

    if (equipes.length < 2) return alert("Besoin d'au moins 2 équipes !");
    if (nbTerrains < 1) return alert("Il faut au moins 1 terrain.");

    if (equipes.length % 2 !== 0) {
        equipes.push("REPOS_FICTIF");
    }

    const planning = buildPlanning(nbTerrains, duree, equipes, listeArb);
    verifierRoundRobin(planning, equipes.filter(e => e !== "REPOS_FICTIF").length);

    const config = {
        nbTerrains,
        equipes: document.getElementById('equipes').value.split('\n').filter(e => e.trim() !== ""),
        arbitres: listeArb,
        dureeMatch: duree
    };

    const basePath = categoryId ? `tournoi/categories/${categoryId}` : 'tournoi';
    set(ref(db, basePath), {
        config,
        listeMatchs: planning,
        lastUpdate: Date.now()
    }).then(() => alert("✅ Planning généré avec succès !"));
}
