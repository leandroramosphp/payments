#!/bin/bash

how_to_use() {
	echo
	echo "$0 env version"
	echo "    Instala todas as migracoes necessarias a partir da versao informada para que o banco fique na versao mais atualizada"
	echo
	echo "    env: Ambiente de desenvolvimento"
	echo "        [prod, staging, dev, demo, testing]"
	echo "    version: Versao atual do banco"
	echo "        v0"
}

env="$1"
version="$2"

# Converte o env no banco certo
if [ "$env" = "prod" ]; then
	database="elephant"
elif [ "$env" = "staging" ]; then
	database="elephant_staging"
elif [ "$env" = "dev" ]; then
	database="elephant_dev"
elif [ "$env" = "demo" ]; then
	database="elephant_demo"
elif [ "$env" = "testing" ]; then
	database="elephant_test"
else
	how_to_use
	exit 1
fi

# Se a versao nao foi informada exibe o menu de ajuda
if [[ -z $version || $version != v* ]] ; then
	how_to_use
	exit 1
fi

echo " =========================================  "
echo "            Iniciando Migracao"
echo " =========================================  "


for migration in $(ls v*.sql | sort); do
	if [[ $migration > $version && $migration == *.sql ]]; then
		echo
    	echo " ==========  Executando migracao: $migration ==========  "
		psql -h localhost -U postgres -d $database < $migration
	fi
done

echo " =========================================  "
echo "              Fim na Migracao"
echo " =========================================  "
