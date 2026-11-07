# CarnashBotRankView

Overlay de rango de League of Legends para OBS. Muestra la insignia, la liga, los LP y el winrate de un invocador, y se actualiza solo cada minuto.

## Uso

Añade como fuente de navegador en OBS la URL con la región y el Riot ID (`nombre-tag`):

```text
http://localhost:3010/EUW/xabyxd-6666
```

También existe la API JSON: `/api/rank/EUW/xabyxd-6666`.

Regiones válidas: EUW, EUNE, NA, KR, JP, BR, LAN, LAS, OCE, TR, RU.

## Requisitos

- Node.js >= 22 (ver `.nvmrc`)

## Desarrollo

```bash
npm install
npm run dev     # nodemon, se reinicia al guardar
npm start       # arranque normal
```

En Windows también sirve `lol-rank-starter.bat` (usa su propia carpeta, no hace falta editar rutas).

## Producción (PM2)

```bash
npm ci --omit=dev
pm2 start ecosystem.config.cjs
pm2 save
```

El proceso se llama `lol-rank-overlay` y escucha en el puerto 3010.

### Certificado de Let's Encrypt

`deploy-hooks/lol-rank-overlay.sh` copia el certificado a `/etc/ssl/lol-rank-overlay` y reinicia el proceso tras cada renovación. Se instala como hook de Certbot:

```bash
sudo cp deploy-hooks/lol-rank-overlay.sh /etc/letsencrypt/renewal-hooks/deploy/
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/lol-rank-overlay.sh
```

## Licencia

Apache-2.0
