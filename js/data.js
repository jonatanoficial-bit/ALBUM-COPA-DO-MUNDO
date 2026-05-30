const BUILD_INFO = {
  "version": "v1.0.0",
  "date": "30/05/2026",
  "time": "12:21",
  "name": "Build v1.0.0 — Base jogável"
};

const ALBUM_SECTIONS = [
  {
    "id": "brasil-1958",
    "title": "Brasil 1958",
    "description": "Primeira estrela brasileira na história mundial.",
    "theme": "gold"
  },
  {
    "id": "brasil-1962",
    "title": "Brasil 1962",
    "description": "O bicampeonato e a força de uma geração inesquecível.",
    "theme": "green"
  },
  {
    "id": "brasil-1970",
    "title": "Brasil 1970",
    "description": "A seleção que virou símbolo de futebol arte.",
    "theme": "blue"
  },
  {
    "id": "brasil-1994",
    "title": "Brasil 1994",
    "description": "A conquista que encerrou o jejum e reacendeu a nação.",
    "theme": "gold"
  },
  {
    "id": "brasil-2002",
    "title": "Brasil 2002",
    "description": "O pentacampeonato mundial brasileiro.",
    "theme": "green"
  },
  {
    "id": "copa-2026",
    "title": "Copa 2026",
    "description": "Espaço para as seleções atuais e futuras atualizações.",
    "theme": "blue"
  }
];

