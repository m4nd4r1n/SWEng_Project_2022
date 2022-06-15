# 2022 SW Engineering Project - Danggeun Nara

## Deployment

### [Link](https://swe-ng-project-2022.vercel.app/)

<br>

## Requirement

1. [Node.js](https://nodejs.org/ko/) (v16.14 LTS)
2. [Yarn](https://yarnpkg.com/)
3. [PlanetScale CLI](https://github.com/planetscale/cli#installation)

> VSCode Extension (option)
>
> - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
> - [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)

## How to run

1. Type `pscale auth login` in your terminal to login to PlanetScale.
2. Type `pscale database create <DB name> --region ap-northeast` in your terminal to create DB.
3. Type `pscale connect <DB name>` in your ternimal to connect DB.
   > If MySQL is running, there is port conflict, so type `pscale connect <DB name> --port <port number except 3306>`.
4. Add `DATABASE_URL="mysql://127.0.0.1:<port>/<DB name>"` and `SESSION_PASSWORD=<String of 32 or more characters>` into `.env` file.
5. Run `yarn install` in project folder.
6. Run `npx prisma db push`.
8. Run `yarn dev` and access [http://localhost:3000](http://localhost:3000) with your browser.
   > Before running `yarn dev`, you should connect DB first.

> To use all functionality (e.g. image upload, chat, stream), add followings into `.env` file.  
> `NEXT_PUBLIC_CHAT_API=<Ably token>`  
> `CF_ID=<CloudFlare ID>`  
> `CF_IMAGES_TOKEN=<CloudFlare image token>`  
> `CF_STREAM_TOKEN=<CloudFlare stream token>`  
> `NEXT_PUBLIC_KAKAO_MAP=<Kakao map token>`
