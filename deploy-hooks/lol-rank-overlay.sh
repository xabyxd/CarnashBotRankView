#!/bin/bash
# Copia el certificado de Let's Encrypt a una carpeta que el usuario user
# puede leer, y reinicia el proceso de PM2 para que cargue el nuevo certificado.
#
# Instalar como: /etc/letsencrypt/renewal-hooks/deploy/lol-rank-overlay.sh
# (debe ser ejecutable: sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/lol-rank-overlay.sh)
# Certbot lo ejecuta automáticamente tras cada renovación (como root).

set -e

DOMAIN="domainname.net"
DEST_DIR="/etc/ssl/lol-rank-overlay"
PM2_USER="user"

mkdir -p "$DEST_DIR"
cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$DEST_DIR/fullchain.pem"
cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$DEST_DIR/privkey.pem"

chown "$PM2_USER:$PM2_USER" "$DEST_DIR"/*.pem
chmod 600 "$DEST_DIR"/*.pem

# Reinicia el proceso para que cargue el certificado nuevo en memoria
su - "$PM2_USER" -c "pm2 restart lol-rank-overlay" || true
