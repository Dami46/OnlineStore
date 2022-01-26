# Timer

## Przygotowanie i uruchomienie środowiska
Do uruchomienia wymagany jest Python w wersji 3.9 oraz Node.js.
```
npm install --global azure-functions-core-tools@3
python -m venv .venv
.venv/scripts/activate
pip install -r requirements.txt
```

## Uruchomienie funkcji
```
func host start
```

## Publikacja funkcji na azure
```
func azure functionapp publish timer-dropki --publish-local-settings --additional-packages "build-essential libevent-dev unixodbc-dev"
```