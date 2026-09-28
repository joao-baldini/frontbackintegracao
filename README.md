# Consultas médicas — frontend + backend

Este repositório reúne o aplicativo Expo/React Native de
[frontend-consulta-V2](https://github.com/joao-baldini/frontend-consulta-V2)
(base `5bb6599`) e a API Spring Boot de
[backend-consulta-V2](https://github.com/joao-baldini/backend-consulta-V2)
(base `4f0107e`). O frontend acessa `/health`, `/pacientes`, `/medicos`,
`/especialidades` e `/consultas` pela URL configurada em
`EXPO_PUBLIC_API_URL`. A API permite as chamadas do Expo Web via CORS.

## Requisitos

- Java 17
- Node.js e npm
- Dois terminais, um para a API e outro para o aplicativo

## Executar

No primeiro terminal, a partir da raiz do repositório:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Em macOS/Linux, use `./mvnw spring-boot:run`. A API inicia na porta 8080.
Abra `http://localhost:8080/health` para verificar `{"status":"UP"}`.
O banco H2 é criado em `backend/data/`, que não é versionado.

No segundo terminal:

```powershell
cd frontend
npm ci
npm run web
```

Para o Expo Go ou emulador, use `npm start`. A URL padrão da API é
`http://localhost:8080` no navegador e simulador iOS, e
`http://10.0.2.2:8080` no emulador Android. Em um dispositivo físico, crie
`frontend/.env.local` com `EXPO_PUBLIC_API_URL=http://IP_DA_MAQUINA:8080`
(o telefone e a máquina devem estar na mesma rede). Reinicie o Expo após
alterar essa variável. Há um modelo em `frontend/.env.example`.

## Estrutura e verificação

- `backend/`: API Spring Boot, controladores e testes.
- `frontend/`: aplicativo Expo; `src/services/api.ts` configura o cliente HTTP.
- `frontend/src/styles/`: estilos extraídos das 11 telas e do `ConsultaCard`,
  com exportações em `index.ts`. A lógica, o JSX e os valores dos estilos
  originais foram preservados.

```powershell
cd backend
.\mvnw.cmd test

cd ..\frontend
npx tsc --noEmit
npx expo export --platform web
```

Após iniciar ambos, a tela inicial usa `/health` para indicar se a API está
online. Os fluxos de paciente e médico usam os endpoints acima para cadastro,
consulta, agendamento, confirmação e cancelamento.