const STICKERS = [
  {
    "id": "bra-1958-001",
    "name": "Campeão 1958 #1",
    "team": "Brasil 1958",
    "section": "Brasil Pentacampeão",
    "number": 10,
    "position": "Atacante",
    "rarity": "lendaria",
    "image": "assets/images/stickers/brasil-1958/campeao-1958-01.webp"
  },
  {
    "id": "bra-1958-002",
    "name": "Campeão 1958 #2",
    "team": "Brasil 1958",
    "section": "Brasil Pentacampeão",
    "number": 7,
    "position": "Ponta",
    "rarity": "ouro",
    "image": "assets/images/stickers/brasil-1958/campeao-1958-02.webp"
  },
  {
    "id": "bra-1958-003",
    "name": "Campeão 1958 #3",
    "team": "Brasil 1958",
    "section": "Brasil Pentacampeão",
    "number": 9,
    "position": "Atacante",
    "rarity": "comum",
    "image": "assets/images/stickers/brasil-1958/campeao-1958-03.webp"
  },
  {
    "id": "bra-1958-004",
    "name": "Campeão 1958 #4",
    "team": "Brasil 1958",
    "section": "Brasil Pentacampeão",
    "number": 1,
    "position": "Goleiro",
    "rarity": "comum",
    "image": "assets/images/stickers/brasil-1958/campeao-1958-04.webp"
  },
  {
    "id": "bra-1962-001",
    "name": "Campeão 1962 #1",
    "team": "Brasil 1962",
    "section": "Brasil Pentacampeão",
    "number": 10,
    "position": "Meia",
    "rarity": "lendaria",
    "image": "assets/images/stickers/brasil-1962/campeao-1962-01.webp"
  },
  {
    "id": "bra-1962-002",
    "name": "Campeão 1962 #2",
    "team": "Brasil 1962",
    "section": "Brasil Pentacampeão",
    "number": 7,
    "position": "Ponta",
    "rarity": "ouro",
    "image": "assets/images/stickers/brasil-1962/campeao-1962-02.webp"
  },
  {
    "id": "bra-1962-003",
    "name": "Campeão 1962 #3",
    "team": "Brasil 1962",
    "section": "Brasil Pentacampeão",
    "number": 5,
    "position": "Volante",
    "rarity": "comum",
    "image": "assets/images/stickers/brasil-1962/campeao-1962-03.webp"
  },
  {
    "id": "bra-1962-004",
    "name": "Campeão 1962 #4",
    "team": "Brasil 1962",
    "section": "Brasil Pentacampeão",
    "number": 3,
    "position": "Zagueiro",
    "rarity": "comum",
    "image": "assets/images/stickers/brasil-1962/campeao-1962-04.webp"
  },
  {
    "id": "bra-1970-001",
    "name": "Campeão 1970 #1",
    "team": "Brasil 1970",
    "section": "Brasil Pentacampeão",
    "number": 10,
    "position": "Atacante",
    "rarity": "lendaria",
    "image": "assets/images/stickers/brasil-1970/campeao-1970-01.webp"
  },
  {
    "id": "bra-1970-002",
    "name": "Campeão 1970 #2",
    "team": "Brasil 1970",
    "section": "Brasil Pentacampeão",
    "number": 9,
    "position": "Atacante",
    "rarity": "ouro",
    "image": "assets/images/stickers/brasil-1970/campeao-1970-02.webp"
  },
  {
    "id": "bra-1970-003",
    "name": "Campeão 1970 #3",
    "team": "Brasil 1970",
    "section": "Brasil Pentacampeão",
    "number": 7,
    "position": "Ponta",
    "rarity": "comum",
    "image": "assets/images/stickers/brasil-1970/campeao-1970-03.webp"
  },
  {
    "id": "bra-1970-004",
    "name": "Campeão 1970 #4",
    "team": "Brasil 1970",
    "section": "Brasil Pentacampeão",
    "number": 4,
    "position": "Lateral",
    "rarity": "comum",
    "image": "assets/images/stickers/brasil-1970/campeao-1970-04.webp"
  },
  {
    "id": "bra-1994-001",
    "name": "Campeão 1994 #1",
    "team": "Brasil 1994",
    "section": "Brasil Pentacampeão",
    "number": 11,
    "position": "Atacante",
    "rarity": "lendaria",
    "image": "assets/images/stickers/brasil-1994/campeao-1994-01.webp"
  },
  {
    "id": "bra-1994-002",
    "name": "Campeão 1994 #2",
    "team": "Brasil 1994",
    "section": "Brasil Pentacampeão",
    "number": 9,
    "position": "Atacante",
    "rarity": "ouro",
    "image": "assets/images/stickers/brasil-1994/campeao-1994-02.webp"
  },
  {
    "id": "bra-1994-003",
    "name": "Campeão 1994 #3",
    "team": "Brasil 1994",
    "section": "Brasil Pentacampeão",
    "number": 5,
    "position": "Volante",
    "rarity": "comum",
    "image": "assets/images/stickers/brasil-1994/campeao-1994-03.webp"
  },
  {
    "id": "bra-1994-004",
    "name": "Campeão 1994 #4",
    "team": "Brasil 1994",
    "section": "Brasil Pentacampeão",
    "number": 1,
    "position": "Goleiro",
    "rarity": "comum",
    "image": "assets/images/stickers/brasil-1994/campeao-1994-04.webp"
  },
  {
    "id": "bra-2002-001",
    "name": "Campeão 2002 #1",
    "team": "Brasil 2002",
    "section": "Brasil Pentacampeão",
    "number": 9,
    "position": "Atacante",
    "rarity": "lendaria",
    "image": "assets/images/stickers/brasil-2002/campeao-2002-01.webp"
  },
  {
    "id": "bra-2002-002",
    "name": "Campeão 2002 #2",
    "team": "Brasil 2002",
    "section": "Brasil Pentacampeão",
    "number": 10,
    "position": "Meia",
    "rarity": "ouro",
    "image": "assets/images/stickers/brasil-2002/campeao-2002-02.webp"
  },
  {
    "id": "bra-2002-003",
    "name": "Campeão 2002 #3",
    "team": "Brasil 2002",
    "section": "Brasil Pentacampeão",
    "number": 11,
    "position": "Atacante",
    "rarity": "comum",
    "image": "assets/images/stickers/brasil-2002/campeao-2002-03.webp"
  },
  {
    "id": "bra-2026-001",
    "name": "Brasil 2026 #1",
    "team": "Brasil 2026",
    "section": "Copa 2026",
    "number": 7,
    "position": "Atacante",
    "rarity": "ouro",
    "image": "assets/images/stickers/copa-2026/brasil-2026-01.webp"
  }
];
