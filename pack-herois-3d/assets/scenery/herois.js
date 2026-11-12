// Objetos de cena dos heróis (reaproveitam as peças dos personagens em assets/characters/acessorios.js).

import { register } from './kit.js';
import { montarEscudo } from '../characters/acessorios.js';

register('escudo_heroi', {
  category: 'formas',
  label: 'Escudo de herói',
  description: 'Escudo redondo com aro e emblema próprio, igual ao do Capitão Tampa. Em pé (face para +Z); para o voo do arremesso use anim (pos + gira com eixo "z" ou "y"). 0,6 m.',
  params: {
    cor: ['#b9c2cc', 'cor do escudo'], borda: ['#c8893a', 'cor do aro'], miolo: ['#d5dbe2', 'cor do centro'],
    simbolo: ['espiral', 'emblema (raio, cometa, espiral, aranha_fofa, coruja, brilho)'], corSimbolo: ['#c8893a', 'cor do emblema'],
  },
  variants: { cometa: { simbolo: 'cometa', corSimbolo: '#ff7a1a', borda: '#1aa6a6' } },
  make(g, p) {
    const e = montarEscudo(p);
    e.position.y = 0.33;
    g.add(e);
  },
});
