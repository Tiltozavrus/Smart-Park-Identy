# Settings

This project require env file in the root with next params

```bash
IDENTY_DATABASE_URI="postgresql://root:root@localhost:5432/identy"
IDENTY_SECRET="super_secret"
IDENTY_REFRESH_SECRET="refresh_super_secret"
```

# Docs

## Project docs

To lauch projects docs run in terminal:
```bash
npx @compodoc/compodoc -p tsconfig.json -s 
```

That's command will generate docs in `documantation` dir and run it on [http://localhost:8080](http://localhost:8080)

## Swagger docs

When you launch server that starts swagger docs on http://localhost:3000/swagger/