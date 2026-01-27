# O Que Você Prefere? 🤔

> *Um jogo de enquetes com dilemas impossíveis. Vote, veja os resultados e descubra o que a comunidade dev pensa.*

## Sobre o Projeto

**"O Que Você Prefere?"** é um jogo de votação onde os usuários escolhem entre duas opções em dilemas do universo dev (e da vida). Cada rodada dura **2 horas**, e ao final, uma nova votação começa automaticamente com novas opções.

### Como Funciona

1. Uma pergunta aparece com duas opções
2. O usuário escolhe uma delas
3. Após votar, os resultados são revelados em tempo real
4. A cada 2 horas, novas opções são carregadas automaticamente

## Funcionalidades

- **Votação em tempo real** - Veja os resultados assim que votar
- **Contador regressivo** - Saiba quando a próxima rodada começa
- **Layout responsivo** - Funciona em desktop e mobile
- **Atualização automática** - Novas perguntas a cada 2 horas
- **Persistência de votos** - Não dá pra votar duas vezes na mesma rodada

## Arquitetura
```
┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │
│    Front-end    │◄────►│    Back-end     │
│                 │ API  │                 │
└─────────────────┘      └─────────────────┘
                               │
                               ▼
                         ┌───────────┐
                         │  Database │
                         └───────────┘
```

O sistema é composto por:

- **Front-end**: Interface responsiva que consome a API
- **Back-end**: API REST que gerencia as perguntas, votos e cronograma
- **JSON de perguntas**: Arquivo base para gerar novas perguntas (`votacao_opcoes_60.json`)
- **Database**: SQLite que armazena perguntas, opções e votos

> **TODO**: Atualmente as perguntas são importadas do JSON para o banco de dados. Seria legal manter a leitura direto do JSON para facilitar a adição de novas perguntas pela comunidade.

## Rodando Localmente

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Como rodar

1. Clone o repositório:
```bash
git clone https://github.com/codecon-dev/o-que-vc-prefere-dev.git
cd o-que-vc-prefere-dev
```

2. Suba os containers:
```bash
docker-compose up --build
```

3. Acesse no navegador:
```
http://localhost
```

### Comandos úteis
```bash
# Rodar em background
docker-compose up -d

# Parar os containers
docker-compose down

# Ver logs
docker-compose logs -f

# Rebuild forçado (se fizer mudanças no Dockerfile)
docker-compose build --no-cache
docker-compose up
```

## Contribuindo

Quer sugerir novas perguntas para o jogo? Abra uma issue com sua sugestão!

## Licença

MIT

---

*Projeto desenvolvido para o canal da [Codecon](https://youtube.com/codecondev)*
