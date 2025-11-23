# Deploying to Vercel

This repo is a Create React App + Hardhat project. To deploy the frontend to Vercel, follow one of these options.

1) Quick deploy with Vercel CLI (interactive)

```bash
# Install Vercel CLI if you don't have it
npx vercel login
npx vercel --prod
```

When prompted, choose the project settings. Vercel will run `npm run build` (configured in `vercel.json`) and serve the `build/` directory.

2) GitHub/GitLab/Bitbucket integration (recommended for CI)

- Push this repo to GitHub.
- In Vercel (https://vercel.com), import the repository and set:
  - Framework Preset: `Create React App`
  - Build Command: `npm run build`
  - Output Directory: `build`

3) Environment variables

- Do not commit private keys to the repository. For contract deployment or runtime RPC URLs set these via the Vercel project Settings -> Environment Variables.

Notes
- The repo contains `vercel.json` to instruct Vercel to use `@vercel/static-build` and serve the `build` folder.
- If you want the frontend to point at contract addresses on a testnet, update `src/contracts/contract-address.json` (or set runtime config via env variables and read them in the app).
