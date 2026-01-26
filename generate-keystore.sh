#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔐 Generador de Keystore Seguro${NC}"
echo -e "${BLUE}================================${NC}\n"

echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo -e "  Este script generará tu keystore con contraseñas SEGURAS"
echo -e "  Debes proporcionar contraseñas fuertes (mínimo 12 caracteres)"
echo -e "  Guarda estas contraseñas en un lugar SEGURO\n"

# Verificar si el keystore ya existe
if [ -f "impostor-release-key.jks" ]; then
    echo -e "${RED}❌ Error: impostor-release-key.jks ya existe${NC}"
    echo -e "${YELLOW}Elimínalo primero si quieres regenerar:${NC}"
    echo -e "  ${BLUE}rm impostor-release-key.jks${NC}"
    exit 1
fi

# Solicitar información
echo -e "${YELLOW}1️⃣  Información Personal${NC}"
read -p "Nombre completo: " fullname
read -p "Unidad organizativa (ej: Development): " ou
read -p "Organización (ej: Mi Empresa): " org
read -p "Ciudad: " city
read -p "Estado/Provincia: " state
read -p "País (código de 2 letras, ej: ES): " country

echo ""
echo -e "${YELLOW}2️⃣  Contraseña del Keystore${NC}"
echo -e "${RED}⚠️  IMPORTANTE: Usa una contraseña FUERTE (mínimo 12 caracteres)${NC}"
echo -e "    Incluye mayúsculas, minúsculas, números y símbolos"
read -sp "Contraseña del keystore: " keystore_password
echo ""
read -sp "Confirma la contraseña: " keystore_password_confirm
echo ""

if [ "$keystore_password" != "$keystore_password_confirm" ]; then
    echo -e "${RED}❌ Las contraseñas no coinciden${NC}"
    exit 1
fi

if [ ${#keystore_password} -lt 12 ]; then
    echo -e "${RED}❌ La contraseña debe tener mínimo 12 caracteres${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}3️⃣  Contraseña de la Clave Privada${NC}"
echo -e "${RED}⚠️  IMPORTANTE: Usa una contraseña FUERTE (mínimo 12 caracteres)${NC}"
echo -e "    Puede ser diferente a la del keystore"
read -sp "Contraseña de la clave: " key_password
echo ""
read -sp "Confirma la contraseña: " key_password_confirm
echo ""

if [ "$key_password" != "$key_password_confirm" ]; then
    echo -e "${RED}❌ Las contraseñas no coinciden${NC}"
    exit 1
fi

if [ ${#key_password} -lt 12 ]; then
    echo -e "${RED}❌ La contraseña debe tener mínimo 12 caracteres${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}4️⃣  Generando keystore...${NC}"

# Generar keystore
keytool -genkey -v \
    -keystore impostor-release-key.jks \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -alias impostor-key \
    -storepass "$keystore_password" \
    -keypass "$key_password" \
    -dname "CN=$fullname, OU=$ou, O=$org, L=$city, ST=$state, C=$country"

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Keystore generado exitosamente${NC}"
else
    echo -e "\n${RED}❌ Error al generar keystore${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}5️⃣  Creando archivo de configuración...${NC}"

# Crear archivo de propiedades
cat > frontend/android/key.properties << EOF
storeFile=../../impostor-release-key.jks
storePassword=$keystore_password
keyAlias=impostor-key
keyPassword=$key_password
EOF

echo -e "${GREEN}✅ Archivo key.properties creado${NC}"

echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}✅ Keystore generado exitosamente${NC}"
echo -e "${BLUE}================================${NC}\n"

echo -e "${YELLOW}📋 Información del Keystore:${NC}"
echo -e "  ${BLUE}Archivo: impostor-release-key.jks${NC}"
echo -e "  ${BLUE}Alias: impostor-key${NC}"
echo -e "  ${BLUE}Algoritmo: RSA 2048-bit${NC}"
echo -e "  ${BLUE}Validez: 10,000 días${NC}"
echo -e "  ${BLUE}Propietario: $fullname${NC}\n"

echo -e "${RED}⚠️  IMPORTANTE - GUARDA ESTAS CONTRASEÑAS:${NC}"
echo -e "  ${YELLOW}Contraseña del keystore:${NC} (la que acabas de ingresar)"
echo -e "  ${YELLOW}Contraseña de la clave:${NC} (la que acabas de ingresar)\n"

echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo -e "  1. Guarda las contraseñas en un lugar SEGURO"
echo -e "  2. Haz backup del keystore:"
echo -e "     ${BLUE}mkdir -p ~/backup/impostor-game${NC}"
echo -e "     ${BLUE}cp impostor-release-key.jks ~/backup/impostor-game/${NC}"
echo -e "  3. Genera el APK:"
echo -e "     ${BLUE}bash build-release.sh${NC}\n"

echo -e "${GREEN}¡Listo! Tu keystore está seguro. 🔐${NC}\n"
