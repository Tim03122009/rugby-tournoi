import { db, ref, set } from './database.js';

window.genererTournoi = function() {
    const nbTerrains = document.getElementById('terrains').value;
    const equipes = document.getElementById('equipes').value.split('\n').filter(e => e.trim() !== "");
    const arbitres = document.getElementById('arbitres').value.split('\n').filter(a => a.trim() !== "");
    
    // Logique simplifiée de génération
    let matchs = [];
    for (let i = 0; i < equipes.length; i++) {
        for (let j = i + 1; j < equipes.length; j++) {
            matchs.push({ t1: equipes[i], t2: equipes[j], score1: 0, score2: 0, termine: false });
        }
    }

    // Envoi à la base de données
    set(ref(db, 'tournoi/'), {
        config: { nbTerrains, matchesTotal: matchs.length },
        listeMatchs: matchs,
        arbitres: arbitres
    }).then(() => {
        alert("Tournoi prêt ! Les arbitres peuvent se connecter.");
    });
}
